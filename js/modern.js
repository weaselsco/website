// Weasels — modern interactions
// Scroll reveal, animated counters, magnetic buttons, navbar shadow,
// cookie banner / modal, hero parallax.

(function () {
  'use strict';

  // Set <html lang> based on URL path (since static layout is hardcoded "pl")
  if (location.pathname.startsWith('/en/') || location.pathname === '/en') {
    document.documentElement.lang = 'en';
  } else if (location.pathname.startsWith('/de/') || location.pathname === '/de') {
    document.documentElement.lang = 'de';
  }

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------- Navbar shadow on scroll ---------- */
  const nav = $('.navbar.navbar-default');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll reveal ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((el) => io.observe(el));
  } else {
    $$('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Animated counters in "about" stats ---------- */
  const parseTarget = (txt) => {
    // Extract integer from strings like "100%", "1800 +", "36000 +", "365x24"
    const m = txt.match(/\d+/);
    return m ? parseInt(m[0], 10) : null;
  };

  const animateCounter = (el) => {
    const original = el.textContent.trim();
    const target = parseTarget(original);
    if (target === null) return;
    const suffix = original.replace(/^\d+/, '');
    const duration = 1400;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const val = Math.floor(target * ease(p));
      el.textContent = val.toLocaleString('pl-PL') + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = original;
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    $$('.section__about--icon-text').forEach((el) => counterIO.observe(el));
  }

  /* ---------- Magnetic buttons ---------- */
  const magnets = $$('.btn-magnetic');
  magnets.forEach((btn) => {
    btn.addEventListener('mousemove', (ev) => {
      const r = btn.getBoundingClientRect();
      const x = ev.clientX - r.left - r.width / 2;
      const y = ev.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ---------- Hero parallax ---------- */
  const heroBg = $('#home .holder-item, #home .holder-item-gallery');
  if (heroBg) {
    const onParallax = () => {
      const y = window.scrollY;
      if (y > window.innerHeight) return;
      heroBg.style.backgroundPositionY = `calc(50% + ${y * 0.25}px)`;
      const logo = $('#home .logo');
      const motto = $('#home .motto');
      if (logo)  logo.style.transform  = `translateY(${y * -0.15}px)`;
      if (motto) motto.style.transform = `translateY(${y * -0.08}px)`;
    };
    window.addEventListener('scroll', onParallax, { passive: true });
    onParallax();
  }

  /* ---------- Cookie consent + conditional Google Analytics ---------- */
  const STORAGE_KEY = 'weasels_cookie_consent';
  const banner = $('#cookie-banner');
  const modal  = $('#cookie-modal');

  const getConsent = () => {
    try { return localStorage.getItem(STORAGE_KEY); }
    catch (_) { return null; }
  };
  const setConsent = (value) => {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (_) {}
  };

  const showBanner = () => banner && banner.classList.add('is-visible');
  const hideBanner = () => banner && banner.classList.remove('is-visible');
  const openModal  = () => {
    if (!modal) return;
    modal.classList.add('is-visible');
    document.body.classList.add('no-scroll');
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-visible');
    document.body.classList.remove('no-scroll');
  };

  // --- Analytics loader (runs only after explicit "accept") -------------
  let analyticsLoaded = false;
  const loadAnalytics = () => {
    if (analyticsLoaded) return;
    const cfg = document.getElementById('ga-config');
    const id  = cfg && cfg.getAttribute('data-ga-id');
    if (!id) return;
    analyticsLoaded = true;

    // Insert the gtag script tag
    const s = document.createElement('script');
    s.async = true;
    s.src   = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);

    // Initialise dataLayer + gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
  };

  // Disable any previously-loaded analytics by setting the gtag opt-out flag
  // (Google's official mechanism: window['ga-disable-<ID>'] = true).
  const disableAnalytics = () => {
    const cfg = document.getElementById('ga-config');
    const id  = cfg && cfg.getAttribute('data-ga-id');
    if (id) window['ga-disable-' + id] = true;
  };

  // Run on page load
  const initialConsent = getConsent();
  if (initialConsent === 'accepted') {
    loadAnalytics();
  } else if (initialConsent === 'declined') {
    disableAnalytics();
  } else if (banner) {
    // Slight delay for nicer entry
    setTimeout(showBanner, 700);
  }

  document.addEventListener('click', (ev) => {
    const t = ev.target.closest('[data-cookie-action]');
    if (!t) return;
    ev.preventDefault();
    const action = t.getAttribute('data-cookie-action');

    if (action === 'accept') {
      setConsent('accepted');
      hideBanner();
      closeModal();
      loadAnalytics();
    } else if (action === 'decline') {
      setConsent('declined');
      hideBanner();
      closeModal();
      disableAnalytics();
    } else if (action === 'open') {
      openModal();
    } else if (action === 'manage') {
      // Reset stored consent and reopen the banner so the user can choose again
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
      disableAnalytics();
      closeModal();
      setTimeout(showBanner, 200);
    } else if (action === 'close') {
      closeModal();
    }
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeModal();
  });

  /* ---------- Smooth scroll for hash links ---------- */
  $$('a[href^="#"]').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    a.addEventListener('click', (ev) => {
      const target = $(href);
      if (!target) return;
      ev.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
