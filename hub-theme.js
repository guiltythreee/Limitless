// Main page theme switch. Follows the device setting until the visitor picks one.
(function () {
  'use strict';
  var KEY = 'limitless.hub.theme';
  var root = document.documentElement;
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
    apply(next, true);   // instant: label and theme change together, so rapid clicks cannot flip it back
  });
  var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)');
  if (mq && mq.addEventListener) mq.addEventListener('change', function (e) {
    var saved = null; try { saved = localStorage.getItem(KEY); } catch (er) {}
    if (!saved) apply(e.matches ? 'light' : 'dark', false);
  });
  paint();
})();
