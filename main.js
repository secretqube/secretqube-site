(function () {
  var h = document.documentElement;

  /* ---------- Language toggle ---------- */
  function setLang(l) {
    h.setAttribute('data-lang', l); h.lang = l; h.dir = l === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('sq-lang', l); } catch (e) {}
    document.dispatchEvent(new Event('sq-lang'));
  }
  document.querySelectorAll('[data-lang-toggle]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(h.getAttribute('data-lang') === 'ar' ? 'en' : 'ar'); });
  });

  /* ---------- Header border once scrolled ---------- */
  var top = document.getElementById('top');
  if (top) {
    var onScroll = function () { top.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ---------- Copy buttons (privacy / support) ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-copy');
      var done = function () { var o = b.innerHTML; b.textContent = h.lang === 'ar' ? 'تم النسخ' : 'Copied'; setTimeout(function () { b.innerHTML = o; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, function () {});
    });
  });

  document.querySelectorAll('[data-tour]').forEach(function(b){
    b.addEventListener('click',function(){
      var n=Number(b.dataset.tour), shots=document.querySelectorAll('.shot');
      document.querySelectorAll('[data-tour]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});
      shots.forEach(function(x,i){x.classList.toggle('is-selected',i===n);});
      var rail=document.querySelector('.screens'), target=shots[n];
      rail.scrollBy({left:target.getBoundingClientRect().left+target.offsetWidth/2-rail.getBoundingClientRect().left-rail.clientWidth/2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    });
  });
  var firstShot=document.querySelector('.shot');if(firstShot)firstShot.classList.add('is-selected');
  var selectedPlan=null;
  function planAdvice(){
    if(selectedPlan===null)return;
    var names=['Free','Pro','Business'];
    document.getElementById('plan-advice').textContent=h.lang==='ar'?'الخطة المناسبة لهذا الاستخدام: '+names[selectedPlan]:'A good fit for this workflow: '+names[selectedPlan];
  }
  document.querySelectorAll('[data-plan]').forEach(function(b){b.addEventListener('click',function(){
    selectedPlan=Number(b.dataset.plan);
    document.querySelectorAll('[data-plan]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});
    document.querySelectorAll('.plan').forEach(function(x,i){x.classList.toggle('recommended',i===selectedPlan);});planAdvice();
  });});
  document.addEventListener('sq-lang',planAdvice);

  /* ---------- Hero: a message arriving and being routed ---------- */
  var stage = document.getElementById('stage');
  if (!stage) return;
  var svg = stage.querySelector('svg.wires');
  var phone = stage.querySelector('.phone');
  var nodes = {};
  stage.querySelectorAll('.dest').forEach(function (d) { nodes[d.getAttribute('data-d')] = d; });
  var NS = 'http://www.w3.org/2000/svg';
  var live = {};

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
      to: ['slack', 'sheets', 'sms'], verdict: bi('أُرسلت إلى 3 وجهات', 'Sent to 3 destinations'), hold: false },
    // A message in another language: the app forwards any script as it is.
    { from: 'Mamá', msg: '<span dir="ltr" lang="es-x">¿Llegaste bien? Llámame cuando puedas.</span>',
      rule: bi('القاعدة: أمي إلى جوالي الثاني', 'Rule: Mom to my second phone'), ruleSub: bi('كل رسائلها', 'All her messages'),
      to: ['sms', 'tg'], verdict: bi('أُرسلت إلى وجهتين', 'Sent to 2 destinations'), hold: false }
  ];

  var elNotif = document.getElementById('st-notif'), elRule = document.getElementById('st-rule'), elVerdict = document.getElementById('st-verdict');

  function layout() {
    var sb = stage.getBoundingClientRect(), pb = phone.getBoundingClientRect();
    svg.setAttribute('viewBox', '0 0 ' + sb.width + ' ' + sb.height);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var rtl = h.dir === 'rtl';
    var x0 = (rtl ? pb.left : pb.right) - sb.left, y0 = pb.top + pb.height * 0.42 - sb.top;
    Object.keys(nodes).forEach(function (k) {
      var nb = nodes[k].getBoundingClientRect();
      var x1 = (rtl ? nb.right : nb.left) - sb.left, y1 = nb.top + nb.height / 2 - sb.top;
      var mx = (x0 + x1) / 2;
      var d = 'M' + x0 + ' ' + y0 + ' C' + mx + ' ' + y0 + ' ' + mx + ' ' + y1 + ' ' + x1 + ' ' + y1;
      var base = document.createElementNS(NS, 'path'); base.setAttribute('d', d); base.setAttribute('class', 'wire'); svg.appendChild(base);
      var lp = document.createElementNS(NS, 'path'); lp.setAttribute('d', d); lp.setAttribute('class', 'wire-live'); lp.setAttribute('pathLength', '1');
      svg.appendChild(lp); live[k] = lp;
    });
  }

  var timers = [], current = 0;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var status = document.getElementById('demo-status');
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clear() { timers.forEach(clearTimeout); timers = []; }
  function reset() {
    stage.classList.remove('go','matched','held','done');
    Object.keys(nodes).forEach(function(k){nodes[k].classList.remove('lit');if(live[k])live[k].classList.remove('on');});
  }
  function fill(c) {
    elNotif.innerHTML='<b>'+c.from+'</b>'+c.msg;
    elRule.innerHTML='<b>'+c.rule+'</b>'+c.ruleSub;
    elVerdict.innerHTML=c.verdict;
    elVerdict.className='verdict '+(c.hold?'hold':'ok');
  }
  function result(c){
    stage.classList.add('go',c.hold?'held':'matched','done');
    c.to.forEach(function(k){nodes[k].classList.add('lit');live[k].classList.add('on');});
    if(status)status.innerHTML=c.verdict;
  }
  function play(){
    clear();reset();var c=cycles[current];fill(c);
    document.querySelectorAll('[data-scenario]').forEach(function(b){b.setAttribute('aria-pressed',String(Number(b.dataset.scenario)===current));});
    if(reduce.matches){result(c);return;}
    if(status)status.innerHTML=bi('تصل الرسالة إلى جوالك…','A message arrives on your phone…');
    void stage.offsetWidth;
    later(function(){stage.classList.add('go');},60);
    later(function(){stage.classList.add(c.hold?'held':'matched');if(status)status.innerHTML=bi('جارٍ فحص القاعدة…','Checking your rule…');},900);
    c.to.forEach(function(k,i){later(function(){live[k].classList.add('on');},1300+i*220);later(function(){nodes[k].classList.add('lit');},2100+i*220);});
    later(function(){result(c);},c.hold?1800:2800);
  }
  document.querySelectorAll('[data-scenario]').forEach(function(b){b.addEventListener('click',function(){current=Number(b.dataset.scenario);play();});});
  var replay=document.getElementById('replay');if(replay)replay.addEventListener('click',play);
  layout();play();
  var rt;
  function relayout(){clearTimeout(rt);rt=setTimeout(function(){clear();layout();reset();fill(cycles[current]);result(cycles[current]);},120);}
  window.addEventListener('resize',relayout);
  document.addEventListener('sq-lang',relayout);
  document.addEventListener('visibilitychange',function(){if(document.hidden){clear();result(cycles[current]);}});
  if(reduce.addEventListener)reduce.addEventListener('change',relayout);
  if(document.fonts)document.fonts.ready.then(relayout);

})();
