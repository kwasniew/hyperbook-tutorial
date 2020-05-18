const { assert } = chai;
const {
  getAllByTestId,
  waitFor,
  findByTestId,
  findByText,
  fireEvent,
} = TestingLibraryDom;
import { start } from "../src/App.js";

const container = () => document.getElementById("app");

describe("App", () => {
  beforeEach(function () {
    container().innerHTML = "";
    localStorage.removeItem("hyperposts");
    history.pushState({}, "", "/");
  });

  it.skip("Load initial posts", async () => {
    start();
    await waitFor(() => {
      assert.strictEqual(getAllByTestId(container(), "item").length, 10);
    });
  });

  const randomMessage = () => `new message ${new Date().toJSON()}`;

  const sendMessage = async (newMessage) => {
    const input = await findByTestId(container(), "post-input");
    input.value = newMessage;
    fireEvent.input(input);

    const button = await findByText(container(), "Add Post");
    button.click();
  };

  const waitForMessage = async (message) => {
    await waitFor(() => {
      assert.strictEqual(
        getAllByTestId(container(), "item")[0].textContent,
        message
      );
    });
  };

  it.skip("Add a post as anonymous user", async () => {
    start();
    const newMessage = randomMessage();

    await sendMessage(newMessage);

    await waitForMessage(`@anonymous ${newMessage}`);
  });

  it("Add a post as logged in user", async () => {
    localStorage.setItem("hyperposts", JSON.stringify("kate"));
    start();
    const newMessage = randomMessage();

    await sendMessage(newMessage);

    await waitForMessage(`@kate ${newMessage}`);
  });
});
