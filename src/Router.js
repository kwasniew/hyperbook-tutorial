import page from "./web_modules/page.js";
import { InitPage as InitLoginPage } from "./Login.js";
import { InitPage as InitPostsPage } from "./Posts.js";

const SetLocation = (state, location) => ({ location });

const routeSubscription = (dispatch, data) => {
  page("/", () => {
    dispatch(SetLocation, "/");
    dispatch(InitPostsPage);
  });
  page("/login", () => {
    dispatch(SetLocation, "/login");
    dispatch(InitLoginPage);
  });

  page.start();

  return () => {
    page.stop();
  };
};
