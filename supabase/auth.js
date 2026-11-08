(function () {
  "use strict";
  const client = window.limitlessSupabase;
  if (!client) return;

  const style = document.createElement("style");
  style.textContent = `
    #theme-toggle,.theme-toggle,.icon-action[aria-label*="theme" i],button[aria-label*="theme" i]{display:none!important}
    .ll-account{position:relative;display:inline-flex;align-items:center;margin-left:.65rem;flex:0 0 auto;z-index:10020}
    .ll-profile-trigger{width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--border,rgba(211,178,103,.5));border-radius:50%;background:rgba(211,178,103,.10);color:inherit;cursor:pointer;padding:0}
    .ll-profile-trigger:hover,.ll-profile-trigger[aria-expanded="true"]{border-color:var(--gold,#d3b267);background:rgba(211,178,103,.18)}
    .ll-profile-trigger svg{width:19px;height:19px;display:block}
    .ll-profile-menu{position:absolute;right:0;top:calc(100% + 10px);width:220px;padding:7px;border:1px solid var(--border,rgba(211,178,103,.45));border-radius:10px;background:rgba(18,16,24,.97);color:#f5eddf;box-shadow:0 16px 45px rgba(0,0,0,.32);backdrop-filter:blur(16px);display:none}
    .ll-profile-menu[open]{display:block}
    .ll-profile-menu button{width:100%;display:flex;align-items:center;gap:10px;padding:11px 10px;border:0;border-radius:6px;background:transparent;color:inherit;text-align:left;font:13px Arial,sans-serif;cursor:pointer}
    .ll-profile-menu button:hover{background:rgba(211,178,103,.13)}
    .ll-profile-menu button:focus-visible,.ll-profile-trigger:focus-visible{outline:2px solid var(--gold-bright,#e6c987);outline-offset:2px}
    .ll-profile-menu .ll-profile-email{padding:9px 10px 11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:11px Arial,sans-serif;opacity:.62;border-bottom:1px solid rgba(211,178,103,.18);margin-bottom:5px}
    .ll-profile-menu .ll-menu-icon{width:17px;text-align:center;opacity:.8}
    .ll-profile-menu .ll-menu-divider{height:1px;background:rgba(211,178,103,.18);margin:5px 4px}
    html[data-theme="light"] .ll-profile-menu{background:rgba(255,252,244,.98);color:#30283a;border-color:rgba(122,88,32,.32)}
    html[data-theme="light"] .ll-profile-menu button:hover{background:rgba(138,90,18,.09)}
    .ll-auth-backdrop{position:fixed;inset:0;z-index:10030;display:none;place-items:center;padding:1rem;background:rgba(0,0,0,.72);backdrop-filter:blur(5px)}
    .ll-auth-backdrop[open]{display:grid}
    .ll-auth-dialog{width:min(100%,420px);padding:1.4rem;background:#15121b;color:#f5eddf;border:1px solid rgba(211,178,103,.5);box-shadow:0 20px 80px #0009}
    .ll-auth-dialog h2{margin:0 0 .4rem;font-size:1.5rem}.ll-auth-dialog p{font-size:.88rem;line-height:1.55;opacity:.78}
    .ll-auth-dialog label{display:grid;gap:.35rem;margin:.8rem 0;font-size:.78rem}
    .ll-auth-dialog input{width:100%;box-sizing:border-box;padding:.75rem;background:#09080d;color:#fff;border:1px solid #665638;font:inherit}
    .ll-auth-actions{display:flex;flex-wrap:wrap;gap:.55rem;margin-top:1rem}.ll-auth-message{min-height:1.4em;color:#e6c987}
    .ll-auth-dialog button{cursor:pointer;padding:.65rem .85rem;background:#302718;color:#f5eddf;border:1px solid #987a42;font:inherit}
    .ll-auth-dialog button[type=submit]{background:#8a682e;color:#fff}.ll-auth-close{float:right}
    html[data-theme="light"] .ll-auth-dialog{background:#fffaf0;color:#30283a}html[data-theme="light"] .ll-auth-dialog input{background:#fff;color:#30283a}
    @media(max-width:650px){.ll-account{margin-left:.35rem}.ll-profile-trigger{width:35px;height:35px}.ll-profile-menu{right:0}}
  `;
  document.head.append(style);

  const host = document.createElement("div");
  host.className = "ll-account";
  const nav = document.querySelector(".topbar-actions") || document.querySelector(".nav-links") || document.querySelector(".competition-nav") || document.querySelector(".navbar") || document.querySelector("header");
  if (nav && nav.getClientRects().length) nav.append(host);
  else { host.style.position = "fixed"; host.style.top = "14px"; host.style.right = "18px"; document.body.append(host); }

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "ll-profile-trigger";
  trigger.setAttribute("aria-label", "Open profile menu");
  trigger.setAttribute("aria-haspopup", "true");
  trigger.setAttribute("aria-expanded", "false");
  trigger.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.7-3.4 3.2-5.2 7-5.2s6.3 1.8 7 5.2"/></svg>';
  const menu = document.createElement("div");
  menu.className = "ll-profile-menu";
  menu.setAttribute("role", "menu");
  host.append(trigger, menu);

  const backdrop = document.createElement("div");
  backdrop.className = "ll-auth-backdrop";
  backdrop.innerHTML = '<section class="ll-auth-dialog" role="dialog" aria-modal="true" aria-labelledby="ll-auth-title"><button type="button" class="ll-auth-close" aria-label="Close">×</button><h2 id="ll-auth-title">Your Limitless account</h2><p>Sign in to keep your learning identity and progress with you across devices.</p><form><label>Email<input name="email" type="email" autocomplete="email" required></label><label>Password<input name="password" type="password" minlength="8" autocomplete="current-password" required></label><div class="ll-auth-actions"><button type="submit" data-mode="signin">Sign in</button><button type="submit" data-mode="signup">Create account</button></div></form><p class="ll-auth-message" aria-live="polite"></p><p>Email confirmation may be required.</p></section>';
  document.body.append(backdrop);
  const form = backdrop.querySelector("form"), message = backdrop.querySelector(".ll-auth-message");
  function openAuth() { menu.removeAttribute("open"); trigger.setAttribute("aria-expanded","false"); backdrop.setAttribute("open",""); message.textContent = ""; }
  function closeAuth() { backdrop.removeAttribute("open"); }
  backdrop.querySelector(".ll-auth-close").addEventListener("click", closeAuth);
  backdrop.addEventListener("click", e => { if (e.target === backdrop) closeAuth(); });

  function applyTheme() {
    const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("limitless.site.theme", next); } catch (_) {}
    document.dispatchEvent(new CustomEvent("limitless:themechange", { detail: { theme: next } }));
    paintMenu(currentUser);
  }
  let currentUser = null;
  function paintMenu(user) {
    currentUser = user || null;
    menu.replaceChildren();
    if (user) {
      const email = document.createElement("div");
      email.className = "ll-profile-email";
      email.textContent = user.email || "Signed in";
      menu.append(email);
    }
    const appearance = document.createElement("button");
    appearance.type = "button";
    appearance.setAttribute("role","menuitem");
    appearance.innerHTML = '<span class="ll-menu-icon" aria-hidden="true">◐</span><span>Appearance</span><span style="margin-left:auto;opacity:.65;font-size:11px">' + (document.documentElement.getAttribute("data-theme") === "light" ? "Light" : "Dark") + '</span>';
    appearance.addEventListener("click", applyTheme);
    menu.append(appearance);
    menu.append(Object.assign(document.createElement("div"), { className: "ll-menu-divider" }));
    const action = document.createElement("button");
    action.type = "button";
    action.setAttribute("role","menuitem");
    action.innerHTML = user
      ? '<span class="ll-menu-icon" aria-hidden="true">↪</span><span>Sign out</span>'
      : '<span class="ll-menu-icon" aria-hidden="true">↪</span><span>Sign in</span>';
    action.addEventListener("click", async () => {
      if (!currentUser) { openAuth(); return; }
      action.disabled = true;
      const { error } = await client.auth.signOut();
      if (error) { action.disabled = false; alert(error.message); }
    });
    menu.append(action);
  }
  trigger.addEventListener("click", () => {
    const open = menu.hasAttribute("open");
    menu.toggleAttribute("open", !open);
    trigger.setAttribute("aria-expanded", String(!open));
  });
  document.addEventListener("click", e => {
    if (!host.contains(e.target)) { menu.removeAttribute("open"); trigger.setAttribute("aria-expanded","false"); }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { menu.removeAttribute("open"); trigger.setAttribute("aria-expanded","false"); closeAuth(); }
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const d = new FormData(form), email = String(d.get("email") || "").trim(), password = String(d.get("password") || "");
    const mode = e.submitter?.dataset.mode || "signin", buttons = [...form.querySelectorAll("button")];
    buttons.forEach(b => b.disabled = true);
    message.textContent = mode === "signup" ? "Creating account…" : "Signing in…";
    try {
      const r = mode === "signup" ? await client.auth.signUp({ email, password }) : await client.auth.signInWithPassword({ email, password });
      if (r.error) throw r.error;
      if (mode === "signup" && !r.data.session) message.textContent = "Account created. Check your email to confirm, then sign in.";
      else { message.textContent = "You're signed in."; setTimeout(closeAuth, 500); }
    } catch (err) { message.textContent = err.message || "Authentication failed."; }
    finally { buttons.forEach(b => b.disabled = false); }
  });

  client.auth.onAuthStateChange((_event, session) => paintMenu(session?.user || null));
  client.auth.getSession().then(({ data, error }) => {
    if (error) console.warn("Limitless session check:", error.message);
    paintMenu(data?.session?.user || null);
  });
})();