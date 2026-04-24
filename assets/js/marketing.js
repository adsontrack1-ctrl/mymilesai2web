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

  // Hamburger drawer toggle — show hamburger only on <=900px via MQ listener.
  // Using the `hidden` HTML attribute bypasses any stylesheet caching/loading issues
  // that were breaking the pure-CSS toggle.
  var hamburger = document.querySelector('.nav-hamburger');
  var drawer = document.getElementById('nav-drawer');
  if (hamburger && drawer) {
    var mq = window.matchMedia('(max-width: 900px)');
    var syncHamburgerVisibility = function () {
      hamburger.hidden = !mq.matches;
      if (!mq.matches) {
        drawer.hidden = true;
        drawer.dataset.open = 'false';
      }
    };
    syncHamburgerVisibility();
    if (mq.addEventListener) mq.addEventListener('change', syncHamburgerVisibility);
    else if (mq.addListener) mq.addListener(syncHamburgerVisibility);

    var setOpen = function (open) {
      drawer.hidden = !open;
      drawer.dataset.open = open ? 'true' : 'false';
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    hamburger.addEventListener('click', function () {
      setOpen(drawer.hidden === true);
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

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
