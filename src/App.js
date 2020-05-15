import { h, app } from "./web_modules/hyperapp.js";
import htm from "./web_modules/htm.js";
import { Http, WebSocketListen } from "./web_modules/hyperapp-fx.js";

const html = htm.bind(h);

const state = {
  currentPostText: "",
  posts: [],
};

const AddPost = (state) => {
  if (state.currentPostText.trim()) {
    const newPost = { username: "fixed", body: state.currentPostText };
    const newState = {
      ...state,
      currentPostText: "",
      posts: [newPost, ...state.posts],
    };
    return [newState, SavePost(newPost)];
  } else {
    return state;
  }
};

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
    action: (state, data) => state,
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
    <button onclick=${AddPost}>Add Post</button>
    <ul>
      ${state.posts.map(listItem)}
    </ul>
  </div>
`;

app({
  init: [state, LoadLatestPosts],
  view,
  subscriptions: (state) => [
    WebSocketListen({
      action: SetPost,
      url: "ws://hyperapp-api.herokuapp.com",
    }),
  ],
  node: document.getElementById("app"),
});
