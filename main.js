
(function() {
  // ==================== CUSTOM CURSOR ====================
  const cursorMain = document.getElementById('cursorMain');
  const cursorDot = document.getElementById('cursorDot');
  const trails = [
    document.getElementById('trail1'),
    document.getElementById('trail2'),
    document.getElementById('trail3'),
    document.getElementById('trail4')
  ];
  const crossV = document.getElementById('cursorCrossV');
  const crossH = document.getElementById('cursorCrossH');

  let mouseX = 0, mouseY = 0;
  let mainX = 0, mainY = 0;
  let dotX = 0, dotY = 0;
  const trailPos = trails.map(() => ({ x: 0, y: 0 }));

  // Check for touch device
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouch) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      crossV.style.left = mouseX + 'px';
      crossH.style.top = mouseY + 'px';
    });

    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .nav-item, .nav-arrow, .contact-item, .form-submit');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursorMain.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorMain.classList.remove('hover'));
    });

    function animateCursor() {
      // Main cursor follows with slight delay
      mainX += (mouseX - mainX) * 0.15;
      mainY += (mouseY - mainY) * 0.15;
      cursorMain.style.left = mainX + 'px';
      cursorMain.style.top = mainY + 'px';

      // Dot follows faster
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;
      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top = dotY + 'px';

      // Trails follow with increasing delay
      let prevX = dotX, prevY = dotY;
      trails.forEach((trail, i) => {
        trailPos[i].x += (prevX - trailPos[i].x) * (0.25 - i * 0.04);
        trailPos[i].y += (prevY - trailPos[i].y) * (0.25 - i * 0.04);
        trail.style.left = trailPos[i].x + 'px';
        trail.style.top = trailPos[i].y + 'px';
        prevX = trailPos[i].x;
        prevY = trailPos[i].y;
      });

      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // ==================== PRELOADER ====================
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 3200);

  // Generate binary rain for preloader
  const preloaderBinary = document.getElementById('preloaderBinary');
  if (preloaderBinary) {
    const binaryChars = '01';
    for (let i = 0; i < 40; i++) {
      const col = document.createElement('div');
      col.className = 'binary-col';
      col.style.animationDelay = (Math.random() * 4) + 's';
      col.style.animationDuration = (6 + Math.random() * 4) + 's';
      let text = '';
      for (let j = 0; j < 30; j++) {
        text += binaryChars[Math.floor(Math.random() * 2)] + ' ';
      }
      col.textContent = text;
      preloaderBinary.appendChild(col);
    }
  }

  // ==================== SLIDE MANAGEMENT ====================
  const slides = document.querySelectorAll('.slide');
  const navItems = document.querySelectorAll('.nav-item');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slideCounter = document.getElementById('slideCounter');
  let current = 0;
  const total = slides.length;

  function updateSlide(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
    });

    navItems.forEach((item, i) => {
      item.classList.toggle('active', i === current);
    });

    slideCounter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
  }

  prevBtn.addEventListener('click', () => updateSlide(current - 1));
  nextBtn.addEventListener('click', () => updateSlide(current + 1));

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-slide'), 10);
      updateSlide(idx);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      updateSlide(current + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      updateSlide(current - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      updateSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      updateSlide(total - 1);
    } else if (e.key === 'f' || e.key === 'F') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  });

  // ==================== HOME SUNBURST ====================
  const homeRayContainer = document.getElementById('home-sunburst-rays');
  if (homeRayContainer) {
    for (let i = 0; i < 72; i++) {
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#home-ray');
      use.setAttribute('transform', `rotate(${i * 5}, 300, 300)`);
      homeRayContainer.appendChild(use);
    }
  }

  // ==================== PARTICLES ====================
  const particleContainer = document.getElementById('particles');
  if (particleContainer) {
    for (let i = 0; i < 50; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 20 + 's';
      p.style.animationDuration = (15 + Math.random() * 15) + 's';
      particleContainer.appendChild(p);
    }
  }

  // ==================== DATA STREAMS ====================
  const dataStreamsContainer = document.getElementById('dataStreams');
  if (dataStreamsContainer) {
    for (let i = 0; i < 8; i++) {
      const stream = document.createElement('div');
      stream.className = 'data-stream';
      stream.style.left = (10 + Math.random() * 80) + '%';
      stream.style.height = (80 + Math.random() * 150) + 'px';
      stream.style.animationDelay = (Math.random() * 10) + 's';
      stream.style.animationDuration = (10 + Math.random() * 8) + 's';
      dataStreamsContainer.appendChild(stream);
    }
  }

  // ==================== HOME CIRCUIT NODES ====================
  const homeCircuitNodes = document.getElementById('homeCircuitNodes');
  if (homeCircuitNodes) {
    const nodePositions = [
      {t: 15, l: 8}, {t: 25, l: 5}, {t: 40, l: 10}, {t: 60, l: 6},
      {t: 75, l: 12}, {t: 85, l: 8}, {t: 20, l: 88}, {t: 35, l: 92},
      {t: 50, l: 90}, {t: 65, l: 93}, {t: 80, l: 88}, {t: 45, l: 3}
    ];
    nodePositions.forEach((pos, i) => {
      const node = document.createElement('div');
      node.className = 'hc-node';
      node.style.top = pos.t + '%';
      node.style.left = pos.l + '%';
      node.style.animationDelay = (i * 0.3) + 's';
      homeCircuitNodes.appendChild(node);
    });
  }

  // ==================== ENHANCED PARTICLE SYSTEM ====================
  const enhancedParticles = document.getElementById('particles');
  if (enhancedParticles) {
    // Add some larger, slower particles
    for (let i = 0; i < 5; i++) {
      const p = document.createElement('div');
      p.style.position = 'absolute';
      p.style.width = (3 + Math.random() * 4) + 'px';
      p.style.height = p.style.width;
      p.style.background = 'var(--gold)';
      p.style.borderRadius = '50%';
      p.style.opacity = '0';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.filter = 'blur(1px)';
      p.style.animation = `float-particle ${25 + Math.random() * 20}s infinite ease-in-out`;
      p.style.animationDelay = Math.random() * 15 + 's';
      enhancedParticles.appendChild(p);
    }
  }

  // ==================== FAST SLIDE TRANSITION ====================
  const slideTransition = document.getElementById('slideTransition');
  const shutterLeft = document.getElementById('shutterLeft');
  const shutterRight = document.getElementById('shutterRight');
  let isTransitioning = false;

  function updateSlide(index) {
    if (isTransitioning) return;
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    if (index === current) return;

    isTransitioning = true;

    // Quick shutter close (150ms)
    if (shutterLeft && shutterRight) {
      shutterLeft.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
      shutterRight.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
      shutterLeft.style.transform = 'translateX(0)';
      shutterRight.style.transform = 'translateX(0)';
    }

    // Also quick fade overlay (150ms)
    if (slideTransition) {
      slideTransition.style.transition = 'opacity 0.15s ease';
      slideTransition.classList.add('active');
    }

    setTimeout(() => {
      performSlideUpdate(index);

      // Quick shutter open (200ms)
      if (shutterLeft && shutterRight) {
        shutterLeft.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        shutterRight.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        shutterLeft.style.transform = 'translateX(-100%)';
        shutterRight.style.transform = 'translateX(100%)';
      }

      if (slideTransition) {
        slideTransition.classList.remove('active');
      }

      setTimeout(() => { isTransitioning = false; }, 200);
    }, 180);
  }

  function performSlideUpdate(index) {
    current = index;
    slides.forEach((slide, i) => { slide.classList.toggle('active', i === current); });
    navItems.forEach((item, i) => { item.classList.toggle('active', i === current); });
    slideCounter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    triggerTextAnimations();
    if (typeof updateCursorProgress === 'function') updateCursorProgress();
  }

  // Initialize shutters off-screen immediately
  if (shutterLeft && shutterRight) {
    shutterLeft.style.transform = 'translateX(-100%)';
    shutterRight.style.transform = 'translateX(100%)';
  }
  if (slideTransition) {
    slideTransition.style.opacity = '0';
  }

  // ==================== TEXT REVEAL ANIMATIONS ====================
  function triggerTextAnimations() {
    const activeSlide = document.querySelector('.slide.active');
    if (!activeSlide) return;

    const titles = activeSlide.querySelectorAll('.section-title, .display, .home-name-line2');
    titles.forEach((el, i) => {
      el.style.animation = 'none';
      el.offsetHeight; // trigger reflow
      el.style.animation = `slide-enter 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${0.1 + i * 0.05}s both`;
    });
  }

  // ==================== MAGNETIC EFFECT FOR NAV ITEMS ====================
  navItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translate(0, 0)';
    });
  });

  // ==================== PARALLAX ON MOUSE MOVE (LIGHTWEIGHT) ====================
  let mouseXParallax = 0, mouseYParallax = 0;
  let parallaxFrame = 0;
  document.addEventListener('mousemove', (e) => {
    mouseXParallax = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseYParallax = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function updateParallax() {
    parallaxFrame++;
    // Only update every 2nd frame (30fps instead of 60fps)
    if (parallaxFrame % 2 === 0) {
      const sunburst = document.querySelector('.home-sunburst');
      if (sunburst) {
        sunburst.style.transform = `translate(-50%, -50%) translate(${mouseXParallax * -8}px, ${mouseYParallax * -8}px)`;
      }
      const geoGrid = document.querySelector('.geo-grid');
      if (geoGrid) {
        geoGrid.style.transform = `translate(${mouseXParallax * -3}px, ${mouseYParallax * -3}px)`;
      }
      const particles = document.querySelector('.particles');
      if (particles) {
        particles.style.transform = `translate(${mouseXParallax * -4}px, ${mouseYParallax * -4}px)`;
      }
    }
    requestAnimationFrame(updateParallax);
  }
  updateParallax();

  // ==================== RIPPLE EFFECT ====================
  document.querySelectorAll('button, .contact-item, .info-card, .ornate-frame-wrapper').forEach(el => {
    el.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 800);
    });
  });

  // ==================== TEXT SCRAMBLE EFFECT ====================
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}--=+*^?#________';
      this.update = this.update.bind(this);
    }
    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => this.resolve = resolve);
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 20);
        const end = start + Math.floor(Math.random() * 20);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }
    update() {
      let output = '';
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span style="color:var(--gold-mid)">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  // Apply scramble to home name on load
  const homeNameEl = document.querySelector('.home-name');
  if (homeNameEl) {
    const fx = new TextScramble(homeNameEl);
    setTimeout(() => {
      fx.setText('Dhustine Brent');
    }, 3500);
  }

  // ==================== 3D TILT EFFECT ====================
  document.querySelectorAll('.tilt-3d').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });

  // ==================== TYPEWRITER EFFECT ====================
  const typewriterEl = document.getElementById('typewriterText');
  if (typewriterEl) {
    const text = typewriterEl.textContent;
    typewriterEl.textContent = '';
    typewriterEl.style.borderRight = '2px solid var(--gold)';
    typewriterEl.style.paddingRight = '4px';
    let i = 0;
    setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          typewriterEl.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            typewriterEl.style.borderRight = 'none';
            typewriterEl.style.paddingRight = '0';
          }, 2000);
        }
      }, 60);
    }, 4000);
  }


  // ==================== DECRYPT TEXT ANIMATIONS ON SLIDE CHANGE ====================
  const origTriggerTextAnimations = triggerTextAnimations;
  triggerTextAnimations = function() {
    origTriggerTextAnimations();
    const activeSlide = document.querySelector('.slide.active');
    if (!activeSlide) return;
    const decryptEls = activeSlide.querySelectorAll('.decrypt-text');
    decryptEls.forEach(el => {
      const text = el.textContent;
      el.innerHTML = '';
      text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.animationDelay = (0.08 + i * 0.01) + 's';
        el.appendChild(span);
      });
    });
  };

  // ==================== CONTACT FORM ====================
  window.handleFormSubmit = function(e) {
    e.preventDefault();
    const form = e.target;
    const status = document.getElementById('formStatus');
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      status.textContent = 'Please fill in all fields.';
      status.className = 'form-status error show';
      return false;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.className = 'form-status error show';
      return false;
    }

    // Simulate sending (in a real implementation, this would connect to a backend)
    status.textContent = 'Sending your message...';
    status.className = 'form-status success show';

    // Animate button
    const submitBtn = form.querySelector('.form-submit');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Transmitting...</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="60" style="animation:spin 1s linear infinite"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></circle></svg>';
    submitBtn.disabled = true;

    setTimeout(() => {
      status.innerHTML = 'Transmission complete. Thank you, <strong>' + escapeHtml(name) + '</strong>. Your message has been received and will be processed.';
      status.className = 'form-status success show';
      submitBtn.innerHTML = '<span>Sent</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
      form.reset();
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }, 2000);
    }, 1800);

    return false;
  };

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
})();

  // ==================== WAVE TEXT ANIMATION ====================
  document.querySelectorAll('.wave-text').forEach(el => {
    const text = el.textContent;
    el.innerHTML = '';
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? ' ' : char;
      span.style.animationDelay = (i * 0.05) + 's';
      el.appendChild(span);
    });
  });

  // ==================== MAGNETIC BUTTONS ====================
  document.querySelectorAll('.magnetic-btn, .nav-arrow, .form-submit').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  // ==================== BINARY DROP SPAWNER ====================
  function spawnBinaryDrop() {
    const slides = document.querySelectorAll('.slide.active');
    if (slides.length === 0) return;
    const slide = slides[0];
    const drop = document.createElement('div');
    drop.className = 'binary-drop';
    drop.textContent = Math.random() > 0.5 ? '1' : '0';
    drop.style.left = (5 + Math.random() * 90) + '%';
    drop.style.top = (10 + Math.random() * 80) + '%';
    drop.style.animationDuration = (3 + Math.random() * 4) + 's';
    drop.style.fontSize = (8 + Math.random() * 6) + 'px';
    slide.appendChild(drop);
    setTimeout(() => drop.remove(), 7000);
  }
  setInterval(spawnBinaryDrop, 2000);

  // ==================== FLOATING ORB SPAWNER ====================
  function spawnFloatOrb() {
    const slides = document.querySelectorAll('.slide.active');
    if (slides.length === 0) return;
    const slide = slides[0];
    const orb = document.createElement('div');
    orb.className = 'float-orb';
    const size = 100 + Math.random() * 200;
    orb.style.width = size + 'px';
    orb.style.height = size + 'px';
    orb.style.background = `radial-gradient(circle, rgba(212,175,55,${0.01 + Math.random() * 0.02}), transparent 70%)`;
    orb.style.left = Math.random() * 100 + '%';
    orb.style.top = Math.random() * 100 + '%';
    orb.style.animationDuration = (10 + Math.random() * 10) + 's';
    slide.appendChild(orb);
    setTimeout(() => orb.remove(), 20000);
  }
  setInterval(spawnFloatOrb, 8000);

  // ==================== SPARKLE SPAWNER ====================
  function spawnSparkle() {
    const slides = document.querySelectorAll('.slide.active');
    if (slides.length === 0) return;
    const slide = slides[0];
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = (5 + Math.random() * 90) + '%';
    sparkle.style.top = (5 + Math.random() * 90) + '%';
    sparkle.style.animationDelay = '0s';
    sparkle.style.animationDuration = (2 + Math.random() * 3) + 's';
    slide.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 5000);
  }
  setInterval(spawnSparkle, 1500);

  // ==================== CIRCUIT NODE SPAWNER ====================
  function spawnCircuitNode() {
    const slides = document.querySelectorAll('.slide.active');
    if (slides.length === 0) return;
    const slide = slides[0];
    const node = document.createElement('div');
    node.className = 'circuit-node';
    node.style.left = (10 + Math.random() * 80) + '%';
    node.style.top = (10 + Math.random() * 80) + '%';
    node.style.animationDelay = Math.random() + 's';
    slide.appendChild(node);
    setTimeout(() => node.remove(), 10000);
  }
  setInterval(spawnCircuitNode, 4000);

  // ==================== COUNTER ANIMATION FOR SLIDE NUMBER ====================
  function animateCounter() {
    const counter = document.getElementById('slideCounter');
    if (!counter) return;
    const target = String(current + 1).padStart(2, '0');
    counter.style.opacity = '0';
    counter.style.transform = 'translateY(5px)';
    setTimeout(() => {
      counter.textContent = target + ' / ' + String(total).padStart(2, '0');
      counter.style.transition = 'all 0.3s ease';
      counter.style.opacity = '1';
      counter.style.transform = 'translateY(0)';
    }, 150);
  }

  // ==================== ENHANCED SLIDE CHANGE EFFECTS ====================
  const origPerformSlideUpdate2 = performSlideUpdate;
  performSlideUpdate = function(index) {
    origPerformSlideUpdate2(index);
    animateCounter();
    // Trigger wave text re-animation
    document.querySelectorAll('.slide.active .wave-text span').forEach((span, i) => {
      span.style.animation = 'none';
      span.offsetHeight;
      span.style.animation = '';
      span.style.animationDelay = (i * 0.05) + 's';
    });
    // Trigger glow text pulse
    document.querySelectorAll('.slide.active .glow-text').forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = '';
    });
  };

  // ==================== FORM INPUT FOCUS EFFECTS ====================
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.style.transform = 'scale(1.01)';
      input.parentElement.style.transition = 'transform 0.3s ease';
    });
    input.addEventListener('blur', () => {
      input.parentElement.style.transform = 'scale(1)';
    });
  });

  // ==================== NAV ITEM SOUND WAVE ON HOVER ====================
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const dot = item.querySelector('.nav-item-dot');
      if (dot) {
        dot.style.transform = 'rotate(45deg) scale(1.3)';
        setTimeout(() => {
          dot.style.transform = '';
        }, 300);
      }
    });
  });

  // ==================== RANDOM GLITCH TRIGGER ====================
  function randomGlitch() {
    const glitches = document.querySelectorAll('.glitch-text, .glitch-hover');
    if (glitches.length === 0) return;
    const el = glitches[Math.floor(Math.random() * glitches.length)];
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = '';
  }
  setInterval(randomGlitch, 8000);

  // ==================== PRELOADER ENHANCED EXIT ====================
  const preloader2 = document.getElementById('preloader');
  if (preloader2) {
    preloader2.addEventListener('transitionend', () => {
      // Trigger initial animations after preloader
      triggerTextAnimations();
    });
  }

  // ==================== MOUSE TRAIL ENHANCEMENT ====================
  let trailPositions = [];
  document.addEventListener('mousemove', (e) => {
    trailPositions.push({ x: e.clientX, y: e.clientY, time: Date.now() });
    if (trailPositions.length > 10) trailPositions.shift();
  });





/* ========== ROTATING CS ROLES TYPEWRITER ========== */
(function() {
  const roles = [
    "Aspiring Computer Scientist",
    "Aspiring Cyber Security Analyst", 
    "Aspiring Software Engineer",
    "Aspiring Software Developer"
  ];
  const el = document.getElementById('typewriterText');
  if (!el) return;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      el.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      el.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typeSpeed = 2000; // pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 500; // pause before next
    }

    setTimeout(type, typeSpeed);
  }

  type();
})();




/* ========== EMAIL ANTI-OBFUSCATION INJECTION ========== */
(function() {
  var user = "dhustinequiambao";
  var domain = "gmail.com";
  var email = user + "@" + domain;
  var el = document.getElementById('info-email');
  if (el) {
    el.textContent = email;
    // Also make it clickable
    var wrapper = document.createElement('a');
    wrapper.href = "mailto:" + email;
    wrapper.className = "info-detail info-email";
    wrapper.textContent = email;
    el.parentNode.replaceChild(wrapper, el);
  }
})();




/* ========== ACHIEVEMENT CAROUSEL ========== */
(function() {
  document.querySelectorAll('.achieve-carousel').forEach(function(carousel) {
    var slides = carousel.querySelectorAll('.achieve-slide');
    var dots = carousel.querySelectorAll('.achieve-dot');
    var prevBtn = carousel.querySelector('.achieve-prev');
    var nextBtn = carousel.querySelector('.achieve-next');
    var current = 0;
    var total = slides.length;

    function showSlide(index) {
      slides.forEach(function(s, i) {
        s.classList.toggle('active', i === index);
      });
      dots.forEach(function(d, i) {
        d.classList.toggle('active', i === index);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        current = (current - 1 + total) % total;
        showSlide(current);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        current = (current + 1) % total;
        showSlide(current);
      });
    }
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        current = i;
        showSlide(current);
      });
    });
  });
})();

/* ========== ELEMENTARY PHOTO CAROUSEL ========== */
(function() {
  var photoBox = document.querySelector('.elem-photo-box');
  if (!photoBox) return;
  var photos = photoBox.querySelectorAll('.elem-img');
  var prevBtn = photoBox.querySelector('.elem-btn-left');
  var nextBtn = photoBox.querySelector('.elem-btn-right');
  var counter = photoBox.querySelector('.elem-counter');
  var current = 0;
  var total = photos.length;
  if (total <= 1) return;

  function showPhoto(index) {
    photos.forEach(function(p, i) { 
      if (i === index) {
        p.classList.add('elem-active');
      } else {
        p.classList.remove('elem-active');
      }
    });
    if (counter) counter.textContent = (index + 1) + ' / ' + total;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function(e) { 
      e.preventDefault();
      e.stopPropagation();
      current = (current - 1 + total) % total; 
      showPhoto(current); 
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function(e) { 
      e.preventDefault();
      e.stopPropagation();
      current = (current + 1) % total; 
      showPhoto(current); 
    });
  }

  // Click on photo to open lightbox modal
  var modal = document.getElementById('elemModal');
  var modalImg = document.getElementById('elemModalImg');
  var modalClose = document.querySelector('.elem-modal-close');

  photos.forEach(function(photo) {
    photo.style.cursor = 'pointer';
    photo.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (modal && modalImg) {
        modalImg.src = photo.src;
        modal.classList.add('active');
      }
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      modal.classList.remove('active');
    });
  }

  // Close modal when clicking outside the content
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
      }
      var jhsM = document.getElementById('jhsModal');
      var shsM = document.getElementById('shsModal');
      if (jhsM && jhsM.classList.contains('active')) jhsM.classList.remove('active');
      if (shsM && shsM.classList.contains('active')) shsM.classList.remove('active');
    }
  });
})();

/* ========== JHS/SHS PHOTO LIGHTBOX ========== */
(function() {
  // JHS modal
  var jhsModal = document.getElementById('jhsModal');
  var jhsModalImg = document.getElementById('jhsModalImg');
  var jhsPhotos = document.querySelectorAll('.small-card');

  jhsPhotos.forEach(function(card) {
    var img = card.querySelector('.small-frame img');
    var school = card.querySelector('.small-school');
    if (img && school && school.textContent.indexOf('Rose') !== -1) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (jhsModal && jhsModalImg) {
          jhsModalImg.src = img.src;
          jhsModal.classList.add('active');
        }
      });
    }
    if (img && school && school.textContent.indexOf('Vincent') !== -1) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var shsModal = document.getElementById('shsModal');
        var shsModalImg = document.getElementById('shsModalImg');
        if (shsModal && shsModalImg) {
          shsModalImg.src = img.src;
          shsModal.classList.add('active');
        }
      });
    }
  });

  // Close buttons for all modals
  document.querySelectorAll('.achieve-modal-close').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var modal = btn.closest('.achieve-modal');
      if (modal) modal.classList.remove('active');
    });
  });

  // Click outside to close
  document.querySelectorAll('.achieve-modal').forEach(function(modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
})();
