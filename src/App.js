import { h, app } from "./web_modules/hyperapp.js";
import htm from "./web_modules/htm.js";
import { Http, WebSocketListen } from "./web_modules/hyperapp-fx.js";

const html = htm.bind(h);

const state = {
  currentPostText: "",
  posts: [],
  liveUpdate: true,
  isSaving: false,
};

const ToggleLiveUpdate = (state) => {
  const newState = {
    ...state,
    liveUpdate: !state.liveUpdate,
  };
  return newState.liveUpdate ? [newState, LoadLatestPosts] : [newState];
};

const AddPost = (state) => {
  if (state.currentPostText.trim()) {
    const newPost = { username: "fixed", body: state.currentPostText };
    const newState = {
      ...state,
      currentPostText: "",
      isSaving: true,
    };
    return [newState, SavePost(newPost)];
  } else {
    return state;
  }
};

const PostSaved = (state) => ({ ...state, isSaving: false });
const SavePost = (post) =>
  Http({
    url: "https://hyperapp-api.herokuapp.com/slow-api/post",
    options: {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    },
    action: PostSaved,
  });

const UpdatePostText = (state, currentPostText) => ({
  ...state,
  currentPostText,
});

const SetPosts = (state, posts) => ({
  ...state,
  posts,
});

const SetPost = (state, event) => {
  try {
    const post = JSON.parse(event.data);
    return {
      ...state,
      posts: [post, ...state.posts],
    };
  } catch (e) {
    return state;
  }
};

const LoadLatestPosts = Http({
  url: "https://hyperapp-api.herokuapp.com/api/post",
  action: SetPosts,
});

const eventSourceSubscription = (dispatch, data) => {
  const es = new EventSource(data.url);
  const listener = (event) => dispatch(data.action, event);
  es.addEventListener("message", listener);

  return () => {
    es.removeEventListener("message", listener);
    es.close();
  };
};
const EventSourceListen = (data) => [eventSourceSubscription, data];

const targetValue = (event) => event.target.value;

const listItem = (post) => html`
  <li>
    <strong>@${post.username}</strong>
    <span> ${post.body}</span>
  </li>
`;

const view = (state) => html`
  <div>
    <h1>Recent Posts</h1>
    <input
      type="text"
      oninput=${[UpdatePostText, targetValue]}
      value=${state.currentPostText}
      autofocus
    />
    <button onclick=${AddPost} disabled=${state.isSaving}>Add Post</button>
    <input
      type="checkbox"
      id="liveUpdate"
      onchange=${ToggleLiveUpdate}
      checked=${state.liveUpdate}
    />
    <label for="liveUpdate">Live Update</label>
    <ul>
      ${state.posts.map(listItem)}
    </ul>
  </div>
`;

app({
  init: [state, LoadLatestPosts],
  view,
  subscriptions: (state) => [
    state.liveUpdate &&
      EventSourceListen({
        action: SetPost,
        url: "https://hyperapp-api.herokuapp.com/api/event/post",
        event: "post",
      }),
  ],
  node: document.getElementById("app"),
});
