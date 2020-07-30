import html from "./web_modules/hyperlit.js";
import { WriteToStorage } from "./web_modules/hyperapp-fx.js";
import { withTargetValue } from "./lib/DomEvents.js";
import {Navigate} from "./Router.js";
import {preventDefault} from "./web_modules/@hyperapp/events.js";

const state = {
  username: "",
};

const ChangeLogin = (state, username) => [
  { ...state, username },
  WriteToStorage({ key: "hyperposts", value: username }),
];

export const view = (state) => html`
  <form method="get" action="/" onsubmit=${preventDefault(Navigate("/"))}>
    <input
      type="text"
      oninput=${withTargetValue(ChangeLogin)}
      value=${state.username}
    />
    ${" "}
    <button>Login</button>
  </form>
`;

export const InitPage = (state, { location }) => ({
  location,
  username: state.username,
});
