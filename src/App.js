import { h, app } from "./web_modules/hyperapp.js";
import htm from "./web_modules/htm.js";

const html = htm.bind(h);

const state = { text: "Welcome to Hyperapp!" };

app({
  init: state,
  view: (state) => html`
    <div>
      <h1>Recent Posts</h1>
      <ul>
        <li>
          <strong>@js_developers</strong>
          <span>Modern JS frameworks are too complicated</span>
        </li>
        <li>
          <strong>@jorgebucaran</strong>
          <span>There, I fixed it for you!</span>
        </li>
      </ul>
    </div>
  `,
  node: document.getElementById("app"),
});
