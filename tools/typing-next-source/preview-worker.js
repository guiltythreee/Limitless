const PREVIEW_PATH = "/tools/typing-next-preview";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return Response.redirect(new URL(`${PREVIEW_PATH}/`, url), 302);
    }

    // Resolve the exported Next.js entry point explicitly. Do not rely on
    // the static-assets HTML handler to translate a directory URL to index.html.
    if (url.pathname === PREVIEW_PATH || url.pathname === `${PREVIEW_PATH}/`) {
      url.pathname = `${PREVIEW_PATH}/index.html`;
    }

    return env.ASSETS.fetch(new Request(url, request));
  }
};
