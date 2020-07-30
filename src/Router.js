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
const navigateEffect = (location) => [
    (_, location) => {
        page(location);
    },
    location,
];
export const Navigate = (location) => (state, event) => event.preventDefault() || [
    state,
    navigateEffect(location),
];

export const RouteListen = (data) => [routeSubscription, data];