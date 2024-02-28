import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { User } from "./models/User";
import { DB } from "./db";

const app = express();
const port = 3000;

app.use(express.static("public"));

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
  // Add a user to the db
  const user: User = new User();
  user.username = "abc";
  user.name = "Person";

  DB.save(user);
}

console.log("Connecting to DB...");

DB.init()
  .then(() => {
    console.log("Connected to DB");
    onInitServer();

    app.listen(port, () => {
      console.log(`Now running at http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));
