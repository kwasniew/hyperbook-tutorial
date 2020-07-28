import { app, Lazy } from "./web_modules/hyperapp.js";
import { html } from "./Html.js";
import { Http } from "./web_modules/hyperapp-fx.js";
import { EventSourceListen } from "./lib/EventSource.js";
import { WithGuid } from "./lib/Guid.js";
import { ReadFromStorage } from "./web_modules/hyperapp-fx.js";

const idle = { status: "idle" };
const saving = { status: "saving" };
const error = {
  status: "error",
  message: "Post cannot be saved. Please try again.",
};
export const state = {
  currentPostText: "",
  posts: [],
  liveUpdate: true,
  isSaving: false,
  error: "",
  requestStatus: idle,
  username: "anonymous",
};

const ToggleLiveUpdate = (state) => {
  const newState = {
    ...state,
    liveUpdate: !state.liveUpdate,
  };
  return newState.liveUpdate ? [newState, LoadLatestPosts] : [newState];
};

export const AddPost = (state, id) => {
  if (state.currentPostText.trim()) {
    const newPost = {
      id,
      username: state.username,
      body: state.currentPostText,
    };
    const newState = {
      ...state,
      currentPostText: "",
      requestStatus: saving,
    };
    return [newState, SavePost(newPost)];
  } else {
    return state;
  }
};

const PostSaved = (state) => ({ ...state, requestStatus: idle });
const PostError = (state) => ({ ...state, requestStatus: error });
const SavePost = (post) =>
  Http({
    url: "https://hyperapp-api.herokuapp.com/api/post",
    options: {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    },
    action: PostSaved,
    error: PostError,
  });

export const UpdatePostText = (state, currentPostText) => ({
  ...state,
  currentPostText,
  requestStatus: idle,
});

export const SetPosts = (state, posts) => ({
  ...state,
  posts,
});

const SetPost = (state, event) => {
  try {
    const post = JSON.parse(event.data);
    return {
      ...state,
      posts: [...state.posts, post],
    };
  } catch (e) {
    return state;
  }
};

export const LoadLatestPosts = Http({
  url: "https://hyperapp-api.herokuapp.com/api/post",
  action: SetPosts,
});

const SetUsername = (state, { value }) =>
  value ? { ...state, username: value } : state;
const ReadUsername = ReadFromStorage({
  key: "hyperposts",
  action: SetUsername,
});

const targetValue = (event) => event.target.value;

const listItem = (post) => html`
  <li key=${post.id} data-key=${post.id} data-testid="item">
    <strong>@${post.username}</strong>
    <span> ${post.body}</span>
  </li>
`;

const errorMessage = ({ status, message }) => {
  if (status === "error") {
    return html` <div>${message}</div> `;
  }
  return "";
};

const addPostButton = ({ status }) => html`
  <button onclick=${WithGuid(AddPost)} disabled=${status === "saving"}>
    Add Post
  </button>
`;

const postList = ({ posts }) => html`
  <ul>
    ${posts.map(listItem)}
  </ul>
`;
const lazyPostList = ({ posts }) => Lazy({ view: postList, posts });

export const view = (state) => html`
  <div>
    <input
      data-testid="post-input"
      type="text"
      oninput=${[UpdatePostText, targetValue]}
      value=${state.currentPostText}
      autofocus
    />
    ${" "}
    ${addPostButton(state.requestStatus)} ${errorMessage(state.requestStatus)}
    ${lazyPostList({ posts: state.posts })}

    <label for="liveUpdate"
      ><input
        type="checkbox"
        id="liveUpdate"
        onchange=${ToggleLiveUpdate}
        checked=${state.liveUpdate}
      />
      Live Update</label
    >
  </div>
`;

export const subscriptions = (state) => [
  state.liveUpdate &&
    EventSourceListen({
      action: SetPost,
      url: "https://hyperapp-api.herokuapp.com/api/event/post",
      event: "post",
    }),
];

export const InitPage = (_, params) => [
  { location: params.location, ...state },
  [LoadLatestPosts, ReadUsername],
];
