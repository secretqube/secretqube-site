/* Landing page only: reveal-on-scroll, hero tilt and parallax, scroll story, count-up, spotlight, routing demo. */
(function () {
  var h = document.documentElement;
  h.classList.add('lp-js'); /* only now is it safe to hide .rv elements: this script will reveal them */
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var fine = matchMedia('(hover:hover) and (pointer:fine)');
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- reveal on scroll ---------- */
  var rvs = $$('.rv');
  if ('IntersectionObserver' in window && !reduce.matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rvs.forEach(function (el) { io.observe(el); });
  } else { rvs.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- count-up numbers ---------- */
  var counters = $$('[data-count]');
  function countUp(el) {
    var to = Number(el.getAttribute('data-count')), t0 = null, dur = 1400;
    if (!to || reduce.matches) { el.textContent = to; return; }
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0'; requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- one rAF loop for scroll-linked effects ---------- */
  var bar = $('.lp-progress'), fills = $$('.fill-text'), chips = $$('.chip'), blobs = $$('.lp-blob');
  var heroEl = $('#hero'), ticking = false;
  function onScroll() {
    var y = window.scrollY, max = h.scrollHeight - innerHeight;
    if (bar) bar.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    if (!reduce.matches) {
      if (heroEl && y < innerHeight * 1.3) {
        chips.forEach(function (c) { c.style.setProperty('--py', (-y * (Number(c.getAttribute('data-depth')) / 400)).toFixed(1) + 'px'); });
        blobs.forEach(function (b, i) { b.style.transform = 'translate3d(0,' + (y * (i ? -.08 : .12)).toFixed(1) + 'px,0)'; });
      }
      fills.forEach(function (f) {
        var r = f.getBoundingClientRect(), p = (innerHeight * 0.88 - r.top) / (innerHeight * 0.55 + r.height * .4);
        f.style.setProperty('--fp', Math.max(0, Math.min(1, p)).toFixed(3));
      });
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- hero phone: tilts toward the pointer ---------- */
  var dev = $('#hero-dev'), vis = $('#hero-visual');
  if (dev && vis && fine.matches && !reduce.matches) {
    var rtl = function () { return h.dir === 'rtl'; };
    vis.addEventListener('pointermove', function (e) {
      var r = vis.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      dev.style.setProperty('--ry', ((rtl() ? 8 : -8) + x * 16).toFixed(2) + 'deg');
      dev.style.setProperty('--rx', (4 - y * 12).toFixed(2) + 'deg');
      dev.style.setProperty('--gx', (x + .5).toFixed(3));
    });
    vis.addEventListener('pointerleave', function () {
      dev.style.removeProperty('--ry'); dev.style.removeProperty('--rx'); dev.style.setProperty('--gx', .5);
    });
  }

  /* ---------- scroll story: the sticky phone follows the active step ---------- */
  var steps = $$('.lp-step'), shots = $$('.lp-stack .sh'), dots = $$('.lp-dots i'), glow = $('.lp-glow');
  function activate(i) {
    steps.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
    shots.forEach(function (s, k) { s.classList.toggle('on', k === i); });
    dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
    if (glow) glow.style.transform = 'translateY(' + ((i - 2.5) * 14) + 'px) scale(' + (1 + (i % 2) * .08) + ')';
  }
  if (steps.length && 'IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) activate(Number(e.target.getAttribute('data-i'))); });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(function (s) { sio.observe(s); });
  }

  /* ---------- feature cards: a soft light follows the pointer ---------- */
  if (fine.matches) {
    $$('.bt').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- routing demo ---------- */
  var stage = $('#stage');
  if (!stage) return;
  var svg = $('svg.wires', stage), phone = $('.phone', stage), nodes = {}, live = {}, NS = 'http://www.w3.org/2000/svg';
  $$('.dest', stage).forEach(function (d) { nodes[d.getAttribute('data-d')] = d; });
  function bi(ar, en) { return '<span lang="ar">' + ar + '</span><span lang="en">' + en + '</span>'; }

  var cycles = [
    { from: 'Courier', msg: bi('طردك 4471 يصل اليوم بين 2 و5 مساءً', 'Your parcel 4471 arrives today, 2–5 pm'),
      rule: bi('القاعدة: الشحنات', 'Rule: Deliveries'), ruleSub: bi('المرسل يطابق Courier', 'Sender matches Courier'),
      to: ['tg', 'mail'], verdict: bi('أُرسلت إلى وجهتين', 'Sent to 2 destinations'), hold: false },
    { from: 'Verify', msg: bi('رمز التحقق الخاص بك 482913', 'Your verification code is 482913'),
      rule: bi('القاعدة: كل الرسائل', 'Rule: Every message'), ruleSub: bi('تبدو رمز تحقق', 'Looks like a one-time code'),
      to: [], verdict: bi('حُجبت وبقيت على جوالك', 'Held back. It stayed on your phone'), hold: true },
    { from: '<bdi dir="ltr">+1 555 0142</bdi>', msg: bi('مرحباً، هل الطلب 2207 جاهز للاستلام؟', 'Hi, is order 2207 ready for pickup?'),
      rule: bi('القاعدة: رسائل العملاء', 'Rule: Customer messages'), ruleSub: bi('خلال أوقات العمل', 'Within working hours'),
      to: ['link', 'sms'], verdict: bi('أُرسلت إلى وجهتين', 'Sent to 2 destinations'), hold: false }
  ];
  var elNotif = $('#st-notif'), elRule = $('#st-rule'), elVerdict = $('#st-verdict'), status = $('#demo-status');

  function layout() {
    var sb = stage.getBoundingClientRect(), pb = phone.getBoundingClientRect(), rtl = h.dir === 'rtl';
    svg.setAttribute('viewBox', '0 0 ' + sb.width + ' ' + sb.height);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var x0 = (rtl ? pb.left : pb.right) - sb.left, y0 = pb.top + pb.height * 0.42 - sb.top;
    Object.keys(nodes).forEach(function (k) {
      var nb = nodes[k].getBoundingClientRect();
      var x1 = (rtl ? nb.right : nb.left) - sb.left, y1 = nb.top + nb.height / 2 - sb.top, mx = (x0 + x1) / 2;
      var d = 'M' + x0 + ' ' + y0 + ' C' + mx + ' ' + y0 + ' ' + mx + ' ' + y1 + ' ' + x1 + ' ' + y1;
      var base = document.createElementNS(NS, 'path'); base.setAttribute('d', d); base.setAttribute('class', 'wire'); svg.appendChild(base);
      var lp = document.createElementNS(NS, 'path'); lp.setAttribute('d', d); lp.setAttribute('class', 'wire-live'); lp.setAttribute('pathLength', '1');
      svg.appendChild(lp); live[k] = lp;
    });
  }
  var timers = [], current = 0;
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clear() { timers.forEach(clearTimeout); timers = []; }
  function reset() {
    stage.classList.remove('go', 'matched', 'held', 'done');
    Object.keys(nodes).forEach(function (k) { nodes[k].classList.remove('lit'); if (live[k]) live[k].classList.remove('on'); });
  }
  function fill(c) {
    elNotif.innerHTML = '<b>' + c.from + '</b>' + c.msg;
    elRule.innerHTML = '<b>' + c.rule + '</b>' + c.ruleSub;
    elVerdict.innerHTML = c.verdict; elVerdict.className = 'verdict ' + (c.hold ? 'hold' : 'ok');
  }
  function result(c) {
    stage.classList.add('go', c.hold ? 'held' : 'matched', 'done');
    c.to.forEach(function (k) { nodes[k].classList.add('lit'); live[k].classList.add('on'); });
    if (status) status.innerHTML = c.verdict;
  }
  function play() {
    clear(); reset(); var c = cycles[current]; fill(c);
    $$('[data-scenario]').forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.dataset.scenario) === current)); });
    if (reduce.matches) { result(c); return; }
    if (status) status.innerHTML = bi('تصل الرسالة إلى جوالك…', 'A message arrives on your phone…');
    void stage.offsetWidth;
    later(function () { stage.classList.add('go'); }, 60);
    later(function () { stage.classList.add(c.hold ? 'held' : 'matched'); if (status) status.innerHTML = bi('جارٍ فحص القاعدة…', 'Checking your rule…'); }, 900);
    c.to.forEach(function (k, i) { later(function () { live[k].classList.add('on'); }, 1300 + i * 220); later(function () { nodes[k].classList.add('lit'); }, 2100 + i * 220); });
    later(function () { result(c); }, c.hold ? 1800 : 2800);
  }
  $$('[data-scenario]').forEach(function (b) { b.addEventListener('click', function () { current = Number(b.dataset.scenario); play(); }); });
  var replay = $('#replay'); if (replay) replay.addEventListener('click', play);

  var started = false;
  function start() { if (started) return; started = true; layout(); play(); }
  layout(); fill(cycles[0]);
  if ('IntersectionObserver' in window && !reduce.matches) {
    new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { start(); o.disconnect(); } }, { threshold: 0.35 }).observe(stage);
  } else { start(); }

  var rt;
  function relayout() { clearTimeout(rt); rt = setTimeout(function () { clear(); layout(); reset(); fill(cycles[current]); if (started) result(cycles[current]); }, 120); }
  window.addEventListener('resize', relayout);
  document.addEventListener('sq-lang', relayout);
  document.addEventListener('visibilitychange', function () { if (document.hidden && started) { clear(); result(cycles[current]); } });
  if (document.fonts) document.fonts.ready.then(relayout);
})();
