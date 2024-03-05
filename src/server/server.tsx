import express from "express";
import session from "express-session";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { rpcHandler } from "typed-rpc/express";
import { DB } from "./db";
import { APIService } from "./services/APIService";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: "sessionKey", saveUninitialized: false, resave: false })
);

// API is defined in services/APIService.ts
app.post(
  "/api/rpc",
  rpcHandler((req) => new APIService(req.session))
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
