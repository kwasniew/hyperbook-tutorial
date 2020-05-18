import { app } from "./web_modules/hyperapp.js";
import { layout } from "./Layout.js";
import { html } from "./Html.js";
import { WriteToStorage } from "./web_modules/hyperapp-fx.js";

const state = {
  login: "",
};

const targetValue = (event) => event.target.value;

const ChangeLogin = (state, login) => [
  { ...state, login },
  WriteToStorage({ key: "hyperposts", value: login }),
];

export const view = (state) => html`
  <form method="get" action="/">
    <input onchange=${[ChangeLogin, targetValue]} value=${state.login} />
    <button>Login</button>
  </form>
`;

export const InitPage = (location) => (state) => ({ location, ...state });
