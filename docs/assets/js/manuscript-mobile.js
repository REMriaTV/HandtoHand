(function() {
  function adjustHeight() {
    var container = document.querySelector('.manuscript-pagebody');
    if (!container) return;
    var isMobile = window.matchMedia('(max-width: 640px)').matches;
    container.style.setProperty('--manuscript-auto-height', '');
    if (isMobile) {
      var entry = container.querySelector('.manuscript-entry');
      if (!entry) return;
      container.style.setProperty('--manuscript-auto-height', entry.scrollHeight + 'px');
    }
  }
  window.addEventListener('resize', adjustHeight);
  document.addEventListener('DOMContentLoaded', adjustHeight);
})();
