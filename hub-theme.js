// Main page theme switch. Follows the device setting until the visitor picks one.
(function () {
  'use strict';
  var KEY = 'limitless.site.theme';
  var root = document.documentElement;
  // Persist one site-wide choice across refreshes, tabs, and Limitless modules.
  try {
    var selected = localStorage.getItem(KEY);
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
    if (remember) { try { localStorage.setItem(KEY, name); } catch (e) {} }
    paint();
  }
  if (btn) btn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    apply(next, true);
  });
  paint();
})();