(function () {
  'use strict';
  var search = document.getElementById('module-search');
  var mount = document.getElementById('tool-groups');
  if (!search || !mount) return;
  var searchResultsFocused = false;
  function filterModules() {
    var query = search.value.trim().toLowerCase();
    mount.querySelectorAll('.card').forEach(function (card) {
      card.hidden = !!query && !card.textContent.toLowerCase().includes(query);
    });
    mount.querySelectorAll('.group').forEach(function (group) {
      var visible = Array.from(group.querySelectorAll('.card')).some(function (card) { return !card.hidden; });
      group.hidden = !!query && !visible;
    });
    if (query && !searchResultsFocused) {
      searchResultsFocused = true;
      document.getElementById('all-modules').scrollIntoView({ behavior: 'smooth', block: 'start' });
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