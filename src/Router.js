import page from "./web_modules/page.js";

const routeSubscription = (dispatch, data) => {
    page("/", () => {

    });
    page("/login", () => {

    });

    page.start();

    return () => {
        page.stop();
    };
};