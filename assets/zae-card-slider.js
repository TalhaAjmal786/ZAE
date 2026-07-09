/* ZAE - product card image slider */
(function () {
  'use strict';

  function slides(root) {
    return Array.prototype.filter.call(
      root.children,
      function (el) { return el.tagName === 'IMG'; }
    );
  }

  function show(root, idx) {
    var imgs = slides(root);
    if (!imgs.length) return;

    idx = (idx + imgs.length) % imgs.length;

    imgs.forEach(function (img, i) {
      img.classList.toggle('zae-active', i === idx);
      if (i === idx && img.classList.contains('lazyload')) {
        var ds = img.getAttribute('data-src');
        if (ds && !img.src) img.src = ds;
        var dss = img.getAttribute('data-srcset');
        if (dss && !img.srcset) img.srcset = dss;
      }
    });

    var dots = root.querySelectorAll('.zae-dot');
    Array.prototype.forEach.call(dots, function (d, i) {
      d.classList.toggle('zae-active', i === idx);
    });

    root.dataset.zaeIndex = String(idx);
  }

  function step(root, delta) {
    var cur = parseInt(root.dataset.zaeIndex || '0', 10);
    show(root, cur + delta);
  }

  function init(root) {
    if (root.dataset.zaeReady === '1') return;

    var imgs = slides(root);
    if (imgs.length < 2) return;

    root.dataset.zaeReady = '1';
    root.classList.add('zae-slider');
    root.dataset.zaeIndex = '0';
    imgs[0].classList.add('zae-active');

    var prev = root.querySelector('.zae-nav--prev');
    var next = root.querySelector('.zae-nav--next');

    function bind(btn, delta) {
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        step(root, delta);
      });
    }
    bind(prev, -1);
    bind(next, 1);

    var startX = null;
    root.addEventListener('touchstart', function (e) {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });

    root.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        e.preventDefault();
        step(root, dx < 0 ? 1 : -1);
      }
      startX = null;
    });
  }

  function initAll(scope) {
    var nodes = (scope || document).querySelectorAll('.card-media[data-zae-slider]');
    Array.prototype.forEach.call(nodes, init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initAll(); });
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });

  var mo = new MutationObserver(function (muts) {
    for (var i = 0; i < muts.length; i++) {
      if (muts[i].addedNodes.length) { initAll(); break; }
    }
  });
  mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
})();
