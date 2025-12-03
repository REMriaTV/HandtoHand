(function () {
  function segmentEntry(entry) {
    if (!entry || entry.dataset.segmented === 'true') return;
    var walker = document.createTreeWalker(entry, NodeFilter.SHOW_TEXT, null);
    var texts = [];
    while (walker.nextNode()) {
      var node = walker.currentNode;
      if (!node.nodeValue.trim()) continue;
      texts.push(node);
    }
    texts.forEach(function (node) {
      var text = node.nodeValue;
      var fragments = [];
      for (var i = 0; i < text.length; i += 20) {
        fragments.push(text.slice(i, i + 20));
      }
      if (fragments.length <= 1) return;
      var wrapper = document.createDocumentFragment();
      fragments.forEach(function (frag) {
        var span = document.createElement('span');
        span.className = 'manuscript-segment';
        span.textContent = frag;
        wrapper.appendChild(span);
      });
      node.parentNode.replaceChild(wrapper, node);
    });
    entry.dataset.segmented = 'true';
  }

  function init() {
    var entry = document.querySelector('.manuscript-entry');
    if (!entry) return;
    if (!window.matchMedia('(max-width: 640px)').matches) return;
    segmentEntry(entry);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
