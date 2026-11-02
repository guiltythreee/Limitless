// Main page theme switch. Follows the device setting until the visitor picks one.
(function () {
  'use strict';
  var KEY = 'limitless.site.theme';
  var root = document.documentElement;
  // A single tab-scoped choice is shared by every Limitless module.
  // A browser refresh intentionally clears it; ordinary page navigation keeps it.
  try {
    var navigation = performance.getEntriesByType('navigation')[0];
    if (navigation && navigation.type === 'reload') sessionStorage.removeItem('limitless.site.theme');
    var selected = sessionStorage.getItem('limitless.site.theme');
    root.setAttribute('data-theme', selected === 'light' ? 'light' : 'dark');
  } catch (e) { root.setAttribute('data-theme', 'dark'); }
  var COLORS = { dark: '#08070d', light: '#dfe6ee' };
  var bg = document.getElementById('theme-bg');
  var btn = document.getElementById('theme-toggle');
  var meta = document.querySelector('meta[name="theme-color"]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function current() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function paint() {
    var other = current() === 'dark' ? 'light' : 'dark';
    if (btn) {
      btn.textContent = other === 'light' ? 'Light mode' : 'Dark mode';
      btn.setAttribute('aria-label', 'Switch to ' + other + ' mode');
    }
    if (meta) meta.setAttribute('content', COLORS[current()]);
  }
  function apply(name, remember) {
    root.setAttribute('data-theme', name);
    if (remember) { try { sessionStorage.setItem(KEY, name); } catch (e) {} }
    paint();
  }
  if (btn) btn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    apply(next, true);   // instant: label and theme change together, so rapid clicks cannot flip it back
  });
  paint();
})();
