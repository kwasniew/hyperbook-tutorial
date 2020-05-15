import { h, app } from "./web_modules/hyperapp.js";
import htm from "./web_modules/htm.js";

const html = htm.bind(h);

const state = {
  posts: [
    {
      username: "js_developers",
      body: "Modern JS frameworks are too complicated",
    },
    { username: "js_developers", body: "Modern JS frameworks are too heavy" },
    { username: "jorgebucaran", body: "There, I fixed it for you!" },
  ],
};

const listItem = (post) => html`
  <li>
    <strong>@${post.username}</strong>
    <span> ${post.body}</span>
  </li>
`;

const view = (state) => html`
  <div>
    <h1>Recent Posts</h1>
    <ul>
      ${state.posts.map(listItem)}
    </ul>
  </div>
`;

app({
  init: state,
  view,
  node: document.getElementById("app"),
});
