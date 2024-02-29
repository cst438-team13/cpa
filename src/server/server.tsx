import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { User } from "./models/User";
import { DB } from "./db";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

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

app.post("/api/login", (_req, res) => {
  // TODO: actually check with db, create session
  res.send({ success: true });
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
