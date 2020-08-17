import page from "./web_modules/page.js";

const routeSubscription = (dispatch, data) => {
    Object.entries(data).map(([location, init]) => {
        page(location, () => {
            setTimeout(() => {
                dispatch(init, { location });
            }, 0);
        });
    });

    page.start();

    return () => {
        page.stop();
    };
};

const linkEffect = (_dispatch, location) => {
    page(location);
};
export const Link = (data) => [linkEffect, data]

export const RouteListen = (data) => [routeSubscription, data];