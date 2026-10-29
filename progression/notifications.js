/* Small, accessible acknowledgement for global level-ups across Limitless. */
(function () {
  'use strict';
  var STYLE_ID = 'limitless-reward-notice-style';
  var NOTICE_ID = 'limitless-reward-notice';
  var lastLevel = 1;
  var clearHandle = null;

  function rewards() {
    return typeof window !== 'undefined' ? window.LimitlessRewards : null;
  }
  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      '.limitless-reward-notice{position:fixed;z-index:99999;right:20px;bottom:20px;width:min(380px,calc(100vw - 32px));padding:18px 20px;background:rgba(10,8,17,.96);color:#f2e6c8;border:1px solid rgba(232,203,139,.65);box-shadow:0 12px 40px rgba(0,0,0,.32);backdrop-filter:blur(12px);font:14px/1.5 system-ui,sans-serif;transform:translateY(12px);opacity:0;transition:opacity .22s ease,transform .22s ease}' +
      '.limitless-reward-notice.is-visible{transform:translateY(0);opacity:1}' +
      '.limitless-reward-notice__eyebrow{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#d9b66a;margin-bottom:5px}' +
      '.limitless-reward-notice__title{font-family:Georgia,serif;font-size:23px;line-height:1.2;margin:0 26px 5px 0;color:#f3d58a}' +
      '.limitless-reward-notice__body{font-size:12px;color:#dfd2b8}' +
      '.limitless-reward-notice__close{position:absolute;right:10px;top:8px;border:0;background:transparent;color:inherit;cursor:pointer;font-size:20px;padding:2px 7px}' +
      '@media(prefers-reduced-motion:reduce){.limitless-reward-notice{transition:none}}' +
      'html[data-theme="light"] .limitless-reward-notice{background:rgba(252,247,235,.97);color:#392b16;border-color:rgba(138,90,18,.65)}' +
      'html[data-theme="light"] .limitless-reward-notice__body{color:#4a3a28}';
    document.head.appendChild(style);
  }
  function element(tag, className, text) {
    var node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function show(level, reward, moduleName) {
    ensureStyle();
    var box = document.getElementById(NOTICE_ID);
    if (!box) {
      box = element('div', 'limitless-reward-notice');
      box.id = NOTICE_ID;
      box.setAttribute('role', 'status');
      box.setAttribute('aria-live', 'polite');
      document.body.appendChild(box);
    }
    box.textContent = '';
    var close = element('button', 'limitless-reward-notice__close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Dismiss level-up notice');
    close.addEventListener('click', function () {
      box.classList.remove('is-visible');
      if (clearHandle) window.clearTimeout(clearHandle);
    });
    box.appendChild(close);
    box.appendChild(element('div', 'limitless-reward-notice__eyebrow', 'Global progression'));
    box.appendChild(element('h2', 'limitless-reward-notice__title', 'Level ' + level + ' reached'));
    var bodyText = reward
      ? 'Unlocked: ' + reward.name + (reward.kind === 'title' ? ' title.' : ' emblem.')
      : 'Your verified learning across disciplines moved the shared EXP total forward.';
    if (moduleName && moduleName !== 'multiple') bodyText += ' · ' + moduleName.replace(/-/g, ' ');
    box.appendChild(element('div', 'limitless-reward-notice__body', bodyText));
    window.requestAnimationFrame(function () { box.classList.add('is-visible'); });
    if (clearHandle) window.clearTimeout(clearHandle);
    clearHandle = window.setTimeout(function () { box.classList.remove('is-visible'); }, 6500);
  }
  function evaluate(detail) {
    var api = rewards();
    if (!api) return;
    var current = api.summary();
    var newLevel = current.level;
    var reportedLevel = detail && typeof detail.levelAfter === 'number' ? detail.levelAfter : newLevel;
    var before = detail && typeof detail.levelBefore === 'number' ? detail.levelBefore : lastLevel;
    if (reportedLevel > lastLevel && (detail && detail.levelUp || !detail)) {
      var newlyUnlocked = (current.unlockedRewards || []).find(function (item) { return item.level === reportedLevel; }) || null;
      show(reportedLevel, newlyUnlocked, detail && detail.module);
    } else if (newLevel > lastLevel && (!detail || !detail.levelUp)) {
      // Covers a level-up written by another same-origin tab.
      var crossTabReward = (current.unlockedRewards || []).find(function (item) { return item.level === newLevel; }) || null;
      show(newLevel, crossTabReward, '');
    }
    lastLevel = Math.max(lastLevel, before, reportedLevel, newLevel);
  }
  function init() {
    var api = rewards();
    if (!api) return;
    lastLevel = api.summary().level;
    window.addEventListener('limitless:rewards-updated', function (event) {
      evaluate(event && event.detail ? event.detail : null);
    });
    window.addEventListener('storage', function (event) {
      if (event.key === api.STORAGE_KEY) evaluate(null);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();