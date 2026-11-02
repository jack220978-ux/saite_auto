// Общие анимации для всех демо-сайтов. Подключается одной строкой:
// <script src="../_obshee/zhivoe.js" defer></script>
// Что умеет (всё включается классами в разметке):
//   автоматически  - блоки плавно появляются при прокрутке, полоска прокрутки сверху
//   data-count="963"            - число «набегает» от нуля (можно data-dec="1" для 4,7)
//   .rotator data-words="а|б|в" - слова в заголовке сменяют друг друга
//   .marquee data-items="а|б|в" - бегущая строка
//   .btn-pulse                  - мягкая пульсация кнопки
//   .float / .float-2           - плавное покачивание
//   .kb                         - медленный наезд на картинку
//   .live-dot                   - мигающая точка «работаем сейчас»
//   .tilt                       - карточка чуть наклоняется за мышкой
//   автоматически  - пометка «фото-пример» на фото со стоков (images.unsplash.com)
//   .faq > details              - блок «Вопросы и ответы» (раскрывается по нажатию)
// 3D и «дорогие» эффекты:
//   .tilt.glare                 - при наклоне по карточке скользит блик света
//   [data-depth="0.4"]          - слой сдвигается за мышкой - эффект глубины (на телефоне стоит на месте)
//   .blob                       - мягкое «живое» пятно, плавно меняет форму
//   .magnet                     - кнопка чуть тянется к курсору
//   .live-dot data-open="10:00-22:00" - точка зелёная только в рабочие часы (по Москве)
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = [
    // страховка: страница никогда не «ездит» вбок на телефоне
    'html{overflow-x:clip}',
    '@media (max-width:360px){.mobile-bar{gap:6px!important;padding:8px 10px!important}.mobile-bar .btn{padding:12px 6px!important;font-size:14px!important;min-width:0}}',
    '.rv{opacity:0;transform:translateY(34px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.2,1)}',
    '.rv.on{opacity:1;transform:none}',
    '#zh-progress{position:fixed;top:0;left:0;height:3px;width:0;z-index:999;background:var(--accent,var(--leather,var(--wine,#ff7a45)));transition:width .1s linear}',
    '.rotator{display:inline-block;transition:opacity .35s,transform .35s}',
    '.rotator.out{opacity:0;transform:translateY(-14px)}',
    // все слова лежат друг на друге - место под самое длинное занято сразу, заголовок не прыгает
    '.rotator.rstack{display:inline-grid;vertical-align:bottom}',
    '.rotator.rstack .rw{grid-area:1/1;transition:opacity .4s,transform .4s}',
    '.rotator.rstack .rw.off{opacity:0;transform:translateY(-12px);pointer-events:none}',
    'h1,h2,.stat b,[data-count]{font-variant-numeric:tabular-nums}',
    '.marquee{overflow:hidden;white-space:nowrap;padding:16px 0;position:relative}',
    '.marquee .mq-track{display:inline-flex;gap:46px;animation:zh-mq 32s linear infinite;padding-left:46px}',
    '.marquee:hover .mq-track{animation-play-state:paused}',
    '.marquee .mq-track span{display:inline-flex;align-items:center;gap:46px}',
    '.marquee .mq-track span::after{content:"✦";opacity:.5}',
    '@keyframes zh-mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}',
    '.btn-pulse{position:relative}',
    '.btn-pulse::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:0 0 0 0 currentColor;animation:zh-pulse 2.4s infinite;opacity:.45;pointer-events:none;color:var(--accent,var(--leather,var(--wine,#ff7a45)))}',
    '@keyframes zh-pulse{0%{box-shadow:0 0 0 0 currentColor}70%{box-shadow:0 0 0 16px transparent}100%{box-shadow:0 0 0 0 transparent}}',
    '.float{animation:zh-float 5s ease-in-out infinite}',
    '.float-2{animation:zh-float 6s ease-in-out -2.5s infinite}',
    '@keyframes zh-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}',
    '.kb{animation:zh-kb 18s ease-in-out infinite alternate}',
    '@keyframes zh-kb{from{transform:scale(1)}to{transform:scale(1.09)}}',
    '.kb-wrap{overflow:hidden}',
    '.live-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#22c55e;margin-right:8px;vertical-align:middle;animation:zh-live 1.6s infinite}',
    '@keyframes zh-live{0%{box-shadow:0 0 0 0 rgba(34,197,94,.7)}70%{box-shadow:0 0 0 9px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}',
    '.tilt{transition:transform .25s ease, box-shadow .25s ease;will-change:transform}',
    // пометка всегда выглядит одинаково: чужие стили сайта (шрифт, размер, растяжка) на неё не действуют
    'span.zh-stock{position:absolute;right:12px;bottom:12px;left:auto;top:auto;width:auto!important;height:auto!important;z-index:3;background:rgba(0,0,0,.55)!important;color:#fff!important;font:600 11px/1.2 system-ui,sans-serif!important;letter-spacing:.02em!important;text-transform:none!important;text-align:left!important;padding:4px 9px!important;margin:0!important;border:0!important;border-radius:999px!important;box-shadow:none!important;transform:none!important;white-space:nowrap!important;pointer-events:none}',
    'span.zh-stock.left{right:auto;left:12px}',
    '.faq{max-width:820px;margin:0 auto;display:grid;gap:10px}',
    '.faq details{border:1px solid var(--line,#ddd);border-radius:16px;padding:0 22px;background:var(--card,var(--white,var(--paper,#fff)))}',
    '.faq summary{cursor:pointer;list-style:none;padding:18px 34px 18px 0;font-weight:700;font-size:17px;position:relative}',
    '.faq summary::-webkit-details-marker{display:none}',
    '.faq summary::after{content:"+";position:absolute;right:0;top:50%;transform:translateY(-50%);font-size:26px;line-height:1;color:var(--accent,var(--leather,var(--wine,#ff7a45)));transition:transform .25s}',
    '.faq details[open] summary::after{transform:translateY(-50%) rotate(45deg)}',
    '.faq details p{margin:0;padding:0 0 18px;color:var(--muted,#666);font-size:16px;line-height:1.6}',
    '.faq-h{text-align:center;margin-bottom:28px}',
    '.live-dot.closed{background:#9ca3af;animation:none}',
    '.tilt.glare{position:relative;overflow:hidden;transform-style:preserve-3d}',
    '.tilt.glare::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .3s;background:radial-gradient(circle at var(--gx,50%) var(--gy,50%),rgba(255,255,255,.38),rgba(255,255,255,0) 55%);mix-blend-mode:soft-light}',
    '.tilt.glare:hover::after{opacity:1}',
    '[data-depth]{will-change:transform;transition:transform .5s cubic-bezier(.2,.7,.2,1)}',
    '.blob{animation:zh-blob 14s ease-in-out infinite alternate;will-change:border-radius,transform}',
    '@keyframes zh-blob{0%{border-radius:42% 58% 63% 37%/41% 44% 56% 59%;transform:rotate(0) scale(1)}50%{border-radius:63% 37% 38% 62%/58% 63% 37% 42%;transform:rotate(12deg) scale(1.05)}100%{border-radius:37% 63% 51% 49%/37% 35% 65% 63%;transform:rotate(-8deg) scale(.97)}}',
    '.magnet{transition:transform .35s cubic-bezier(.2,.7,.2,1)}',
    '@media (prefers-reduced-motion: reduce){.rv{opacity:1;transform:none}.marquee .mq-track,.float,.float-2,.kb,.btn-pulse::after,.live-dot,.blob{animation:none}[data-depth]{transform:none!important}}'
  ].join('\n');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {
    // Бегущая строка: дублируем содержимое, чтобы лента шла без разрыва
    document.querySelectorAll('.marquee[data-items]').forEach(function (m) {
      var items = m.getAttribute('data-items').split('|');
      var html = items.map(function (t) { return '<span>' + t + '</span>'; }).join('');
      m.innerHTML = '<div class="mq-track">' + html + html + '</div>';
    });

    // Появление при прокрутке: сами заголовки и карточки внутри сеток
    var auto = 'section h2, section .head, section .title, ' +
      'section [class*="grid"] > *, .services > *, .steps > *, .why > *, .price-list > *, ' +
      '.gallery > *, .contacts > *, .review, .quote, .split > *, .rv-me';
    var els = Array.prototype.slice.call(document.querySelectorAll(auto)).filter(function (el) {
      return !el.closest('.hero') && !el.closest('header') && !el.classList.contains('wrap');
    });
    els.forEach(function (el) {
      el.classList.add('rv');
      var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sibs, 6) * 90 + 'ms';
    });
    if (reduce) els.forEach(function (el) { el.classList.add('on'); });

    // Счётчики
    function runCount(el) {
      var to = parseFloat(el.getAttribute('data-count'));
      var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
      var suf = el.getAttribute('data-suf') || '';
      function fmt(v) { return v.toFixed(dec).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + suf; }
      // ?shot в адресе - режим снимка для витрины: сразу верное число
      if (reduce || /[?&]shot/.test(location.search)) { el.textContent = fmt(to); return; }
      var t0 = null, dur = 1600, done = false;
      function step(t) {
        if (done) return;
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step); else done = true;
      }
      requestAnimationFrame(step);
      // если браузер притормозил анимацию, всё равно показываем верное число
      setTimeout(function () { done = true; el.textContent = fmt(to); }, dur + 400);
    }
    var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));

    // Проверяем по таймеру, что уже показалось на экране. Так блоки не останутся
    // невидимыми, даже если браузер не присылает события прокрутки.
    var bar = document.createElement('div');
    bar.id = 'zh-progress';
    document.body.appendChild(bar);
    function check() {
      var limit = innerHeight - 40;
      els = els.filter(function (el) {
        if (el.getBoundingClientRect().top < limit) { el.classList.add('on'); return false; }
        return true;
      });
      counters = counters.filter(function (c) {
        if (c.getBoundingClientRect().top < innerHeight - 20) { runCount(c); return false; }
        return true;
      });
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
    }
    check();
    window.addEventListener('scroll', check, { passive: true });
    setInterval(check, 250);

    // Сменяющиеся слова: спокойно, раз в 4 секунды, два круга - и остаёмся на первом слове
    document.querySelectorAll('.rotator[data-words]').forEach(function (r) {
      var words = r.getAttribute('data-words').split('|');
      var i = 0, shown = 0;
      if (reduce || words.length < 2) return;
      r.classList.add('rstack');
      r.innerHTML = words.map(function (w, k) { return '<span class="rw' + (k ? ' off' : '') + '"' + (k ? ' aria-hidden="true"' : '') + '>' + w + '</span>'; }).join('');
      var spans = r.querySelectorAll('.rw');
      var timer = setInterval(function () {
        spans[i].classList.add('off'); spans[i].setAttribute('aria-hidden', 'true');
        i = (i + 1) % words.length;
        spans[i].classList.remove('off'); spans[i].removeAttribute('aria-hidden');
        shown++;
        if (shown >= words.length * 2) clearInterval(timer);
      }, 4000);
    });

    // Пометка «фото-пример» на фото со стоков: одна на каждый блок с картинками
    document.querySelectorAll('img[src*="images.unsplash.com"]').forEach(function (img) {
      var p = img.parentElement;
      if (!p || p.querySelector(':scope > .zh-stock')) return;
      var cs = getComputedStyle(p);
      if (cs.position === 'static') p.style.position = 'relative';
      var tag = document.createElement('span');
      tag.className = 'zh-stock' + (cs.clipPath && cs.clipPath !== 'none' ? ' left' : '');
      tag.textContent = 'фото-пример';
      p.appendChild(tag);
    });

    // Наклон карточек за мышкой (только где есть мышь)
    if (!reduce && window.matchMedia('(hover: hover)').matches) {
      document.querySelectorAll('.tilt').forEach(function (c) {
        c.addEventListener('mousemove', function (e) {
          var b = c.getBoundingClientRect();
          var x = (e.clientX - b.left) / b.width - 0.5;
          var y = (e.clientY - b.top) / b.height - 0.5;
          var deg = c.classList.contains('glare') ? 9 : 6;
          c.style.transform = 'perspective(800px) rotateX(' + (-y * deg) + 'deg) rotateY(' + (x * deg) + 'deg) translateY(-4px)';
          c.style.setProperty('--gx', (x + 0.5) * 100 + '%');
          c.style.setProperty('--gy', (y + 0.5) * 100 + '%');
        });
        c.addEventListener('mouseleave', function () { c.style.transform = ''; });
      });

      // Кнопки-магниты
      document.querySelectorAll('.magnet').forEach(function (b) {
        b.addEventListener('mousemove', function (e) {
          var r = b.getBoundingClientRect();
          b.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * 0.18 + 'px,' + (e.clientY - r.top - r.height / 2) * 0.3 + 'px)';
        });
        b.addEventListener('mouseleave', function () { b.style.transform = ''; });
      });
    }

    // Слои глубины: за мышкой на компьютере, от прокрутки на телефоне
    var layers = Array.prototype.slice.call(document.querySelectorAll('[data-depth]'));
    if (layers.length && !reduce) {
      var hasMouse = window.matchMedia('(hover: hover)').matches;
      var move = function (mx, my) {
        layers.forEach(function (l) {
          var d = parseFloat(l.getAttribute('data-depth')) || 0.2;
          l.style.transform = 'translate3d(' + (mx * d * 40) + 'px,' + (my * d * 40) + 'px,0)';
        });
      };
      // на телефоне слои стоят на месте: при прокрутке движение выглядит как «уплывшая» вёрстка
      if (hasMouse) {
        window.addEventListener('mousemove', function (e) {
          move(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5);
        }, { passive: true });
      }
    }

    // Автоподгонка: если длинное слово не помещается в свой блок (узкий телефон),
    // уменьшаем шрифт этого блока шагами, пока слово не влезет (не меньше 60%)
    function fitText() {
      var list = document.querySelectorAll('h1,h2,h3,blockquote,p,b,span,small,a.btn,button,li,dt,dd,label');
      list.forEach(function (e) { if (e.dataset.zhFit) { e.style.fontSize = ''; delete e.dataset.zhFit; } });
      list.forEach(function (e) {
        if (e.closest('.marquee,.tape,[aria-hidden="true"],svg,.mq-track')) return;
        var cs = getComputedStyle(e);
        if (cs.display === 'inline' || cs.whiteSpace === 'nowrap' || !e.clientWidth) return;
        var base = parseFloat(cs.fontSize), k = 1;
        while (e.scrollWidth > e.clientWidth + 1 && k > 0.6) {
          k -= 0.06;
          e.style.fontSize = (base * k) + 'px';
          e.dataset.zhFit = '1';
        }
      });
    }
    fitText();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
    setTimeout(fitText, 1200);
    var fitTimer;
    window.addEventListener('resize', function () { clearTimeout(fitTimer); fitTimer = setTimeout(fitText, 200); });

    // Точка «открыто сейчас»: зелёная только в рабочие часы (время московское)
    document.querySelectorAll('.live-dot[data-open]').forEach(function (dot) {
      var p = dot.getAttribute('data-open').split('-');
      function mins(s) { var a = s.split(':'); return +a[0] * 60 + (+a[1] || 0); }
      var now = new Date(), msk = (now.getUTCHours() + 3) % 24 * 60 + now.getUTCMinutes();
      if (msk < mins(p[0]) || msk >= mins(p[1])) dot.classList.add('closed');
    });
  });
})();
