import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";

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
        <script src="js/client.js" />
      </body>
    </html>
  );

  res.send(html);
});

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
