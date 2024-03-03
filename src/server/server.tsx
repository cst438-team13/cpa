import express from "express";
import session from "express-session";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { DB } from "./db";
import { User } from "./models/User";

declare module "express-session" {
  interface SessionData {
    userId: number | null;
  }
}

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: "sessionKey", saveUninitialized: false, resave: false })
);

app.post("/api/login", async (req, res) => {
  const params = req.body;

  // TODO: hash passwords for security
  const user = await DB.findOne(User, {
    where: { username: params.username, password: params.password },
  });

  if (user == null) {
    // Not logged in
    req.session.userId = null;
    res.send({ success: false });
  } else {
    req.session.userId = user.id;
    res.json({ success: true });
  }
});

app.post("/api/register", async (req, res) => {
  const params = req.body;

  // TODO: hash passwords for security
  const encryptedPassword = params.password;

  // checks if username is taken before creating account
  const user = await DB.findOne(User, {
    where: { username: params.username },
  });

  if (user == null) {
    // New user
    const newUser = new User();
    newUser.username = params.username;
    newUser.password = encryptedPassword;
    newUser.name = params.name;
    await DB.save(newUser);

    res.json({ success: true });
  } else {
    // username already in use
    res.json({ success: false });
  }
});

app.post("/api/updateUser", async (req, res) => {
  const params = req.body;

  // TODO: hash passwords for security
  const encryptedPassword = params.password;

  const user = await DB.findOne(User, {
    where: { id: params.id },
  });

  user.name = params.name;
  user.password = encryptedPassword;
  await DB.save(user);

  res.json({ success: true });
});

app.get("/api/getUser", async (req, res) => {
  const params = req.query as Record<any, any>;

  const user = await DB.findOne(User, {
    where: { id: params.userId },
  });

  res.json({
    success: user != null,
    ...user,
  });
});

app.post("/api/logout", async (req, res) => {
  req.session.userId = null;

  res.json({ success: true });
});

app.get("/api/getSessionInfo", async (req, res) => {
  const sessionInfo = {
    userId: req.session.userId ?? null,
  };

  res.json(sessionInfo);
});

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
