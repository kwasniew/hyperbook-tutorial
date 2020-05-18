import { app } from "./web_modules/hyperapp.js";
import {
  InitPage as InitPosts,
  view as postsView,
  subscriptions,
} from "./Posts.js";
import { InitPage as InitLogin, view as loginView } from "./Login.js";
import { layout } from "./Layout.js";
import { RouteListen } from "./Router.js";

const pages = {
  "/": postsView,
  "/login": loginView,
};
const pageInitActions = {
  "/": InitPosts,
  "/login": InitLogin,
};
const view = (state) => {
  const page = pages[state.location];
  return page ? page(state) : "Loading...";
};

export const start = () =>
  app({
    init: {},
    view: layout(view),
    subscriptions: (state) => [
      subscriptions(state),
      RouteListen(pageInitActions),
    ],
    node: document.getElementById("app"),
  });
