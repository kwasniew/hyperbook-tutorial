import { html } from "./html.js";

const nav = html`
  <nav>
    <ul>
      <li><a href="/" class="href">Posts</a></li>
      <li><a href="/login" class="href">Login</a></li>
    </ul>
  </nav>
`;

export const layout = (view) => (state) => html`
  <div>
    <header>
      <h1>HyperPosts</h1>
      ${nav}
    </header>
    <main>
      ${view(state)}
    </main>
  </div>
`;
