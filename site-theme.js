(function () {
  'use strict';
  var KEY = 'limitless.site.theme';
  var root = document.documentElement;
  var injectedId = 'll-site-theme-toggle';

  function current() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function buttons() {
    return document.querySelectorAll(
      '#theme-toggle, #ll-site-theme-toggle, .theme-toggle, .icon-action[aria-label*="theme" i], button[aria-label*="theme" i]'
    );
  }

  function paint() {
    var theme = current();
    var next = theme === 'dark' ? 'light' : 'dark';
    buttons().forEach(function (button) {
      if (button.id === injectedId) {
        button.textContent = next === 'light' ? 'Light mode' : 'Dark mode';
        button.setAttribute('aria-label', 'Switch to ' + next + ' mode');
        button.setAttribute('title', 'Switch to ' + next + ' mode');
        button.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        return;
      }
      button.textContent = next === 'light' ? 'Light mode' : 'Dark mode';
      button.setAttribute('aria-label', 'Switch to ' + next + ' mode');
      button.setAttribute('title', 'Switch to ' + next + ' mode');
      button.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#dfe6ee' : '#08070d');
    root.style.colorScheme = theme;
    document.dispatchEvent(new CustomEvent('limitless:themechange', { detail: { theme: theme } }));
  }

  function apply(theme) {
    theme = theme === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    paint();
  }

  function ensureControl() {
    if (buttons().length || !document.body) return;
    var button = document.createElement('button');
    button.id = injectedId;
    button.type = 'button';
    button.className = 'll-site-theme-toggle';
    button.textContent = current() === 'dark' ? 'Light mode' : 'Dark mode';
    button.setAttribute('aria-label', 'Switch theme');
    button.setAttribute('title', 'Switch theme');
    document.body.appendChild(button);
  }

  var style = document.createElement('style');
  style.textContent =
    '.ll-site-theme-toggle{position:fixed;top:14px;right:18px;z-index:99999;padding:9px 14px;border:1px solid rgba(180,145,78,.55);border-radius:999px;background:rgba(12,10,18,.9);color:#f4d58e;font:600 11px Arial,sans-serif;letter-spacing:.04em;cursor:pointer;backdrop-filter:blur(12px);box-shadow:0 4px 18px rgba(0,0,0,.18)}' +
    'html[data-theme="light"] .ll-site-theme-toggle{background:rgba(255,252,244,.94);color:#49330c;border-color:rgba(122,88,32,.4)}' +
    '.ll-site-theme-toggle:hover{filter:brightness(1.08)}.ll-site-theme-toggle:focus-visible{outline:2px solid currentColor;outline-offset:3px}' +
    '@media(max-width:600px){.ll-site-theme-toggle{top:10px;right:10px;padding:7px 10px;font-size:10px}}';
  (document.head || root).appendChild(style);

  // Capture the click before page-specific handlers so every page uses this one preference.
  document.addEventListener('click', function (event) {
    var button = event.target && event.target.closest
      ? event.target.closest('#theme-toggle, .theme-toggle, .icon-action[aria-label*="theme" i], button[aria-label*="theme" i], #' + injectedId)
      : null;
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    apply(current() === 'dark' ? 'light' : 'dark');
  }, true);

  // Keep the single preference authoritative if a module changes data-theme itself.
  var observer = new MutationObserver(function () {
    var theme = current();
    try {
      if (localStorage.getItem(KEY) !== theme) localStorage.setItem(KEY, theme);
    } catch (e) {}
    paint();
  });
  observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  window.addEventListener('storage', function (event) {
    if (event.key === KEY && (event.newValue === 'light' || event.newValue === 'dark')) {
      root.setAttribute('data-theme', event.newValue);
      paint();
    }
  });

  try {
    var saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) {}
  if (!root.hasAttribute('data-theme')) root.setAttribute('data-theme', 'dark');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { ensureControl(); paint(); }, { once: true });
  } else {
    ensureControl();
    paint();
  }
})();