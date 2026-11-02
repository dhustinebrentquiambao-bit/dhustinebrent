const memojiHead = document.getElementById('memojiHead');
    const memojiPupilLeft = document.getElementById('memojiPupilLeft');
    const memojiPupilRight = document.getElementById('memojiPupilRight');
    const memojiWrap = document.getElementById('memojiWrap');

    document.addEventListener('mousemove', (e) => {
        const rect = memojiWrap.getBoundingClientRect();
        const headCenterX = rect.left + rect.width * 0.55;
        const headCenterY = rect.top + rect.height * 0.38;

        const dx = e.clientX - headCenterX;
        const dy = e.clientY - headCenterY;

        const maxHeadRot = 14;
        const rotY = Math.max(-maxHeadRot, Math.min(maxHeadRot, dx * 0.015));
        const rotX = Math.max(-maxHeadRot, Math.min(maxHeadRot, -dy * 0.015));
        memojiHead.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

        const eyeRadius = 8;
        const angle = Math.atan2(dy, dx);
        const dist = Math.min(eyeRadius, Math.sqrt(dx*dx + dy*dy) * 0.01);
        const px = Math.cos(angle) * dist;
        const py = Math.sin(angle) * dist;

        memojiPupilLeft.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
        memojiPupilRight.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
    });

    window.addEventListener('scroll', () => {
        const heroHeight = document.querySelector('.hero').offsetHeight;
        if (window.scrollY > heroHeight * 0.5) {
            document.body.classList.add('scrolled-past-hero');
        } else {
            document.body.classList.remove('scrolled-past-hero');
        }
    });

    const taglineText = "Aspiring Cyber Security Analyst";
    const typewriterEl = document.getElementById('typewriter');
    let charIndex = 0;
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'typing-cursor';

    function typeWriter() {
        if (charIndex < taglineText.length) {
            typewriterEl.textContent = taglineText.substring(0, charIndex + 1);
            typewriterEl.appendChild(cursorSpan);
            charIndex++;
            setTimeout(typeWriter, 60 + Math.random() * 40);
        } else {
            typewriterEl.textContent = taglineText;
            typewriterEl.appendChild(cursorSpan);
        }
    }
    setTimeout(typeWriter, 600);

    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let pMouseX = 0, pMouseY = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', (e) => {
        pMouseX = e.clientX;
        pMouseY = e.clientY;
    });

    class SnowParticle {
        constructor() {
            this.reset(true);
        }
        reset(randomY = false) {
            this.x = Math.random() * canvas.width;
            this.y = randomY ? Math.random() * canvas.height : -10;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = Math.random() * 1.8 + 1.0;
            this.speedX = (Math.random() - 0.5) * 0.7;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.05 + 0.02;
            this.glowing = Math.random() > 0.9;
        }
        update() {
            this.y += this.speedY;
            this.wobble += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobble) * 0.5;

            const dx = pMouseX - this.x;
            const dy = pMouseY - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) {
                this.x -= dx * 0.005;
                this.y -= dy * 0.005;
            }

            if (this.y > canvas.height + 10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            if (this.glowing) {
                ctx.fillStyle = `rgba(255, 100, 100, ${this.opacity})`;
                ctx.shadowBlur = 14;
                ctx.shadowColor = `rgba(227, 30, 30, ${this.opacity * 0.6})`;
            } else {
                ctx.fillStyle = `rgba(227, 30, 30, ${this.opacity})`;
                ctx.shadowBlur = 0;
            }
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    const particleCount = Math.min(160, Math.floor((canvas.width * canvas.height) / 6000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new SnowParticle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 90) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(227, 30, 30, ${0.07 * (1 - dist/90)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    function openNav() {
        navLinks.classList.add('open');
        navOverlay.classList.add('open');
        navToggle.innerHTML = '&times;';
        document.body.style.overflow = 'hidden';
    }
    function closeNav() {
        navLinks.classList.remove('open');
        navOverlay.classList.remove('open');
        navToggle.innerHTML = '&#9776;';
        document.body.style.overflow = '';
    }
    navToggle.addEventListener('click', () => {
        navLinks.classList.contains('open') ? closeNav() : openNav();
    });
    navOverlay.addEventListener('click', closeNav);
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    const sections = document.querySelectorAll('section[id]');
    const navLinkEls = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinkEls.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal, .section-label').forEach(el => {
        revealObserver.observe(el);
    });


    // ===== SLIDE PAGE NAVIGATION =====
    const slidePages = document.querySelectorAll('.slide-page');
    const slidePrev = document.getElementById('slidePrev');
    const slideNext = document.getElementById('slideNext');
    const slideCurrent = document.getElementById('slideCurrent');
    const slideTotal = document.getElementById('slideTotal');
    let currentSlideIdx = 0;
    const totalSlides = slidePages.length;

    if (slideTotal) slideTotal.textContent = totalSlides;

    function updateSlides() {
        slidePages.forEach(function(page, i) {
            page.classList.toggle('active', i === currentSlideIdx);
        });
        if (slidePrev) slidePrev.disabled = currentSlideIdx === 0;
        if (slideNext) slideNext.disabled = currentSlideIdx === totalSlides - 1;
        if (slideCurrent) slideCurrent.textContent = currentSlideIdx + 1;

        var activePage = slidePages[currentSlideIdx];
        var activeSection = activePage ? activePage.querySelector('section[id], footer[id]') : null;
        var activeId = activeSection ? activeSection.id : null;
        if (activeId) {
            document.querySelectorAll('.nav-links a').forEach(function(link) {
                link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
            });
        }
        document.body.classList.toggle('scrolled-past-hero', currentSlideIdx > 0);
        if (activePage) activePage.scrollTop = 0;
    }

    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        currentSlideIdx = index;
        updateSlides();
    }

    if (slidePrev) {
        slidePrev.addEventListener('click', function() {
            goToSlide(currentSlideIdx - 1);
        });
    }
    if (slideNext) {
        slideNext.addEventListener('click', function() {
            goToSlide(currentSlideIdx + 1);
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
            e.preventDefault();
            goToSlide(currentSlideIdx + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
            e.preventDefault();
            goToSlide(currentSlideIdx - 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToSlide(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToSlide(totalSlides - 1);
        }
    });

    document.querySelectorAll('.nav-links a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = link.getAttribute('href').replace('#', '');
            var targetIdx = Array.from(slidePages).findIndex(function(page) {
                return page.querySelector('#' + targetId) !== null;
            });
            if (targetIdx !== -1) goToSlide(targetIdx);
            if (typeof closeNav === 'function') closeNav();
        });
    });

    var logoLink = document.querySelector('.nav-logo');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            goToSlide(0);
        });
    }

    updateSlides();