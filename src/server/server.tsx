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

app.get("/api/getUser", async (req, res) => {
  const params = req.body;

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

function onInitServer() {
  // Clear DB (delete all existing info)
  DB.clear(User);

  // Add a user to the db
  const user = new User();
  user.username = "dev";
  user.password = "somePassword";
  user.name = "Developer";

  DB.save(user);
}

console.log("Connecting to DB...");

// Connect to DB, then start up server
DB.init()
  .then(() => {
    console.log("Connected to DB");

    app.listen(port, () => {
      onInitServer();

      console.log(`Now running at http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));
