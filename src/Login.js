import { html } from "./Html.js";
import { WriteToStorage } from "./web_modules/hyperapp-fx.js";
import { Navigate } from "./Router.js";
import { preventDefault } from "./web_modules/@hyperapp/events.js";

const state = {
  username: "",
};

const targetValue = (event) => event.target.value;

const ChangeLogin = (state, username) => [
  { ...state, username },
  WriteToStorage({ key: "hyperposts", value: username }),
];

export const view = (state) => html`
  <form method="get" action="/" onsubmit=${preventDefault(Navigate("/"))}>
    <input oninput=${[ChangeLogin, targetValue]} value=${state.username} />
    <button>Login</button>
  </form>
`;

export const InitPage = (_, { location }) => ({ location, ...state });
