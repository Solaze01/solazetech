(() => {
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const currentYear = document.getElementById('current-year');

  if (currentYear) currentYear.textContent = new Date().getFullYear();

  const setTheme = (theme) => {
    const dark = theme === 'dark';
    body.classList.toggle('dark-theme', dark);
    themeToggle?.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  };

  let savedTheme = null;
  try { savedTheme = localStorage.getItem('solazetech-theme'); } catch (_) { /* storage is optional */ }
  setTheme(savedTheme || 'light');

  themeToggle?.addEventListener('click', () => {
    const nextTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
    setTheme(nextTheme);
    try { localStorage.setItem('solazetech-theme', nextTheme); } catch (_) { /* storage is optional */ }
  });

  const closeMenu = () => {
    navLinks?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks?.classList.toggle('is-open') ?? false;
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 680) closeMenu();
  });

  // Reveal content only when animation support is available; otherwise all content stays visible.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.service-strip article, .section-heading, .project-feature, .project-card, .testimonial-layout, .approach-grid > *, .about-grid > *, .contact-panel'
    );
    revealTargets.forEach((item) => item.setAttribute('data-reveal', ''));
    body.classList.add('motion-ready');

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -35px 0px' });

    revealTargets.forEach((item) => revealObserver.observe(item));
  }

  requestAnimationFrame(() => body.classList.add('is-ready'));
})();
