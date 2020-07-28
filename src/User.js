import {ReadFromStorage} from "./web_modules/hyperapp-fx.js";

const SetUsername = (state, { value }) =>
    value ? { ...state, username: value } : state;
export const ReadUsername = ReadFromStorage({
    key: "hyperposts",
    action: SetUsername,
});