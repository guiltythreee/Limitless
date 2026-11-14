(function () {
  'use strict';

  import('./home-learning-intelligence.mjs').then(function (module) {
    module.renderLearningIntelligence();
  }).catch(function () { /* individual modules remain usable if the overview cannot load */ });
  var search = document.getElementById('module-search');
  if (!search) return;
  var searchResultsFocused = false;
  var searchableCards = '.shortcut-card, .learning-card, .competition-promo, .red-promo';
  function filterModules() {
    var query = search.value.trim().toLowerCase();
    var homeMain = document.querySelector('.home-main');
    if (homeMain) homeMain.classList.toggle('is-searching', !!query);
    document.querySelectorAll(searchableCards).forEach(function (card) {
      card.hidden = !!query && !card.textContent.toLowerCase().includes(query);
    });
    if (query && !searchResultsFocused) {
      searchResultsFocused = true;
      var firstMatch = document.querySelector(searchableCards + ':not([hidden])');
      if (firstMatch) firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (!query) searchResultsFocused = false;
  }
  search.addEventListener('input', filterModules);
  document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      search.focus();
      search.select();
    }
    if (event.key === 'Escape' && document.activeElement === search) {
      search.value = '';
      filterModules();
      search.blur();
    }
  });
})();