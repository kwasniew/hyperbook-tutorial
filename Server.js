import render from "hyperapp-render";
import express from "express";
import { state, view, SetPosts } from "./src/Posts.js";
import { state as loginState, view as loginView } from "./src/Login.js";
import { layout } from "./src/Layout.js";
import axios from "axios";
import compression from "compression";

const app = express();

const htmlTemplate = (content) => /* HTML */ `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>HyperPosts</title>
      <link rel="stylesheet" href="https://andybrewer.github.io/mvp/mvp.css" />
      <script type="module" src="Start.js"></script>
    </head>
    <body>
      <main>
        <div id="app">${content}</div>
      </main>
    </body>
  </html>
`;

app.use(compression());

app.get("/", async (req, res) => {
  const response = await axios.get(
    "https://hyperapp-api.herokuapp.com/api/post"
  );
  const posts = response.data;
  const stateWithPosts = SetPosts(state, posts);
  const content = render.renderToString(layout(view)(stateWithPosts));
  res.send(htmlTemplate(content));
});
app.get("/login", async (req, res) => {
  const content = render.renderToString(layout(loginView)(loginState));

  res.send(htmlTemplate(content));
});
app.use(express.static("src"));

app.listen(3000, () => {
  console.log("Listening on 3000");
});
