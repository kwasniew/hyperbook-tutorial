import { app } from "./web_modules/hyperapp.js";
import { layout } from "./layout.js";
import { html } from "./html.js";
import { WriteToStorage } from "./web_modules/hyperapp-fx.js";

const state = {
  login: "",
};

const targetValue = (event) => event.target.value;

const ChangeLogin = (state, login) => [
  { ...state, login },
  WriteToStorage({ key: "hyperposts", value: login }),
];

const view = (state) => html`
  <form method="get" action="/">
    <input onchange=${[ChangeLogin, targetValue]} value=${state.login} />
    <button>Login</button>
  </form>
`;

app({
  init: [state],
  view: layout(view),
  node: document.getElementById("app"),
});
