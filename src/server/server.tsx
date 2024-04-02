import axios from "axios";
import bcrypt from "bcrypt";
import express from "express";
import session, { SessionData } from "express-session";
import fs from "fs";
import nullthrows from "nullthrows";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { rpcHandler } from "typed-rpc/express";
import { Like } from "typeorm";
import { DB } from "./db";
import { PetProfile } from "./models/PetProfile";
import { PetTransferRequest } from "./models/PetTransferRequest";
import { Post } from "./models/Post";
import { UserAccount } from "./models/UserAccount";
import { UserProfile } from "./models/UserProfile";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: "sessionKey", saveUninitialized: false, resave: false })
);

app.post(
  "/api/rpc",
  rpcHandler((req) => new APIService(req.session as SessionData))
);

app.get("/ugc/*", (req, res) => {
  fs.readFile(`/${req.url}`, (err, data) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.send(data);
    }
  });
});

// Make sure this is always the last app.get() call
app.get("*", (_req, res) => {
  const html = ReactDOMServer.renderToString(
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="/css/app.css" rel="stylesheet" />
        <title>CPA</title>
      </head>
      <body>
        <div id="root"></div>
        <script src="/js/client.js" />
      </body>
    </html>
  );

  res.send(html);
});

class APIService {
  constructor(private session: SessionData) {}

  async createPetProfile(
    userId: number,
    profileInfo: Pick<
      PetProfile,
      "displayName" | "description" | "breed" | "color" | "age"
    > & {
      avatarData: string;
    }
  ) {
    const owner = await this.getUserProfile(userId);

    // New pet
    const newPet = new PetProfile();
    newPet.displayName = profileInfo.displayName;
    newPet.description = profileInfo.description;
    newPet.breed = profileInfo.breed;
    newPet.color = profileInfo.color;
    newPet.age = profileInfo.age;
    newPet.owner = owner;

    // Upload avatar
    {
      const fileId = `petavatar-${crypto.randomUUID()}`;
      const path = `/ugc/${fileId}`;
      const data = profileInfo.avatarData
        .replace("data:", "")
        .replace(/^.+,/, "");

      fs.writeFileSync(`public${path}`, data, "base64");
      newPet.avatarUrl = path;
    }

    await DB.save(newPet);
    return true;
  }

  async createPost(
    pictureData: string,
    caption: string,
    taggedPets: PetProfile[],
    visibility: "friends" | "public",
    userId: number
  ) {
    const author = await this.getUserProfile(userId);

    // New post
    const newPost = new Post();
    newPost.caption = caption;
    newPost.taggedPets = taggedPets;
    newPost.visibility = visibility;
    newPost.author = author;

    // Upload picture
    {
      const fileId = `post-${crypto.randomUUID()}`;
      const path = `/ugc/${fileId}`;
      const data = pictureData.replace("data:", "").replace(/^.+,/, "");

      fs.writeFileSync(`public${path}`, data, "base64");
      newPost.pictureURL = path;
    }

    await DB.save(newPost);
    return true;
  }

  async getPetsByUserId(userId: number) {
    const userProfile = await this.getUserProfile(userId);
    const pets = await DB.find(PetProfile, { where: { owner: userProfile } });

    return nullthrows(pets);
  }

  async updateUserAccount(id: number, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await DB.findOne(UserAccount, {
      where: { id: id },
    });

    if (user) {
      user.passwordHash = passwordHash;
      await DB.save(user);

      return true;
    } else {
      return false;
    }
  }

  async updateUserProfile(id: number, updatedInfo: Partial<UserProfile>) {
    const userProfile = await this.getUserProfile(id);

    for (const prop in updatedInfo) {
      if (updatedInfo[prop] !== undefined) {
        userProfile[prop] = updatedInfo[prop];
      }
    }

    await DB.save(userProfile);
    return true;
  }

  async updatePetProfile(id: number, updatedInfo: Partial<PetProfile>) {
    const petProfile = await this.getPetProfile(id);

    for (const prop in updatedInfo) {
      if (updatedInfo[prop] !== undefined) {
        petProfile[prop] = updatedInfo[prop];
      }
    }

    await DB.save(petProfile);
    return true;
  }

  async getUserProfile(id: number) {
    const user = await DB.findOne(UserProfile, {
      where: { id },
    });

    return nullthrows(user);
  }

  async getUserProfileByAccount(id: number) {
    const user = await DB.findOne(UserAccount, {
      where: { id },
    });

    return nullthrows(user).profile;
  }

  async getAllUserProfiles() {
    const user = await DB.find(UserProfile, {
      where: {},
    });

    return nullthrows(user);
  }

  async getPetProfile(id: number) {
    const pet = await DB.findOne(PetProfile, {
      where: { id },
      relations: { owner: true },
    });

    return nullthrows(pet);
  }

  async getCurrentUserAccountId() {
    return this.session.userId ?? null;
  }

  async getPetTransferRequests(userId: number) {
    return await DB.find(PetTransferRequest, {
      where: {
        reciever: {
          id: userId,
        },
      },
      relations: {
        pet: true,
      },
    });
  }

  async createPetTransferRequest(petId: number, recieverId: number) {
    const pet = await this.getPetProfile(petId);
    const reciever = await this.getUserProfile(recieverId);

    const isDuplicateRequest = await DB.exists(PetTransferRequest, {
      where: {
        pet,
        reciever,
      },
    });

    if (isDuplicateRequest) {
      return false;
    }

    const request = new PetTransferRequest();
    request.pet = await this.getPetProfile(petId);
    request.reciever = await this.getUserProfile(recieverId);

    await DB.save(request);
    return true;
  }

  async authLoginWithPassword(username: string, password: string) {
    // TODO: hash passwords for security
    const users = await DB.findBy(UserAccount, {
      username: username,
    });

    const user = users
      .filter((o) => o.passwordHash)
      .filter((o) => bcrypt.compareSync(password, o.passwordHash!))
      .at(0);

    if (user) {
      this.session.userId = user.id;
      return true;
    } else {
      return false;
    }
  }

  // Returns the next "count" feed posts
  async getFeedPostsForUser(userId: number, start: number, count: number) {
    // Home page: show all posts by the user or their friends. TODO: Implement
    // Profile page: if logged in as this user, show ALL posts by them. Else, show all public posts.

    const isAuthor = await this.checkCurrentUserIs(userId);
    const isFriendOfAuthor = false;

    const user = await this.getUserProfile(userId);
    const posts = await DB.find(Post, {
      where: {
        author: user,
        visibility: isAuthor || isFriendOfAuthor ? undefined : "public",
      },
      order: {
        creationDate: "DESC",
      },
      relations: ["taggedPets"],
    });

    return {
      posts: posts.slice(start, start + count),
      hasMore: posts.length > start + count,
    };
  }

  async getFeedPostsForPet(petId: number, start: number, count: number) {
    const pet = (
      await DB.find(PetProfile, {
        where: { id: petId },
        relations: ["taggedPosts", "taggedPosts.taggedPets"],
      })
    )[0];

    const posts = pet.taggedPosts;

    return {
      posts: posts.slice(start, start + count),
      hasMore: posts.length > start + count,
    };
  }

  async searchUsers(name: string, location: string | undefined) {
    return DB.find(UserProfile, {
      where: {
        location,
        displayName: Like(`%${name}%`),
      },
    });
  }

  async searchPets(
    name: string,
    location: string | undefined,
    id: number | undefined
  ) {
    return DB.find(PetProfile, {
      where: {
        id,
        displayName: Like(`%${name}%`),
        owner: {
          location,
        },
      },
    });
  }

  async authLoginWithGoogle(token: string) {
    const email = await axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data.email);

    const user = await DB.findOneBy(UserAccount, {
      username: email,
      passwordHash: undefined,
    });

    if (!user) {
      return false;
    }

    this.session.userId = user.id;
    return true;
  }

  async authSignupWithPassword(
    username: string,
    password: string,
    profileInfo: Pick<UserProfile, "displayName" | "location" | "language"> & {
      avatarData: string | null;
    }
  ) {
    const passwordHash = await bcrypt.hash(password, 10);

    // Check if username is taken before creating account
    const isNameInUse = await DB.exists(UserAccount, {
      where: { username: username },
    });

    if (isNameInUse) {
      return false;
    }

    // New user
    const newUser = new UserAccount();
    newUser.username = username;
    newUser.passwordHash = passwordHash;

    // New profile
    newUser.profile = new UserProfile();
    newUser.profile.displayName = profileInfo.displayName;
    newUser.profile.location = profileInfo.location;
    newUser.profile.language = profileInfo.language;

    if (profileInfo.avatarData) {
      const fileId = `avatar-${crypto.randomUUID()}`;
      const path = `/ugc/${fileId}`;
      const data = profileInfo.avatarData
        .replace("data:", "")
        .replace(/^.+,/, "");

      fs.writeFileSync(`public${path}`, data, "base64");
      newUser.profile.avatarUrl = path;
    }

    await DB.save(newUser);
    return await this.authLoginWithPassword(username, password);
  }

  async authSignupWithGoogle(
    token: string,
    profileInfo: Pick<UserProfile, "displayName" | "location" | "language"> & {
      avatarData: string | null;
    }
  ) {
    const email = await axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data.email);

    // New user
    const newUser = new UserAccount();
    newUser.username = email;

    // New profile
    newUser.profile = new UserProfile();
    newUser.profile.displayName = profileInfo.displayName;
    newUser.profile.location = profileInfo.location;
    newUser.profile.language = profileInfo.language;

    if (profileInfo.avatarData) {
      const fileId = `avatar-${crypto.randomUUID()}`;
      const path = `/ugc/${fileId}`;
      const data = profileInfo.avatarData
        .replace("data:", "")
        .replace(/^.+,/, "");

      fs.writeFileSync(`public${path}`, data, "base64");
      newUser.profile.avatarUrl = path;
    }

    await DB.save(newUser);
    return await this.authLoginWithGoogle(token);
  }

  authLogout() {
    this.session.userId = null;
    return true;
  }

  // Returns true if we are currently logged in with the given user id.
  private async checkCurrentUserIs(userId: number) {
    const currentUserId = await this.getCurrentUserAccountId();
    if (currentUserId == null) {
      return false;
    }

    const currentUserProfile =
      await this.getUserProfileByAccount(currentUserId);
    return currentUserProfile.id == userId;
  }

  private async Abc() {}
}

console.log("Connecting to DB...");

// Connect to DB, then start up server
DB.init()
  .then(async () => {
    console.log("Connected to DB");

    const shouldSeed = process.argv.slice(2).includes("--clean");

    if (shouldSeed) {
      console.log("Seeding DB...");
      await DB.seed();
      console.log("Seeded DB");
    }

    app.listen(port, () => {
      console.log(`Now running at http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));

declare module "express-session" {
  interface SessionData {
    userId: number | null;
  }
}

export type { APIService };
