import render from "hyperapp-render";
import {state, view} from "./app.js";

const html = render.renderToString(view(state));

console.log(html);