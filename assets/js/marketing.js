/* Marketing page — lightweight interactions only.
   No framework, no build step. Kept <2KB to preserve FCP budget. */

(function () {
  'use strict';

  // Nav links: smooth scroll + update URL without history spam
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });

  // Add subtle elevated class to nav once scrolled
  var nav = document.querySelector('.nav');
  if (nav) {
    var update = function () {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
})();
