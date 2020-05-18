import { app } from "./web_modules/hyperapp.js";
import { init, view, subscriptions } from "./Posts.js";
import { layout } from "./Layout.js";

export const start = () =>
  app({
    init,
    view: layout(view),
    subscriptions,
    node: document.getElementById("app"),
  });
