import { app, Lazy } from "./web_modules/hyperapp.js";
import { html } from "./Html.js";
import { Http } from "./web_modules/hyperapp-fx.js";
import { EventSourceListen } from "./lib/EventSource.js";
import { WithGuid } from "./lib/Guid.js";

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
      username: "anonymous",
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

export const LoadLatestPosts = Http({
  url: "https://hyperapp-api.herokuapp.com/api/post",
  action: SetPosts,
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
    <h1>Recent Posts</h1>
    <input
      data-testid="post-input"
      type="text"
      oninput=${[UpdatePostText, targetValue]}
      value=${state.currentPostText}
      autofocus
    />
    ${errorMessage(state.requestStatus)} ${addPostButton(state.requestStatus)}
    <input
      type="checkbox"
      id="liveUpdate"
      onchange=${ToggleLiveUpdate}
      checked=${state.liveUpdate}
    />
    <label for="liveUpdate">Live Update</label>
    ${lazyPostList({ posts: state.posts })}
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

export const init = [state, LoadLatestPosts];
