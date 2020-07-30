import { memo } from "./web_modules/hyperapp.js";
import html from "./web_modules/hyperlit.js";
import { Http} from "./web_modules/hyperapp-fx.js";
import { EventSourceListen } from "./lib/EventSource.js";
import { WithGuid } from "./lib/Guid.js";
import { withTargetValue } from "./lib/DomEvents.js";
import { ReadFromStorage } from "./web_modules/hyperapp-fx.js";

const idle = { status: "idle" };
const saving = { status: "saving" };
const error = {
  status: "error",
  message: "Post cannot be saved.",
};
export const state = {
  currentPostText: "",
  posts: [],
  liveUpdate: true,
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

export const UpdatePostText = (state, currentPostText) => ({
  ...state,
  currentPostText,
  requestStatus: idle,
});

const listItem = (post) => html`
  <li key=${post.id} data-key=${post.id} data-testid="item">
    <strong>@${post.username}</strong>
    <span> ${post.body}</span>
  </li>
`;

const SetPosts = (state, posts) => ({
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

const LoadLatestPosts = Http({
  url: "https://hyperapp-api.herokuapp.com/api/post",
  action: SetPosts,
});

const PostSaved = (state) => ({ ...state, requestStatus: idle });
const PostError = (state) => ({
  ...state,
  requestStatus: error,
});
const errorMessage = ({ message }) => html`<div>${message}</div>`;
const addPostButton = ({ status }) => html`
  <button
    onclick=${WithGuid(AddPost)}
    disabled=${status === "saving"}
    data-testid="add-post"
  >
    Add Post
  </button>
`;
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

const SetUsername = (state, { value }) =>
  value ? { ...state, username: value } : state;
const ReadUsername = ReadFromStorage({
  key: "hyperposts",
  action: SetUsername,
});

const UpdatePostTextAction = withTargetValue(UpdatePostText);

const lazyPostList = ({ posts }) => memo(postList, { posts });
const postList = ({ posts }) => html`
  <ul>
    ${posts.map(listItem)}
  </ul>
`;

export const view = (state) => html`
  <div>
    ${errorMessage(state.requestStatus)}
    <input
      data-testid="post-input"
      type="text"
      oninput=${UpdatePostTextAction}
      value=${state.currentPostText}
      autofocus
    />
    ${" "} ${addPostButton(state.requestStatus)}
    <label for="liveUpdate">
      <input
        type="checkbox"
        id="liveUpdate"
        onchange=${ToggleLiveUpdate}
        checked=${state.liveUpdate}
      />
      Live Update
    </label>

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

export const InitPage = (_, { location }) => [
  { location, ...state },
  LoadLatestPosts, ReadUsername
];
export const init = [state, LoadLatestPosts, ReadUsername];
