/* Runs in <head> before paint: picks the page language (link ?lang= > saved choice > browser). */
(function () {
  var h = document.documentElement, l = null;
  var m = location.search.match(/[?&]lang=(ar|en)/) || location.hash.match(/lang=(ar|en)/);
  if (m) l = m[1];
  if (!l) { try { l = localStorage.getItem('sq-lang'); } catch (e) {} }
  if (l !== 'ar' && l !== 'en') l = /^ar\b/i.test(navigator.language || '') ? 'ar' : 'en';
  h.setAttribute('data-lang', l); h.lang = l; h.dir = l === 'ar' ? 'rtl' : 'ltr';
})();
