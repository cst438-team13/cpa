import axios from "axios";
import bcrypt from "bcrypt";
import express from "express";
import session, { SessionData } from "express-session";
import fs from "fs";
import nullthrows from "nullthrows";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { rpcHandler } from "typed-rpc/express";
import { DB } from "./db";
import { PetProfile } from "./models/PetProfile";
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
        <script src="/js/bundle.js" />
      </body>
    </html>
  );

  res.send(html);
});

class APIService {
  constructor(private session: SessionData) {}

  //TODO: Check to make sure this updates the DB
  async updatePetAccount(
    Name: string,
    Description: string,
    PictureURL: string,
    Breed: string,
    Color: string,
    Age: number,
    UserId: number
  ) {
    // New pet
    const newPet = new PetProfile();
    newPet.name = Name;
    newPet.description = Description;
    newPet.pictureURL = PictureURL;
    newPet.breed = Breed;
    newPet.color = Color;
    newPet.age = Age;
    newPet.userId = UserId;

    await DB.save(newPet);
    return true;
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

  async updateUserProfile(id: number, displayName?: string) {
    const userProfile = await this.getUserProfile(id);

    if (displayName != null) {
      userProfile.displayName = displayName;
    }

    await DB.save(userProfile);
    return true;
  }

  async getUserProfile(id: number) {
    const user = await DB.findOne(UserAccount, {
      where: { id },
    });

    return nullthrows(user).profile;
  }

  async getCurrentUserId() {
    return this.session.userId ?? null;
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
      const fileId = Math.floor(Math.random() * 10000);
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
      const fileId = Math.floor(Math.random() * 10000);
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
}

console.log("Connecting to DB...");

// Connect to DB, then start up server
DB.init()
  .then(async () => {
    console.log("Connected to DB");

    await DB.seed();

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
