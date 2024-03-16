import axios from "axios";
import bcrypt from "bcrypt";
import express from "express";
import session, { SessionData } from "express-session";
import nullthrows from "nullthrows";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { rpcHandler } from "typed-rpc/express";
import { DB } from "./db";
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

  async getCurrentUserProfile() {
    const id = this.session.userId;

    // User is not logged in
    if (!id) {
      return null;
    }

    return await nullthrows(this.getUserProfile(id));
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
    profileInfo: Pick<UserProfile, "displayName" | "location" | "language">
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

    await DB.save(newUser);
    return await this.authLoginWithPassword(username, password);
  }

  async authSignupWithGoogle(
    token: string,
    profileInfo: Pick<UserProfile, "displayName" | "location" | "language">
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
