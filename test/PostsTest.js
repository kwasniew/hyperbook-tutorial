import assert from "assert";
import { UpdatePostText, AddPost } from "../src/Posts.js";

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

  it("add post", () => {
    const initState = {
      currentPostText: "text",
      requestStatus: { status: "idle" },
      post: [],
    };

    const [newState, [, savePostData]] = AddPost(initState, "1234");

    assert.deepStrictEqual(newState, {
      currentPostText: "",
      requestStatus: { status: "saving" },
      post: [],
    });
    assert.deepStrictEqual(
      savePostData.url,
      "https://hyperapp-api.herokuapp.com/api/post"
    );
  });
});
