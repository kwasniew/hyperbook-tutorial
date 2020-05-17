const { assert } = chai;
const { getAllByTestId, waitFor } = TestingLibraryDom;
import { start } from "../src/App.js";

const container = () => document.getElementById("app");

describe("App", () => {
  beforeEach(function () {
    container().innerHTML = "";
  });

  it("Load initial posts", async () => {
    start();
    await waitFor(() => {
      assert.strictEqual(getAllByTestId(container(), "item").length, 10);
    });
  });
});
