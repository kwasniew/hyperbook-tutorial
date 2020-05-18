import render from "hyperapp-render";
import express from "express";
import { state, view, SetPosts } from "./src/Posts.js";
import axios from "axios";

const app = express();

app.get("/", async (req, res) => {
  const response = await axios.get("https://hyperapp-api.herokuapp.com/api/post");
  const posts = response.data;
  const stateWithPosts = SetPosts(state, posts);
  const html = render.renderToString(view(stateWithPosts));
  res.send(html);
});
app.listen(3000, () => {
  console.log("Listening on 3000");
});
