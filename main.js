
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var NL = String.fromCharCode(10);
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var CHARS = '!<>-_[]{}=+*^?#$%&0123456789ABCDEF';
  var randCh = function () { return CHARS[Math.floor(Math.random() * CHARS.length)]; };
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = function () { return mqReduce.matches; };
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- audio ---------- */
  var actx = null;
  var sndOn = false;

  function tone(freq, dur, type, gain, when) {
    if (!sndOn) return;
    try {
      if (!actx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        actx = new AC();
      }
      if (actx.state === 'suspended') actx.resume();
      var t0 = actx.currentTime + (when || 0);
      var osc = actx.createOscillator();
      var g = actx.createGain();
      osc.type = type || 'square';
      osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain || 0.03, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g);
      g.connect(actx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    } catch (err) {}
  }
  var blip = function () { tone(880, 0.045, 'square', 0.02); };
  var clickSnd = function () { tone(320, 0.05, 'square', 0.028); tone(640, 0.04, 'square', 0.015, 0.045); };

  var sndBtn = $('#snd');
  sndBtn.addEventListener('click', function () {
    sndOn = !sndOn;
    sndBtn.classList.toggle('on', sndOn);
    sndBtn.textContent = sndOn ? '[ SND ON ]' : '[ SND OFF ]';
    sndBtn.setAttribute('aria-pressed', String(sndOn));
    if (sndOn) {
      tone(523, 0.08, 'square', 0.028);
      tone(784, 0.1, 'square', 0.024, 0.09);
      tone(1046, 0.12, 'square', 0.018, 0.2);
    }
  });

  /* ---------- glyph demon ---------- */
  var demonLines = [
    '   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄   ',
    '   █   GLYPH  //  DEMON   █   ',
    '   ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀   ',
    '',
    '     ██╗  ██╗ █████╗  ██╗██╗  ██╗',
    '     ██║  ██║██╔══██╗███║██║  ██║',
    '     ███████║███████║╚█████████║',
    '     ██╔══██║██╔══██║ ██║██╔══██║',
    '     ██║  ██║██║  ██║ ██║██║  ██║',
    '     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═╝╚═╝  ╚═╝',
    '',
    '   INFECTED_SYSTEM  //  ACCESS_OVERRIDE   '
  ].join(NL);

  var demonEl = $('#demon');
  $('#demonArt').textContent = demonLines;

  function demonFlash(ms) {
    demonEl.classList.add('on');
    tone(90, 0.3, 'sawtooth', 0.045);
    tone(64, 0.34, 'square', 0.03, 0.12);
    window.setTimeout(function () { demonEl.classList.remove('on'); }, ms || 420);
  }

  /* ---------- boot ---------- */
  var BOOT = [
    ['SHV-BIOS v4.0  //  DB_QUIAMBAO SYSTEMS', 'dimtxt'],
    ['────────────────────────────────────────────────', 'dimtxt'],
    ['CPU  : Intel Core i7-9700K @ 3.60GHz', 'dimtxt'],
    ['RAM  : 16384MB OK', 'dimtxt'],
    ['DISK : /dev/sda1  mounted at /', 'dimtxt'],
    ['', ''],
    ['[ OK ] loading kernel modules', 'ok'],
    ['[ OK ] network stack ready', 'ok'],
    ['[ OK ] audio + gpu context', 'ok'],
    ['[WARN] bluetooth hardware not found', 'warn'],
    ['', ''],
    ['!! THREAT DETECTED :: TROJAN.GLYPH.001', 'err'],
    ['   heuristic match 98.7%', 'err'],
    ['   infected: /sys/portfolio/core.js', 'err'],
    ['   infected: /sys/portfolio/style.css', 'err'],
    ['', ''],
    ['> quarantine --force', 'warn'],
    ['[ OK ] core.js   ->  /quarantine/*.vir', 'ok'],
    ['[ OK ] style.css ->  /quarantine/*.vir', 'ok'],
    ['[ OK ] threat neutralised · integrity 100%', 'ok'],
    ['', ''],
    ['> decrypt --key=AES256 render --full', 'info'],
    ['[ OK ] handshake ECDHE-RSA-AES256-GCM', 'ok'],
    ['[ OK ] certificate CN=dbquiambao', 'ok'],
    ['[ OK ] glyph daemon mounted r/w', 'ok'],
    ['', ''],
    ['╔══════════════════════════════════════════════╗', 'info'],
    ['║   ACCESS GRANTED  ·  CLEARANCE LEVEL_1       ║', 'info'],
    ['╚══════════════════════════════════════════════╝', 'info'],
    ['', ''],
    ['dhustine@portfolio:~$ _', 'ok']
  ];

  var bootEl = $('#boot');
  var logEl = $('#bootLog');
  var unlocked = false;

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    $('#bar').classList.add('up');
    $('#dock').classList.add('up');
    showSlide(0, true);
    scrambleName();
  }

  function runBoot() {
    bootEl.classList.remove('done', 'is-dying');
    bootEl.style.display = '';
    logEl.innerHTML = '';
    var i = 0;

    function tick() {
      if (i >= BOOT.length) {
        window.setTimeout(function () {
          demonFlash(430);
          window.setTimeout(function () {
            bootEl.classList.add('is-dying');
            tone(1200, 0.14, 'sine', 0.026);
            window.setTimeout(function () {
              bootEl.classList.add('done');
              unlock();
            }, 640);
          }, 380);
        }, 400);
        return;
      }
      var pair = BOOT[i];
      var d = document.createElement('div');
      d.className = pair[1];
      if (i === BOOT.length - 1) {
        d.innerHTML = pair[0].replace('_', '<span class="cursor"></span>');
      } else {
        d.textContent = pair[0];
      }
      logEl.appendChild(d);
      if (i % 2 === 0) tone(1400 + i * 12, 0.018, 'square', 0.007);
      i++;
      window.setTimeout(tick, i < 7 ? 86 : 50);
    }
    tick();
  }

  /* ---------- name scramble ---------- */
  function scrambleName() {
    var words = $$('.name .w');
    if (!words.length) return;

    if (reduced()) {
      words.forEach(function (el) { el.textContent = el.dataset.t; });
      return;
    }

    var start = performance.now();
    words.forEach(function (el, wi) {
      el.textContent = '';
      var final = el.dataset.t;
      var settleAt = 320 + wi * 260;
      var timer = window.setInterval(function () {
        var elapsed = performance.now() - start;
        if (elapsed >= settleAt) {
          el.textContent = final;
          window.clearInterval(timer);
          return;
        }
        var out = '';
        for (var k = 0; k < final.length; k++) {
          out += (k % 3 === 0 && Math.random() > 0.35) ? randCh() : final.charAt(k);
        }
        el.textContent = out;
      }, 32);
    });
  }

  $$('.name .w').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      el.classList.add('burst');
      blip();
      window.setTimeout(function () { el.classList.remove('burst'); }, 540);
    });
  });

  /* ---------- clear window punched over the home portrait ---------- */
  var crtLayer = $('.crt');
  var beamLayer = $('.scanbeam');

  function setClear(el, x, y, w, h) {
    if (!el) return;
    el.style.setProperty('--cx', x + 'px');
    el.style.setProperty('--cy', y + 'px');
    el.style.setProperty('--cw', w + 'px');
    el.style.setProperty('--ch', h + 'px');
  }

  function updateScanWindow() {
    if (!crtLayer) return;
    var on = homeSlide && homeSlide.classList.contains('on') && cardFrame;
    if (!on) {
      setClear(crtLayer, 0, 0, 0, 0);
      setClear(beamLayer, 0, 0, 0, 0);
      return;
    }
    var r = cardFrame.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var pad = 8;
    setClear(crtLayer, Math.round(r.left - pad), Math.round(r.top - pad),
             Math.round(r.width + pad * 2), Math.round(r.height + pad * 2));
    setClear(beamLayer, Math.round(r.left - pad), Math.round(r.top - pad),
             Math.round(r.width + pad * 2), Math.round(r.height + pad * 2));
  }

  updateScanWindow();
  window.addEventListener('resize', updateScanWindow);
  window.setInterval(updateScanWindow, 160);

  /* ---------- slide engine ---------- */
  var slides = $$('.slide');
  var navBtns = $$('.bar__nav button');
  var barsEl = $('#bars');
  var TOTAL = slides.length;
  var cur = 0;
  var typeTimer = null;

  slides.forEach(function () {
    var i = document.createElement('i');
    barsEl.appendChild(i);
  });

  function typeCmd(slide) {
    var term = $('.term', slide);
    if (!term) return;
    var out = $('.t', term);
    var full = term.dataset.cmd || '';
    if (typeTimer) window.clearTimeout(typeTimer);
    out.textContent = '';
    if (reduced()) { out.textContent = full; return; }
    var i = 0;
    function step() {
      out.textContent = full.slice(0, i);
      if (i >= full.length) return;
      i++;
      if (i % 3 === 0) blip();
      typeTimer = window.setTimeout(step, 32);
    }
    step();
  }

  function countSkills() {
    $$('.skill__pct').forEach(function (el) {
      if (el.dataset.done === '1') return;
      el.dataset.done = '1';
      var target = parseInt(el.dataset.v, 10);
      if (reduced()) { el.textContent = target + '%'; return; }
      var n = 0;
      var timer = window.setInterval(function () {
        n += Math.max(1, Math.round(target / 26));
        if (n >= target) { n = target; window.clearInterval(timer); }
        el.textContent = n + '%';
      }, 34);
    });
  }

  function showSlide(n, silent) {
    if (n < 0 || n >= TOTAL) return;
    cur = n;

    slides.forEach(function (s, i) { s.classList.toggle('on', i === n); });
    navBtns.forEach(function (b, i) { b.classList.toggle('on', i === n); });

    $('#cur').textContent = String(n + 1).padStart(2, '0');
    $('#railIdx').textContent = String(n + 1).padStart(2, '0');
    Array.prototype.forEach.call(barsEl.children, function (b, i) {
      b.classList.toggle('on', i === n);
    });

    $('#prev').disabled = n === 0;
    $('#next').disabled = n === TOTAL - 1;

    typeCmd(slides[n]);
    if (n === 1) countSkills();
    if (n !== 0) scrambleSlide(slides[n]);

    if (!silent) {
      var deck = $('#deck');
      var sweep = $('#sweep');
      var portal = $('#portal');
      sweep.classList.remove('run');
      portal.classList.remove('fire');
      void sweep.offsetWidth;
      sweep.classList.add('run');
      portal.classList.add('fire');
      deck.classList.add('glitching', 'flicker');
      fireCracks();
      window.setTimeout(function () { deck.classList.remove('glitching', 'flicker'); }, 420);
      tone(240, 0.06, 'square', 0.022);
      tone(160, 0.09, 'sawtooth', 0.014, 0.02);
    }
    $('#nav').classList.remove('open');
    updateScanWindow();
  }

  $('#next').addEventListener('click', function () { showSlide(cur + 1); });
  $('#prev').addEventListener('click', function () { showSlide(cur - 1); });
  navBtns.forEach(function (b) {
    b.addEventListener('click', function () { showSlide(parseInt(b.dataset.go, 10)); });
    b.addEventListener('mouseenter', blip);
  });

  $('#burger').addEventListener('click', function (e) {
    var nav = $('#nav');
    var open = nav.classList.toggle('open');
    e.currentTarget.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('keydown', function (e) {
    if (lbOpen) {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); e.stopPropagation(); closeLb();
      }
      return;
    }
    if (e.key === 'g' || e.key === 'G') { demonFlash(500); return; }
    if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].indexOf(e.key) > -1) {
      e.preventDefault(); showSlide(cur + 1);
    }
    if (['ArrowLeft', 'ArrowUp', 'PageUp'].indexOf(e.key) > -1) {
      e.preventDefault(); showSlide(cur - 1);
    }
    if (e.key === 'Home') showSlide(0);
    if (e.key === 'End') showSlide(TOTAL - 1);
  });

  var touchY = 0;
  document.addEventListener('touchstart', function (e) {
    touchY = e.changedTouches[0].screenY;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    var d = touchY - e.changedTouches[0].screenY;
    if (Math.abs(d) > 55) { if (d > 0) showSlide(cur + 1); else showSlide(cur - 1); }
  }, { passive: true });

  /* ---------- clock + session ---------- */
  var sessionStart = Date.now();
  function tickClock() {
    var d = new Date();
    $('#clock').textContent = d.toLocaleTimeString('en-GB', { hour12: false });
    var el = Math.floor((Date.now() - sessionStart) / 1000);
    var mm = String(Math.floor(el / 60) % 60).padStart(2, '0');
    var ss = String(el % 60).padStart(2, '0');
    var u = $('#uptime');
    if (u) u.textContent = mm + ':' + ss;
  }
  tickClock();
  window.setInterval(tickClock, 1000);

  var visit = new Date();
  var lastVisitEl = $('#lastVisit');
  if (lastVisitEl) {
    lastVisitEl.textContent = visit
      .toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
      .toUpperCase();
  }

  /* ---------- pointer: glow, parallax, eyes, card tilt ---------- */
  var glow = $('#glow');
  var eyes = $('#eyes');
  var homeSlide = $('.slide--home');
  var card = $('#card');
  var cardTilt = $('#cardTilt');
  var cardFrame = $('#cardFrame');
  var homeMain = $('.home-main');

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.setProperty('--mx', mouseX + 'px');
    glow.style.setProperty('--my', mouseY + 'px');
  }, { passive: true });

  function setVar(el, name, val) {
    if (el) el.style.setProperty(name, val);
  }

  if (fine && homeSlide && !reduced()) {
    homeSlide.addEventListener('pointermove', function (e) {
      var r = homeSlide.getBoundingClientRect();
      var nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      var ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      setVar(homeSlide, '--nx', nx.toFixed(3));
      setVar(homeSlide, '--ny', ny.toFixed(3));
    });
    homeSlide.addEventListener('pointerleave', function () {
      setVar(homeSlide, '--nx', '0');
      setVar(homeSlide, '--ny', '0');
    });
  }

  if (fine && card && cardTilt && !reduced()) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var rx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      var ry = ((e.clientY - r.top) / r.height - 0.5) * 2;
      setVar(cardTilt, '--rx', rx.toFixed(3));
      setVar(cardTilt, '--ry', ry.toFixed(3));
      setVar(cardFrame, '--gx', ((rx + 1) * 50) + '%');
      setVar(cardFrame, '--gy', ((ry + 1) * 50) + '%');
    });
    card.addEventListener('pointerleave', function () {
      setVar(cardTilt, '--rx', '0');
      setVar(cardTilt, '--ry', '0');
    });
  }

  if (fine && !reduced()) {
    (function eyeLoop() {
      if (eyes && homeSlide && homeSlide.classList.contains('on')) {
        var r = eyes.getBoundingClientRect();
        var ex = r.left + r.width / 2;
        var ey = r.top + r.height / 2;
        var dx = Math.max(-6, Math.min(6, (mouseX - ex) / 40));
        var dy = Math.max(-5, Math.min(5, (mouseY - ey) / 40));
        var pupils = eyes.querySelectorAll('.pupil');
        for (var i = 0; i < pupils.length; i++) {
          pupils[i].style.setProperty('--px', dx + 'px');
          pupils[i].style.setProperty('--py', dy + 'px');
        }
      }
      window.setTimeout(eyeLoop, 90);
    })();
  }

  /* magnetic dock buttons */
  if (!reduced()) {
    $$('.dock__btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var px = (e.clientX - r.left - r.width / 2) / r.width;
        var py = (e.clientY - r.top - r.height / 2) / r.height;
        btn.style.transform = 'translate(' + (px * 5).toFixed(1) + 'px,' + (py * 3).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- matrix rain ---------- */
  (function matrix() {
    var cv = $('#matrix');
    if (!cv || reduced()) return;
    var ctx = cv.getContext('2d');
    var size = 15;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}=+-_/|$#@';
    var cols = 0;
    var drops = [];

    function sizeCanvas() {
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
      cols = Math.ceil(cv.width / size);
      drops = [];
      for (var i = 0; i < cols; i++) drops.push(Math.random() * -60);
    }
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    function frame() {
      ctx.fillStyle = 'rgba(8,7,10,0.14)';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.font = size + 'px "IBM Plex Mono", monospace';
      for (var i = 0; i < cols; i++) {
        var ch = chars[Math.floor(Math.random() * chars.length)];
        var y = drops[i] * size;
        ctx.fillStyle = Math.random() > 0.985
          ? 'rgba(255,221,155,0.5)'
          : 'rgba(255,180,60,0.28)';
        ctx.fillText(ch, i * size, y);
        if (y > cv.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.7;
      }
      requestAnimationFrame(frame);
    }
    frame();
  })();

  /* ---------- replay boot ---------- */
  $('#reboot').addEventListener('click', function () {
    clickSnd();
    unlocked = false;
    $('#bar').classList.remove('up');
    $('#dock').classList.remove('up');
    runBoot();
  });

  /* ---------- language scramble on headings ---------- */
  function textNodesOf(root) {
    var out = [];
    (function walk(n) {
      for (var i = 0; i < n.childNodes.length; i++) {
        var c = n.childNodes[i];
        if (c.nodeType === 3 && c.nodeValue && c.nodeValue.trim()) out.push(c);
        else if (c.nodeType === 1) walk(c);
      }
    })(root);
    return out;
  }

  function scrambleSlide(slide) {
    if (reduced() || !slide) return;
    var targets = $$('.h-display, .mile__t, .node__name', slide);
    targets.forEach(function (el, ti) {
      textNodesOf(el).forEach(function (node, ni) {
        var orig = node.nodeValue;
        if (orig.trim().length < 2) return;
        var start = performance.now() + 240 + ti * 120 + ni * 90;
        var dur = 460 + orig.length * 12;
        (function frame() {
          var t = performance.now();
          if (t < start) { requestAnimationFrame(frame); return; }
          var p = Math.min(1, (t - start) / dur);
          var locked = Math.floor(p * orig.length);
          var s = orig.slice(0, locked);
          for (var k = locked; k < orig.length; k++) {
            var c = orig.charAt(k);
            s += (c === ' ') ? ' ' : randCh();
          }
          node.nodeValue = s;
          if (p < 1) requestAnimationFrame(frame);
          else node.nodeValue = orig;
        })();
      });
    });
  }

  /* ---------- glass break cracks ---------- */
  var cracksEl = $('#cracks');
  var cracksTimer = null;
  function fireCracks() {
    if (!cracksEl || reduced()) return;
    cracksEl.classList.remove('run');
    void cracksEl.offsetWidth;
    cracksEl.classList.add('run');
    if (cracksTimer) window.clearTimeout(cracksTimer);
    cracksTimer = window.setTimeout(function () { cracksEl.classList.remove('run'); }, 950);
  }

  /* ---------- typing demon hands ---------- */
  var handsEl = $('#handsTxt');
  var daemonTypeEl = $('#daemonType');
  var HAND_FRAMES = [' ╱█╲     ╱█╲ ', ' ╲█╱     ╲█╱ '];
  var HAND_MSGS = [
    'compiling dreams…',
    'feeding the glyph demon…',
    'hunting stray semicolons…',
    'negotiating with CSS…',
    'polishing pixels at 3am…',
    'overclocking intuition…'
  ];
  var handFlip = 0;
  window.setInterval(function () {
    if (!handsEl || reduced() || cur !== 0 || !unlocked) return;
    handFlip ^= 1;
    handsEl.textContent = HAND_FRAMES[handFlip];
  }, 340);

  var msgIdx = 0;
  function typeDaemonMsg() {
    if (!daemonTypeEl) return;
    var msg = HAND_MSGS[msgIdx % HAND_MSGS.length];
    msgIdx++;
    if (reduced()) {
      daemonTypeEl.textContent = msg;
      window.setTimeout(typeDaemonMsg, 4600);
      return;
    }
    var i = 0;
    (function step() {
      if (cur !== 0 || !unlocked) { window.setTimeout(typeDaemonMsg, 1200); return; }
      daemonTypeEl.textContent = msg.slice(0, i);
      if (i >= msg.length) {
        window.setTimeout(function () { eraseDaemonMsg(msg); }, 1900);
        return;
      }
      i++;
      window.setTimeout(step, 34 + Math.random() * 26);
    })();
  }
  function eraseDaemonMsg(msg) {
    if (!daemonTypeEl) return;
    var i = msg.length;
    (function step() {
      if (cur !== 0 || !unlocked) { daemonTypeEl.textContent = ''; window.setTimeout(typeDaemonMsg, 1500); return; }
      daemonTypeEl.textContent = msg.slice(0, i);
      if (i <= 0) { window.setTimeout(typeDaemonMsg, 500); return; }
      i--;
      window.setTimeout(step, 16);
    })();
  }
  typeDaemonMsg();

  /* ---------- ambient glyph demon peek ---------- */
  var peekEl = $('#peek');
  var peekHideTimer = null;
  function peekShow() {
    if (!peekEl || peekEl.classList.contains('in')) return;
    peekEl.classList.add('in');
    tone(180, 0.12, 'sawtooth', 0.018);
    if (peekHideTimer) window.clearTimeout(peekHideTimer);
    peekHideTimer = window.setTimeout(function () { peekEl.classList.remove('in'); }, 3200);
  }
  function peekScare() {
    if (!peekEl) return;
    peekEl.classList.remove('in');
    if (peekHideTimer) window.clearTimeout(peekHideTimer);
    demonFlash(380);
    clickSnd();
  }
  if (peekEl) {
    peekEl.addEventListener('click', peekScare);
    peekEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); peekScare(); }
    });
    (function schedulePeek() {
      window.setTimeout(function () {
        if (unlocked && !reduced() && !document.hidden) peekShow();
        schedulePeek();
      }, 15000 + Math.random() * 17000);
    })();
  }

  /* ---------- academic archive: stage tabs ---------- */
  var tlItems = $$('.tl__item');
  var recPanes = $$('.rec__pane');

  function showStage(key) {
    if (!key) return;
    tlItems.forEach(function (b) {
      var on = b.dataset.key === key;
      b.classList.toggle('is-active', on);
      b.classList.remove('is-locked');
      b.setAttribute('aria-selected', String(on));
    });
    recPanes.forEach(function (p) { p.classList.toggle('is-on', p.dataset.key === key); });
    clickSnd();
  }

  tlItems.forEach(function (b) {
    b.addEventListener('click', function () { showStage(b.dataset.key); });
  });

  /* ---------- evidence lightbox ---------- */
  var lbEl = $('#lb');
  var lbImg = $('#lbImg');
  var lbCap = $('#lbCap');
  var lbOpen = false;

  function openLb(src, cap, alt) {
    if (!lbEl || !src) return;
    lbImg.src = src;
    lbImg.alt = alt || '';
    lbCap.textContent = cap || '';
    lbEl.hidden = false;
    lbEl.classList.add('on');
    lbOpen = true;
    document.body.style.overflow = 'hidden';
    tone(520, 0.05, 'square', 0.02);
  }
  function closeLb() {
    if (!lbEl) return;
    lbEl.classList.remove('on');
    lbEl.hidden = true;
    lbImg.src = '';
    lbOpen = false;
    document.body.style.overflow = '';
  }
  if (lbEl) {
    lbEl.addEventListener('click', closeLb);
    $$('.evd__item, .fam__shot').forEach(function (btn) {
      var im = $('img', btn);
      if (!im) return;
      btn.addEventListener('click', function () {
        var cap = $('.evd__cap', btn);
        openLb(im.getAttribute('src'), cap ? cap.textContent : '', im.alt);
      });
    });
  }

  /* ---------- safety nets: never leave a black screen ---------- */
  window.addEventListener('error', function () {
    bootEl.classList.add('done');
    $('#bar').classList.add('up');
    $('#dock').classList.add('up');
    unlock();
  });
  window.setTimeout(function () {
    if (!unlocked) {
      bootEl.classList.add('done');
      unlock();
    }
  }, 12000);

  /* ---------- go ---------- */
  runBoot();
})();
