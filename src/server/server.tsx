import express from "express";
import session, { SessionData } from "express-session";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { rpcHandler } from "typed-rpc/express";
import { DB } from "./db";
import { User } from "./models/User";

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
        <link href="css/app.css" rel="stylesheet" />
        <title>CPA</title>
      </head>
      <body>
        <div id="root"></div>
        <script src="js/bundle.js" />
      </body>
    </html>
  );

  res.send(html);
});

class APIService {
  constructor(private session: SessionData) {}

  async authLoginWithPassword(username: string, password: string) {
    // TODO: hash passwords for security
    const user = await DB.findOne(User, {
      where: { username, password },
    });

    if (user) {
      this.session.userId = user.id;
      return true;
    } else {
      return false;
    }
  }

  async authLoginWithGoogle(token: string) {
    // 1. Get email from token
    // 2. Get user where username matches email
    // 3. Set user id for session

    return false;
  }

  async authLogout() {
    this.session.userId = null;
    return true;
  }

  async registerUser(username: string, password: string, name: string) {
    // TODO: hash passwords for security
    const encryptedPassword = password;

    // checks if username is taken before creating account
    const isNameInUse = await DB.exists(User, {
      where: { username: username },
    });

    if (!isNameInUse) {
      // New user
      const newUser = new User();
      newUser.username = username;
      newUser.password = encryptedPassword;
      newUser.name = name;
      await DB.save(newUser);

      return true;
    } else {
      // username already in use
      return false;
    }
  }

  async updateUser(id: number, password: string, name: string) {
    // TODO: hash passwords for security
    const encryptedPassword = password;

    const user = await DB.findOne(User, {
      where: { id: id },
    });

    if (user) {
      user.name = name;
      user.password = encryptedPassword;
      await DB.save(user);

      return true;
    } else {
      return false;
    }
  }

  async getCurrentUser() {
    const id = this.session.userId;
    return id ? await this.getUser(id) : null;
  }

  async getUser(id: number) {
    const user = await DB.findOne(User, {
      where: { id },
    });

    return user;
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
