import assert from "assert";
import { UpdatePostText } from "../src/Posts.js";

describe("Posts", () => {
  it("post text is updated", () => {
    const initState = {
      currentPostText: "",
      requestStatus: { status: "idle" },
    };

    const newState = UpdatePostText(initState, "text");

    assert.deepStrictEqual(newState, {
      currentPostText: "text",
      requestStatus: { status: "idle" },
    });
  });

  it("post status is reset to idle", () => {
    const initState = {
      currentPostText: "",
      requestStatus: { status: "error", error: "oh nooo" },
    };

    const newState = UpdatePostText(initState, "text");

    assert.deepStrictEqual(newState, {
      currentPostText: "text",
      requestStatus: { status: "idle" },
    });
  });
});
