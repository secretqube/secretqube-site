/* Shared by every page: language toggle, header border, copy buttons. */
(function () {
  var h = document.documentElement;

  function setLang(l) {
    h.setAttribute('data-lang', l); h.lang = l; h.dir = l === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('sq-lang', l); } catch (e) {}
    document.dispatchEvent(new Event('sq-lang'));
  }
  document.querySelectorAll('[data-lang-toggle]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(h.getAttribute('data-lang') === 'ar' ? 'en' : 'ar'); });
  });

  var top = document.getElementById('top');
  if (top) {
    var onScroll = function () { top.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-copy');
      var done = function () { var o = b.innerHTML; b.textContent = h.lang === 'ar' ? 'تم النسخ' : 'Copied'; setTimeout(function () { b.innerHTML = o; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, function () {});
    });
  });
})();
