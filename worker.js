/**
 * Limitless public CSES profile proxy.
 * Fetches only the public profile page; no credentials or submissions are stored.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/api\/cses-profile\/(\d+)\/?$/);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
    if (request.method !== "GET" || !match) {
      return new Response("Not found", { status: 404 });
    }

    const userId = match[1];
    const cache = caches.default;
    const cacheKey = new Request(new URL(`/api/cses-profile/${userId}`, url.origin), { method: "GET" });
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    try {
      const upstream = await fetch(`https://cses.fi/user/${userId}`, {
        headers: {
          "Accept": "text/html,application/xhtml+xml",
          "User-Agent": "Limitless-Competition-Tracker/1.0"
        },
        redirect: "follow"
      });
      if (!upstream.ok) {
        return Response.json(
          { error: "CSES profile could not be fetched", upstreamStatus: upstream.status },
          { status: upstream.status === 404 ? 404 : 502 }
        );
      }

      const html = await upstream.text();
      if (!html || html.length > 2_000_000) {
        return Response.json({ error: "Unexpected CSES profile response" }, { status: 502 });
      }

      const response = new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=300",
          "X-Content-Type-Options": "nosniff"
        }
      });
      await cache.put(cacheKey, response.clone());
      return response;
    } catch {
      return Response.json({ error: "Unable to reach CSES right now" }, { status: 502 });
    }
  }
};
