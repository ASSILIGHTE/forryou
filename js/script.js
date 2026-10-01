/* ==========================================================================
   "Boyfriend Day Grand Prix 🏁" — Formula 1 Racing Edition Logic
   F1 Synthesizer (Engine Rev, Radio), Lenis Scroll & Particle Telemetry
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Audio Synthesizer (Web Audio API) & F1 Engine Sound FX
  // ------------------------------------------------------------------------
  class SoundFXEngine {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playEngineRev() {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      
      // Pitch slide simulating V10/V8 F1 Engine revving up & down!
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.6);
      
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.65);
    }

    playEnvelopeOpen() {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(680, this.ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    }

    playCardFlip() {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    }

    playSparkleChime() {
      this.init();
      if (!this.ctx) return;
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.35);
      });
    }
  }

  const soundFX = new SoundFXEngine();

  // Background Music Setup
  const bgMusic = new Audio('public/music.mp3');
  bgMusic.loop = true;
  bgMusic.volume = 0.4;
  let isMusicPlaying = false;

  const audioToggleBtn = document.getElementById('audio-toggle');
  const btnPlaySong = document.getElementById('btn-play-song');

  const toggleMusic = (forceState) => {
    soundFX.init();
    if (forceState !== undefined) {
      isMusicPlaying = forceState;
    } else {
      isMusicPlaying = !isMusicPlaying;
    }

    if (isMusicPlaying) {
      bgMusic.play().then(() => {
        if (audioToggleBtn) audioToggleBtn.classList.add('playing');
        if (btnPlaySong) btnPlaySong.querySelector('span').textContent = 'MEMUTAR LAGU • OUR SONG 🎶';
      }).catch(err => {
        console.log('Autoplay prevented by browser:', err);
        isMusicPlaying = false;
        if (audioToggleBtn) audioToggleBtn.classList.remove('playing');
        if (btnPlaySong) btnPlaySong.querySelector('span').textContent = 'PUTAR LAGU • OUR SONG 📻';
      });
    } else {
      bgMusic.pause();
      if (audioToggleBtn) audioToggleBtn.classList.remove('playing');
      if (btnPlaySong) btnPlaySong.querySelector('span').textContent = 'PUTAR LAGU • OUR SONG 📻';
    }
  };

  if (audioToggleBtn) audioToggleBtn.addEventListener('click', () => toggleMusic());
  if (btnPlaySong) btnPlaySong.addEventListener('click', () => toggleMusic());

  // ------------------------------------------------------------------------
  // 2. Smooth Scroll Setup (Lenis) & GSAP ScrollTrigger Integration
  // ------------------------------------------------------------------------
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Floating Nav Capsule Active Section Highlight
  const navItems = document.querySelectorAll('.f1-floating-nav .nav-item');
  const navContainer = document.querySelector('.f1-floating-nav');
  const sections = document.querySelectorAll('.section');

  sections.forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) {
          navItems.forEach((item) => {
            if (item.getAttribute('href') === `#${sec.id}`) {
              item.classList.add('active');
              if (navContainer && window.innerWidth <= 768) {
                item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
              }
            } else {
              item.classList.remove('active');
            }
          });
        }
      },
    });
  });

  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href');
      soundFX.playSparkleChime();
      lenis.scrollTo(targetId, { duration: 1.2 });
    });
  });

  // ------------------------------------------------------------------------
  // 3. Canvas Particle Engine & Mouse Trail
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const trailParticles = [];
  const f1Colors = ['#E10600', '#FF1E1E', '#FFB800', '#FFFFFF', '#8D99AE', '#141720'];

  class FloatingParticle {
    constructor(x, y, isHeart = true) {
      this.reset(x, y, isHeart);
    }

    reset(x, y, isHeart = true) {
      this.x = x || Math.random() * width;
      this.y = y || height + 20;
      this.size = isHeart ? Math.random() * 10 + 6 : Math.random() * 4 + 2;
      this.speedY = Math.random() * 0.9 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.color = f1Colors[Math.floor(Math.random() * f1Colors.length)];
      this.isHeart = isHeart;
      this.oscillationSpeed = Math.random() * 0.02 + 0.01;
      this.angle = Math.random() * Math.PI * 2;
    }

    update() {
      this.y -= this.speedY;
      this.angle += this.oscillationSpeed;
      this.x += Math.sin(this.angle) * 0.4 + this.speedX;

      if (this.y < -30) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;

      if (this.isHeart) {
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(this.x, this.y + topCurveHeight);
        ctx.bezierCurveTo(this.x, this.y, this.x - this.size / 2, this.y, this.x - this.size / 2, this.y + topCurveHeight);
        ctx.bezierCurveTo(this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x, this.y + this.size, this.x, this.y + this.size);
        ctx.bezierCurveTo(this.x, this.y + this.size, this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x + this.size / 2, this.y + topCurveHeight);
        ctx.bezierCurveTo(this.x + this.size / 2, this.y, this.x, this.y, this.x, this.y + topCurveHeight);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  class TrailParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 6 + 4;
      this.speedX = (Math.random() - 0.5) * 1.2;
      this.speedY = -Math.random() * 1.5 - 0.5;
      this.alpha = 0.85;
      this.color = f1Colors[Math.floor(Math.random() * f1Colors.length)];
      this.isHeart = Math.random() > 0.4;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= 0.025;
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      if (this.isHeart) {
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(this.x, this.y + topCurveHeight);
        ctx.bezierCurveTo(this.x, this.y, this.x - this.size / 2, this.y, this.x - this.size / 2, this.y + topCurveHeight);
        ctx.bezierCurveTo(this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x, this.y + this.size, this.x, this.y + this.size);
        ctx.bezierCurveTo(this.x, this.y + this.size, this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x + this.size / 2, this.y + topCurveHeight);
        ctx.bezierCurveTo(this.x + this.size / 2, this.y, this.x, this.y, this.x, this.y + topCurveHeight);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < 75; i++) {
    particles.push(new FloatingParticle(Math.random() * width, Math.random() * height, i % 3 !== 0));
  }

  let lastTrailTime = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime > 40) {
      trailParticles.push(new TrailParticle(e.clientX, e.clientY));
      if (trailParticles.length > 30) trailParticles.shift();
      lastTrailTime = now;
    }
  });

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    for (let i = trailParticles.length - 1; i >= 0; i--) {
      const tp = trailParticles[i];
      tp.update();
      tp.draw();
      if (tp.alpha <= 0) trailParticles.splice(i, 1);
    }

    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  function spawnHeartBurst(x, y, count = 25) {
    if (window.confetti) {
      window.confetti({
        particleCount: count,
        spread: 75,
        origin: { x: x / window.innerWidth, y: y / window.innerHeight },
        colors: ['#E10600', '#FF1E1E', '#FFB800', '#FFFFFF', '#8D99AE'],
        shapes: ['circle']
      });
    }
  }

  window.addEventListener('click', (e) => {
    if (!e.target.closest('.btn-f1-red, .btn-f1-outline, .polaroid-card-f1, .reason-card, .envelope-wrapper, .gift-box-wrapper, .f1-action-btn')) {
      spawnHeartBurst(e.clientX, e.clientY, 10);
    }
  });

  // ------------------------------------------------------------------------
  // 4. Section 1 — The Envelope Interaction
  // ------------------------------------------------------------------------
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const btnOpenLetter = document.getElementById('btn-open-letter');
  let isEnvelopeOpened = false;

  const triggerEnvelopeOpen = (e) => {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    soundFX.playEngineRev();
    soundFX.playEnvelopeOpen();
    soundFX.playSparkleChime();
    toggleMusic(true);

    const waxSealEl = document.getElementById('wax-seal');
    const envelopeFlapEl = document.getElementById('envelope-flap-top');
    const envelopeLetterEl = document.getElementById('envelope-letter');

    const sealRect = waxSealEl.getBoundingClientRect();

    const isMobile = window.innerWidth <= 480;
    const letterPopY = isMobile ? -95 : -130;
    const letterScale = isMobile ? 1.05 : 1.15;

    const tl = gsap.timeline();

    tl.to(waxSealEl, {
      scale: 1.35,
      rotation: 12,
      duration: 0.25,
      onComplete: () => {
        spawnHeartBurst(sealRect.left + sealRect.width / 2, sealRect.top + sealRect.height / 2, 40);
      }
    })
    .to(waxSealEl, { scale: 0, opacity: 0, duration: 0.3 })
    .to(envelopeFlapEl, {
      rotateX: 180,
      duration: 0.7,
      onUpdate: function() {
        if (this.progress() > 0.5) envelopeFlapEl.classList.add('behind');
      }
    })
    .to(envelopeLetterEl, { y: letterPopY, duration: 0.6, ease: 'back.out(1.3)' })
    .set(envelopeLetterEl, { zIndex: 20 })
    .to(envelopeLetterEl, { y: -15, scale: letterScale, duration: 0.5 })
    .add(() => {
      soundFX.playSparkleChime();
      lenis.scrollTo('#section-2', { duration: 1.5 });
    }, '+=0.2');
  };

  if (envelopeWrapper) envelopeWrapper.addEventListener('click', triggerEnvelopeOpen);
  if (btnOpenLetter) btnOpenLetter.addEventListener('click', triggerEnvelopeOpen);

  // ------------------------------------------------------------------------
  // 5. Section 2 — Typewriter Driver Briefing
  // ------------------------------------------------------------------------
  const typewriterText = "Happy Boyfriend Day ya sayang! I just want to tell you betapa bersyukurnya aku punya kamu di dalam hidupku. Walaupun kita lagi LDR dan terpisah jarak, senyuman manis kamu di setiap foto selalu sukses bikin hariku terasa hangat dan bahagia. Makasih ya udah selalu sabar, rajin pap, and making me feel so loved every single day 💖✨";
  const typewriterElement = document.getElementById('typewriter-text');
  let hasTyped = false;

  ScrollTrigger.create({
    trigger: '#section-2',
    start: 'top 65%',
    onEnter: () => {
      if (hasTyped) return;
      hasTyped = true;
      let charIdx = 0;
      typewriterElement.textContent = '';

      const typeInterval = setInterval(() => {
        if (charIdx < typewriterText.length) {
          typewriterElement.textContent += typewriterText.charAt(charIdx);
          charIdx++;
          if (charIdx % 4 === 0) soundFX.playCardFlip();
        } else {
          clearInterval(typeInterval);
          soundFX.playSparkleChime();
          const rect = typewriterElement.getBoundingClientRect();
          spawnHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
        }
      }, 40);
    },
  });

  // F1 Driver Qualifying Quiz Logic
  const quizOptBtns = document.querySelectorAll('.quiz-opt-btn');
  const quizFeedback = document.getElementById('quiz-feedback');
  const quizQ1 = document.getElementById('quiz-q1');
  const quizQ2 = document.getElementById('quiz-q2');
  const quizQ3 = document.getElementById('quiz-q3');
  const quizStepTag = document.getElementById('quiz-step-tag');

  let currentQuizStep = 1;

  const wrongFeedbackMsgs = [
    "Nggak salah sih, tapi yang paling bikin aku meleleh dan senyum-senyum itu senyuman manis kamu! Coba pilih lagi 💖",
    "Itu enak sih, tapi obat capek paling manjur buatku tetap pelukan hangat dan suara lembut kamu 🥺🫂❤️",
    "Jawaban kurang romantis nih! Coba pilih jawaban yang paling mewakili perasaan sayangku 😉❤️"
  ];

  quizOptBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.getAttribute('data-correct') === 'true';
      const rect = btn.getBoundingClientRect();

      if (isCorrect) {
        soundFX.playSparkleChime();
        soundFX.playEngineRev();
        btn.classList.add('correct');
        spawnHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);

        const parentGrid = btn.closest('.quiz-options-grid');
        if (parentGrid) {
          parentGrid.querySelectorAll('.quiz-opt-btn').forEach(b => b.style.pointerEvents = 'none');
        }

        if (currentQuizStep === 1) {
          quizFeedback.style.display = 'block';
          quizFeedback.className = 'quiz-feedback-f1 success';
          quizFeedback.textContent = '🎉 BENAR BANGET! Senyuman kamu itu selalu jadi alasan terbesarku buat bahagia setiap hari! 💕';

          setTimeout(() => {
            currentQuizStep = 2;
            if (quizStepTag) quizStepTag.textContent = 'Q2 / 3';
            if (quizQ1) quizQ1.style.display = 'none';
            if (quizQ2) quizQ2.style.display = 'block';
            quizFeedback.style.display = 'none';
          }, 1600);
        } else if (currentQuizStep === 2) {
          quizFeedback.style.display = 'block';
          quizFeedback.className = 'quiz-feedback-f1 success';
          quizFeedback.textContent = '🎉 100% BENAR! Pelukan dan suara kamu selalu jadi tempat rumah paling nyaman buatku pulang! 🫂❤️';

          setTimeout(() => {
            currentQuizStep = 3;
            if (quizStepTag) quizStepTag.textContent = 'Q3 / 3';
            if (quizQ2) quizQ2.style.display = 'none';
            if (quizQ3) quizQ3.style.display = 'block';
            quizFeedback.style.display = 'none';
          }, 1600);
        } else {
          quizFeedback.style.display = 'block';
          quizFeedback.className = 'quiz-feedback-f1 success';
          quizFeedback.textContent = '💖 TERIMA KASIH YA SAYANG! Kamu adalah takdir terbaik dan orang paling berharga di hidupku! 👑✨';
          
          if (quizStepTag) quizStepTag.textContent = 'PASSED 💖';
          if (typeof confetti === 'function') {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        }
      } else {
        soundFX.playCardFlip();
        btn.classList.add('wrong');
        quizFeedback.style.display = 'block';
        quizFeedback.className = 'quiz-feedback-f1 error';
        quizFeedback.textContent = wrongFeedbackMsgs[currentQuizStep - 1] || 'Coba pilih jawaban paling romantis ya sayang 😉';

        setTimeout(() => {
          btn.classList.remove('wrong');
        }, 1400);
      }
    });
  });

  // ------------------------------------------------------------------------
  // 6. Section 3 — Polaroid Lightbox
  // ------------------------------------------------------------------------
  const polaroids = document.querySelectorAll('.polaroid-card-f1');
  const modalOverlay = document.getElementById('polaroid-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalSubtext = document.getElementById('modal-subtext');
  const modalClose = document.getElementById('modal-close');

  const polaroidData = [
    { caption: "First Smile 🥺", subtext: "Setiap liat foto senyuman kamu dari layar HP, hariku langsung terasa cerah & bahagia!" },
    { caption: "Cutest Boy 👑", subtext: "Foto ketampanan kamu yang selalu sukses bikin aku senyum-senyum sendiri seharian." },
    { caption: "My Favorite View 🏡", subtext: "Pemandangan favorit yang nggak pernah bikin bosen, walau cuma bisa liat dari jauh." },
    { caption: "Sweetest Smile ✨", subtext: "Alasan utama kenapa aku selalu senyum sendiri setiap kali ngeliat foto kamu." },
    { caption: "Pure Happiness 🥰", subtext: "Nggak ada yang bisa nandingin rasa nyaman & bahagianya aku pas vcall sama kamu." },
    { caption: "My Favorite Boy 💖", subtext: "Kamu bakal selalu jadi pacar favorit nomor 1 di seluruh dunia selamanya!" }
  ];

  polaroids.forEach((card, idx) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 85%' },
      opacity: 0,
      y: 50,
      scale: 0.85,
      duration: 0.7,
      delay: (idx % 3) * 0.15,
    });

    card.addEventListener('click', (e) => {
      soundFX.playEngineRev();
      const img = card.querySelector('img');
      const data = polaroidData[idx] || { caption: "Special Moment", subtext: "Forever in my heart." };

      modalImg.src = img.src;
      modalCaption.textContent = data.caption;
      modalSubtext.textContent = data.subtext;
      modalOverlay.classList.add('active');

      spawnHeartBurst(e.clientX, e.clientY, 25);
    });
  });

  if (modalClose) modalClose.addEventListener('click', () => modalOverlay.classList.remove('active'));
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  // ------------------------------------------------------------------------
  // 7. Section 4 — Telemetry Flip Cards
  // ------------------------------------------------------------------------
  const reasonCards = document.querySelectorAll('.reason-card');

  reasonCards.forEach((card, idx) => {
    gsap.from(card, {
      scrollTrigger: { trigger: '#section-4', start: 'top 70%' },
      opacity: 0,
      y: 40,
      duration: 0.6,
      delay: idx * 0.1,
    });

    card.addEventListener('click', (e) => {
      soundFX.playCardFlip();
      card.classList.toggle('flipped');

      if (card.classList.contains('flipped')) {
        const rect = card.getBoundingClientRect();
        spawnHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 15);
      }
    });
  });

  // ------------------------------------------------------------------------
  // 8. Section 5 — Team Radio Paragraph Fades
  // ------------------------------------------------------------------------
  const letterParagraphs = document.querySelectorAll('.letter-paragraph');

  letterParagraphs.forEach((p, idx) => {
    ScrollTrigger.create({
      trigger: p,
      start: 'top 80%',
      onEnter: () => {
        p.classList.add('visible');
        if (idx % 2 === 0) soundFX.playSparkleChime();
      },
    });
  });

  // ------------------------------------------------------------------------
  // 9. Section 6 — Podium Promise
  // ------------------------------------------------------------------------
  const promise1 = document.getElementById('promise-1');
  const promise2 = document.getElementById('promise-2');
  const btnSurprise = document.getElementById('btn-surprise');

  ScrollTrigger.create({
    trigger: '#section-6',
    start: 'top 60%',
    onEnter: () => {
      gsap.timeline()
        .to(promise1, { opacity: 1, duration: 1 })
        .to(promise2, { opacity: 1, duration: 1 }, '+=0.4')
        .add(() => soundFX.playEngineRev());
    },
  });

  if (btnSurprise) {
    btnSurprise.addEventListener('click', () => {
      soundFX.playSparkleChime();
      lenis.scrollTo('#section-7', { duration: 1.2 });
    });
  }

  // ------------------------------------------------------------------------
  // 10. Section 7 — Gift Box / Trophy
  // ------------------------------------------------------------------------
  const giftBoxWrapper = document.getElementById('gift-box-wrapper');
  let isGiftOpened = false;

  if (giftBoxWrapper) {
    giftBoxWrapper.addEventListener('click', () => {
      if (isGiftOpened) return;
      isGiftOpened = true;

      giftBoxWrapper.classList.add('shake');
      soundFX.playEngineRev();

      setTimeout(() => {
        giftBoxWrapper.classList.remove('shake');
        giftBoxWrapper.classList.add('open');
        soundFX.playSparkleChime();

        const rect = giftBoxWrapper.getBoundingClientRect();
        spawnHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);

        setTimeout(() => lenis.scrollTo('#section-8', { duration: 1.4 }), 1000);
      }, 500);
    });
  }

  // ------------------------------------------------------------------------
  // 11. Section 8 — Victory Confetti & Overlay
  // ------------------------------------------------------------------------
  const mainPhotoFrame = document.getElementById('main-photo-frame');
  const btnTransformHearts = document.getElementById('btn-transform-hearts');
  const finalOverlay = document.getElementById('final-heart-overlay');
  const btnReplay = document.getElementById('btn-replay');

  ScrollTrigger.create({
    trigger: '#section-8',
    start: 'top 65%',
    onEnter: () => {
      if (mainPhotoFrame) mainPhotoFrame.classList.add('visible');
      soundFX.playEngineRev();
      if (mainPhotoFrame) {
        const rect = mainPhotoFrame.getBoundingClientRect();
        spawnHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
      }
    },
  });

  if (btnTransformHearts) {
    btnTransformHearts.addEventListener('click', () => {
      soundFX.playEngineRev();
      soundFX.playSparkleChime();
      if (finalOverlay) finalOverlay.classList.add('active');

      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          spawnHeartBurst(Math.random() * width, Math.random() * height, 35);
        }, i * 220);
      }
    });
  }

  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      if (finalOverlay) finalOverlay.classList.remove('active');
      lenis.scrollTo('#section-1', { duration: 1.5 });
    });
  }
});
