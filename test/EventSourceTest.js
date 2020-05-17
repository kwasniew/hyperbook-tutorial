import assert from "assert";
import { EventSourceListen } from "../src/lib/EventSource.js";

const givenEventSource = (serverUrl) => {
  const listeners = {};
  let isClosed = false;
  const es = {
    addEventListener(name, listener) {
      listeners[name] = listener;
    },
    removeEventListener(name, listener) {
      delete listeners[name];
    },
    close() {
      isClosed = true;
    },
  };
  const emit = (event) => {
    Object.values(listeners).forEach((listener) => {
      listener(event);
    });
  };

  function EventSource(url) {
    if (url === serverUrl) return es;
  }
  global.EventSource = EventSource;

  return { emit, isClosed: () => isClosed };
};

const runFx = ([effect, data]) => {
  const dispatch = (action, event) => (dispatch.invokedWith = [action, event]);
  const unsubscribe = effect(dispatch, data);
  return { dispatch, unsubscribe };
};

describe("Event source subscription", () => {
  const defaultEventSource = global.EventSource;
  afterEach(() => {
    global.EventSource = defaultEventSource;
  });

  it("dispatches events", () => {
    const { emit } = givenEventSource("http://example.com");
    const { dispatch } = runFx(
      EventSourceListen({ url: "http://example.com", action: "action" })
    );

    emit({ data: "event data" });

    assert.deepStrictEqual(dispatch.invokedWith, [
      "action",
      { data: "event data" },
    ]);
  });

  it("ignores events emitted after unsubscribe", () => {
    const { emit, isClosed } = givenEventSource("http://example.com");
    const { dispatch, unsubscribe } = runFx(
      EventSourceListen({ url: "http://example.com", action: "action" })
    );
    unsubscribe();

    emit({ data: "event data" });

    assert.deepStrictEqual(dispatch.invokedWith, undefined);
    assert.ok(isClosed());
  });
});
