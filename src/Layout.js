import { html } from "./Html.js";

const nav = html`
  <nav>
    <a href="/" class="href">Posts</a> <a href="/login" class="href">Login</a>
  </nav>
`;

export const layout = (view) => (state) => html`
  <div>
    <header>
      ${nav}
      <h4>@${state.username} hyperposts</h4>
    </header>
    <main>
      ${view(state)}
    </main>
  </div>
`;
