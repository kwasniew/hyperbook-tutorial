const targetValue = (event) => event.target.value;
const withFilter = (filter) => (action) => (state, event) =>
  action(state, filter(event));
export const withTargetValue = withFilter(targetValue);
