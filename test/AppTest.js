import assert from "assert";
import {UpdatePostText} from "../src/Posts.js";

describe("App", () => {
    it("can update post test", () => {
        const initState = { currentPostText: "", requestStatus: {status: "idle"}};

        const newState = UpdatePostText(initState, "text");

        assert.deepStrictEqual(newState, { currentPostText: "text", requestStatus: {status: "idle"}});
    });
});