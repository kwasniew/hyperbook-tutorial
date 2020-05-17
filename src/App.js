import { app } from "./web_modules/hyperapp.js";
import { init, view, subscriptions } from "./Posts.js";

export const start = () =>
  app({
    init,
    view,
    subscriptions,
    node: document.getElementById("app"),
  });
