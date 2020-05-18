import page from "./web_modules/page.js";

const routeSubscription = (dispatch, data) => {
  Object.entries(data).map(([location, init]) => {
    page(location, (context) => {
      setTimeout(() => {
        dispatch(init, { location, ...context.params });
      });
    });
  });

  page.start();

  return () => {
    page.stop();
  };
};

export const RouteListen = (data) => [routeSubscription, data];

const navigateEffect = (location) => [
  (_, location) => {
    page(location);
  },
  location,
];
export const Navigate = (location) => (state) => [
  state,
  navigateEffect(location),
];
