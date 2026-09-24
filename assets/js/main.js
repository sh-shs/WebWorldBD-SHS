/* ==========================================================================
   WebWorldBD - Main Application Script
   Author: SHAFAET HOSSEN SARIP (WebWorldBD)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State & Configuration
  let currentTheme = localStorage.getItem('webworldbd_theme') || 'dark';
  let currentLang = localStorage.getItem('webworldbd_lang') || 'en';

  // Apply Theme & Language on Load
  applyTheme(currentTheme);
  applyLanguage(currentLang);

  // Initialize UI Features
  initHeader();
  initThemeToggle();
  initLangSwitch();
  initParticles();
  initCounters();
  initAccordion();
  initMobileMenu();
  initMobileBottomNav();
  initBackToTop();
  initAuthTabs();
  initFirebaseAuthObserver();
  initScrollAnimations();
  initSettingsPage();

  // Dynamic Content Rendering
  if (document.getElementById('services-grid')) renderServices();
  if (document.getElementById('capabilities-grid')) renderCapabilities();
  if (document.getElementById('projects-grid')) {
    renderProjects('all', '');
    initProjectFiltersAndSearch();
  }
  if (document.getElementById('faq-accordion')) renderFAQs();
  if (document.getElementById('project-detail-content')) initProjectDetailsPage();
  if (document.getElementById('service-detail-app')) initServiceDetailPage();
  if (document.getElementById('start-project-form')) initStartProjectForm();

  /* --------------------------------------------------------------------------
     2. Theme & Language Functions
     -------------------------------------------------------------------------- */
  function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('webworldbd_theme', theme);

    let effectiveTheme = theme;
    if (theme === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', effectiveTheme);

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = effectiveTheme === 'dark'
        ? '<i class="fas fa-moon"></i>'
        : '<i class="fas fa-sun"></i>';
      themeToggleBtn.setAttribute('title', effectiveTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }

    // Sync settings radio buttons if present
    const themeRadios = document.querySelectorAll('input[name="theme-radio"]');
    themeRadios.forEach(radio => {
      radio.checked = (radio.value === theme);
    });
  }

  // Listen to system color scheme changes if system preference is active
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (currentTheme === 'system') {
        applyTheme('system');
      }
    });
  }

  function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
      });
    }
  }

  function getDynamicCopyrightText(lang) {
    const year = new Date().getFullYear().toString();
    if (lang === 'bn') {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      const bnYear = year.replace(/\d/g, d => bnDigits[d]);
      return `© ${bnYear} WebWorldBD। সর্বস্বত্ব সংরক্ষিত সাফায়েত হোসেন ছারিফ দ্বারা।`;
    }
    return `© ${year} WebWorldBD. Created with passion by SHAFAET HOSSEN SARIP. All rights reserved.`;
  }

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('webworldbd_lang', lang);

    if (lang === 'bn') {
      document.body.classList.add('lang-bn');
    } else {
      document.body.classList.remove('lang-bn');
    }

    // Dynamic copyright text generator
    const dynamicCopyright = getDynamicCopyrightText(lang);

    // Check auth state for account subtext if available
    const isUserLoggedIn = window.currentUserState ? true : false;

    // Update text elements with data-i18n attribute
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key === 'copyrightText') {
        el.textContent = dynamicCopyright;
      } else if (key === 'accountSub') {
        const subKey = isUserLoggedIn ? 'accountSubLoggedIn' : 'accountSub';
        if (translations[lang] && translations[lang][subKey]) {
          el.textContent = translations[lang][subKey];
        }
      } else if (translations[lang] && translations[lang][key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translations[lang][key];
        } else {
          const val = translations[lang][key];
          if (val.includes('<') && val.includes('>')) {
            el.innerHTML = val;
          } else {
            el.textContent = val;
          }
        }
      }
    });

    // Update Language Toggle Button Text
    const langSwitchBtn = document.getElementById('lang-switch-btn');
    if (langSwitchBtn) {
      langSwitchBtn.innerHTML = lang === 'en'
        ? '<i class="fas fa-globe"></i> BN'
        : '<i class="fas fa-globe"></i> EN';
    }

    // Sync settings language radio buttons if present
    const langRadios = document.querySelectorAll('input[name="lang-radio"]');
    langRadios.forEach(radio => {
      radio.checked = (radio.value === lang);
    });

    // Re-render dynamic sections if present
    if (document.getElementById('services-grid')) renderServices();
    if (document.getElementById('capabilities-grid')) renderCapabilities();
    if (document.getElementById('projects-grid')) {
      const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
      const searchVal = document.getElementById('project-search-input')?.value || '';
      renderProjects(activeFilter, searchVal);
    }
    if (document.getElementById('faq-accordion')) renderFAQs();
    if (document.getElementById('project-detail-content')) initProjectDetailsPage();
    if (document.getElementById('service-detail-app')) initServiceDetailPage();
  }

  function initLangSwitch() {
    const langSwitchBtn = document.getElementById('lang-switch-btn');
    if (langSwitchBtn) {
      langSwitchBtn.addEventListener('click', () => {
        const nextLang = currentLang === 'en' ? 'bn' : 'en';
        applyLanguage(nextLang);
      });
    }
  }

  /* --------------------------------------------------------------------------
     3. Header & Navigation Controls
     -------------------------------------------------------------------------- */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (!navMenu) return;

    let navBackdrop = document.getElementById('nav-backdrop');
    if (!navBackdrop) {
      navBackdrop = document.createElement('div');
      navBackdrop.id = 'nav-backdrop';
      navBackdrop.className = 'nav-backdrop';
      document.body.appendChild(navBackdrop);
    }

    function openMenu() {
      navMenu.classList.add('active');
      if (mobileToggle) mobileToggle.classList.add('active');
      if (navBackdrop) navBackdrop.classList.add('active');
      document.body.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      navMenu.classList.remove('active');
      if (mobileToggle) mobileToggle.classList.remove('active');
      if (navBackdrop) navBackdrop.classList.remove('active');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    }

    if (mobileToggle) {
      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navMenu.classList.contains('active')) {
          closeMenu();
        } else {
          openMenu();
        }
      });
    }

    if (navBackdrop) {
      navBackdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
      });
    }

    function highlightActiveNavLink() {
      const currentPath = window.location.pathname.toLowerCase();
      const currentHash = window.location.hash.toLowerCase();
      const navLinks = navMenu.querySelectorAll('.nav-link[data-nav-id]');

      navLinks.forEach(link => {
        const navId = link.getAttribute('data-nav-id');
        let isActive = false;

        if (currentPath.endsWith('why-choose-me.html')) {
          isActive = (navId === 'why');
        } else if (currentPath.endsWith('process.html')) {
          isActive = (navId === 'process');
        } else if (currentPath.endsWith('faq.html')) {
          isActive = (navId === 'faq');
        } else if (currentPath.endsWith('services.html') || currentPath.includes('/services/')) {
          isActive = (navId === 'services');
        } else if (currentPath.endsWith('projects.html') || currentPath.endsWith('project-details.html')) {
          isActive = (navId === 'projects');
        } else if (currentPath.endsWith('account.html')) {
          isActive = (navId === 'account');
        } else if (currentPath.endsWith('contact.html')) {
          isActive = (navId === 'contact');
        } else {
          if (currentHash === '#about') {
            isActive = (navId === 'about');
          } else {
            isActive = (navId === 'home');
          }
        }

        if (isActive) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    highlightActiveNavLink();
    window.addEventListener('hashchange', highlightActiveNavLink);

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && (!mobileToggle || !mobileToggle.contains(e.target))) {
        closeMenu();
      }
    });
  }

  /* --------------------------------------------------------------------------
     3b. Mobile Bottom Navigation Active Route Highlighting
     -------------------------------------------------------------------------- */
  function initMobileBottomNav() {
    const mobileNav = document.getElementById('mobile-bottom-nav');
    if (!mobileNav) return;

    const navItems = mobileNav.querySelectorAll('.mobile-nav-item');

    function updateActiveBottomNav() {
      const currentPath = window.location.pathname.toLowerCase();
      let activeNavKey = 'home';

      if (currentPath.endsWith('services.html') || currentPath.includes('/services/')) {
        activeNavKey = 'services';
      } else if (currentPath.endsWith('contact.html')) {
        activeNavKey = 'connect';
      } else if (currentPath.endsWith('projects.html') || currentPath.endsWith('project-details.html')) {
        activeNavKey = 'projects';
      } else if (currentPath.endsWith('start-project.html')) {
        activeNavKey = 'fab';
      } else {
        activeNavKey = 'home';
      }

      navItems.forEach(item => {
        if (item.dataset.nav === activeNavKey) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }

    updateActiveBottomNav();
  }

  /* --------------------------------------------------------------------------
     4. Particle Canvas Background Effect
     -------------------------------------------------------------------------- */
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(Math.floor(width / 25), 50);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = (document.documentElement.getAttribute('data-theme') === 'dark')
          ? `rgba(56, 189, 248, ${p.alpha})`
          : `rgba(14, 165, 233, ${p.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  /* --------------------------------------------------------------------------
     5. Animated Numbers Counter
     -------------------------------------------------------------------------- */
  function initCounters() {
    const counterEls = document.querySelectorAll('.counter');
    if (counterEls.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      counterEls.forEach(el => {
        const target = el.getAttribute('data-target') || '0';
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = target + suffix;
      });
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target') || '0', 10);
          const suffix = entry.target.getAttribute('data-suffix') || '';
          if (isNaN(target) || target <= 0) return;

          let count = 0;
          const duration = 600;
          const stepTime = 20;
          const increment = Math.max(1, Math.ceil(target / (duration / stepTime)));

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              entry.target.textContent = target + suffix;
              clearInterval(timer);
            } else {
              entry.target.textContent = count + suffix;
            }
          }, stepTime);

          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    counterEls.forEach(el => observer.observe(el));
  }

  /* Helper to determine relative URL path to service detail page */
  function getServiceUrl(slug) {
    const isSubdir = window.location.pathname.includes('/services/');
    return isSubdir ? `${slug}.html` : `services/${slug}.html`;
  }

  /* Helper to determine relative URL path to contact page */
  function getContactUrl() {
    const isSubdir = window.location.pathname.includes('/services/');
    return isSubdir ? `../contact.html` : `contact.html`;
  }

  /* Helper to determine relative URL path to home page */
  function getHomeUrl() {
    const isSubdir = window.location.pathname.includes('/services/');
    return isSubdir ? `../index.html` : `index.html`;
  }

  /* Helper to determine relative URL path to services page */
  function getServicesPageUrl() {
    const isSubdir = window.location.pathname.includes('/services/');
    return isSubdir ? `../services.html` : `services.html`;
  }

  /* --------------------------------------------------------------------------
     6. Dynamic Content Renderers
     -------------------------------------------------------------------------- */
  function renderServices() {
    const container = document.getElementById('services-grid');
    if (!container) return;

    let servicesToRender = portfolioData.services;
    if (container.dataset.limit) {
      const limit = parseInt(container.dataset.limit, 10);
      servicesToRender = servicesToRender.filter(s => s.featured).slice(0, limit);
    }

    container.innerHTML = servicesToRender.map(s => `
      <a href="${getServiceUrl(s.slug)}" class="service-row-item">
        <div class="service-row-left">
          <div class="service-row-icon">
            <i class="${s.icon || 'fas fa-laptop-code'}"></i>
          </div>
          <h3 class="service-row-title">${currentLang === 'bn' ? s.title_bn : s.title_en}</h3>
        </div>
        <div class="service-row-arrow">
          <i class="fas fa-chevron-right"></i>
        </div>
      </a>
    `).join('');
  }

  function renderCapabilities() {
    const container = document.getElementById('capabilities-grid');
    if (!container) return;

    container.innerHTML = portfolioData.capabilities.map(cap => `
      <div class="cap-tag">
        <i class="fas fa-check-circle" style="color:var(--accent-blue); margin-right:6px;"></i>
        ${currentLang === 'bn' ? cap.bn : cap.en}
      </div>
    `).join('');
  }

  function renderProjectThumbnail(projectId, isDetailView = false) {
    const project = portfolioData.projects.find(p => p.id === projectId);
    const projectUrl = project ? project.url : '#';
    const thumbClass = isDetailView ? 'project-thumb project-thumb-detail' : 'project-thumb';
    let patternSvg = '';
    let iconSvg = '';
    let cardClass = '';

    switch (projectId) {
      case 'shs-bazar':
        cardClass = 'thumb-shs-bazar';
        patternSvg = `
          <svg class="thumb-pattern" viewBox="0 0 400 200" preserveAspectRatio="none">
            <defs>
              <pattern id="grid-pattern-shs" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.22)" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern-shs)"/>
            <circle cx="200" cy="100" r="110" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" stroke-dasharray="4 4"/>
            <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
          </svg>
        `;
        iconSvg = `
          <svg class="thumb-icon-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 20H48V52C48 54.2091 46.2091 56 44 56H20C17.7909 56 16 54.2091 16 52V20Z" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M24 24V16C24 11.5817 27.5817 8 32 8C36.4183 8 40 11.5817 40 16V24" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M25 34L30 39L39 29" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="20" y1="47" x2="44" y2="47" stroke="rgba(255,255,255,0.5)" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        `;
        break;

      case 'student-tools-ai':
        cardClass = 'thumb-student-tools-ai';
        patternSvg = `
          <svg class="thumb-pattern" viewBox="0 0 400 200" preserveAspectRatio="none">
            <defs>
              <pattern id="dots-pattern-edu" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="6" r="1.5" fill="rgba(255, 255, 255, 0.3)"/>
                <circle cx="20" cy="20" r="2" fill="rgba(255, 255, 255, 0.2)"/>
                <circle cx="24" cy="8" r="1" fill="rgba(255, 255, 255, 0.4)"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-pattern-edu)"/>
            <path d="M0 150 Q 100 50, 200 150 T 400 150" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          </svg>
        `;
        iconSvg = `
          <svg class="thumb-icon-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 10L6 23L32 36L58 23L32 10Z" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 27.5V42C14 42 22 48 32 48C42 48 50 42 50 42V27.5" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M52 24.5V38C52 39.1046 51.1046 40 50 40C48.8954 40 48 39.1046 48 38V36" stroke="#C084FC" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M48 10C48 13.5 50.5 16 54 16C50.5 16 48 18.5 48 22C48 18.5 45.5 16 42 16C45.5 16 48 13.5 48 10Z" fill="#38BDF8"/>
            <path d="M12 40C12 42.5 13.5 44 16 44C13.5 44 12 45.5 12 48C12 45.5 10.5 44 8 44C10.5 44 12 42.5 12 40Z" fill="#C084FC"/>
          </svg>
        `;
        break;

      case 'happy-birthday-wish':
        cardClass = 'thumb-happy-birthday-wish';
        patternSvg = `
          <svg class="thumb-pattern" viewBox="0 0 400 200" preserveAspectRatio="none">
            <defs>
              <pattern id="confetti-pattern-bday" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="#FFE4E6"/>
                <circle cx="30" cy="25" r="2.5" fill="#FEF08A"/>
                <rect x="22" y="8" width="3" height="3" transform="rotate(25 22 8)" fill="#A7F3D0"/>
                <circle cx="6" cy="32" r="1.5" fill="#FBCFE8"/>
                <path d="M34 5 Q 38 12, 34 18" fill="none" stroke="#FDE68A" stroke-width="1.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#confetti-pattern-bday)"/>
          </svg>
        `;
        iconSvg = `
          <svg class="thumb-icon-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 8C22.0589 8 14 16.0589 14 26C14 34.5 21 40 30 43.5L29 47H35L34 43.5C43 40 50 34.5 50 26C50 16.0589 41.9411 8 32 8Z" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 18C24 15 27 13 31 12.5" stroke="rgba(255,255,255,0.7)" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M32 47C32 49 35 51 33 54C31 57 34 58 33 60" stroke="#FFE4E6" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M10 18L12 22L16 24L12 26L10 30L8 26L4 24L8 22L10 18Z" fill="#FEF08A"/>
            <path d="M52 36L53.5 39L56.5 40.5L53.5 42L52 45L50.5 42L47.5 40.5L50.5 39L52 36Z" fill="#A7F3D0"/>
          </svg>
        `;
        break;

      case 'animated-heart':
        cardClass = 'thumb-animated-heart';
        patternSvg = `
          <svg class="thumb-pattern" viewBox="0 0 400 200" preserveAspectRatio="none">
            <defs>
              <pattern id="sparkle-pattern-heart" width="45" height="45" patternUnits="userSpaceOnUse">
                <circle cx="12" cy="12" r="1.5" fill="rgba(255,255,255,0.3)"/>
                <circle cx="35" cy="30" r="2" fill="rgba(254,205,211,0.4)"/>
                <path d="M24 6 L26 10 L30 12 L26 14 L24 18 L22 14 L18 12 L22 10 Z" fill="rgba(255,255,255,0.2)"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sparkle-pattern-heart)"/>
            <circle cx="200" cy="100" r="80" fill="rgba(244,63,94,0.18)" filter="blur(20px)"/>
          </svg>
        `;
        iconSvg = `
          <svg class="thumb-icon-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 54.5C32 54.5 8 40 8 23.5C8 15.5 14.5 9 22.5 9C27.2 9 31.3 11.2 32 14.5C32.7 11.2 36.8 9 41.5 9C49.5 9 56 15.5 56 23.5C56 40 32 54.5 32 54.5Z" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="rgba(244,63,94,0.2)"/>
            <path d="M18 21.5C18.5 17.5 22 14.5 26 14.5" stroke="#FECDD3" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M46 16L47 18.5L49.5 19.5L47 20.5L46 23L45 20.5L42.5 19.5L45 18.5L46 16Z" fill="#FFFFFF"/>
          </svg>
        `;
        break;

      default:
        cardClass = 'thumb-shs-bazar';
        patternSvg = '';
        iconSvg = `<i class="fas fa-code" style="font-size:3rem; color:#fff;"></i>`;
    }

    if (isDetailView) {
      return `
        <div class="${thumbClass} ${cardClass}" style="width: 100%; height: 320px; border-radius: 16px; margin-bottom: 2.5rem; position: relative;">
          ${patternSvg}
          <div class="thumb-icon-wrapper">
            ${iconSvg}
          </div>
          <div style="position: absolute; bottom: 15px; right: 15px; background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); padding: 0.5rem 1rem; border-radius: 30px; font-size: 0.85rem; color: #fff; z-index: 4;">
            <i class="fas fa-shield-alt" style="color: var(--accent-blue);"></i> WebWorldBD Verified
          </div>
        </div>
      `;
    }

    return `
      <div class="${thumbClass} ${cardClass}">
        ${patternSvg}
        <div class="thumb-icon-wrapper">
          ${iconSvg}
        </div>
        <div class="project-thumb-overlay">
          <a href="${projectUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding:0.5rem 1rem; font-size:0.85rem;">
            <i class="fas fa-external-link-alt"></i> ${translations[currentLang].btnLivePreview}
          </a>
          <a href="project-details.html?id=${projectId}" class="btn btn-secondary" style="padding:0.5rem 1rem; font-size:0.85rem;">
            <i class="fas fa-info-circle"></i> ${translations[currentLang].btnProjectDetails}
          </a>
        </div>
      </div>
    `;
  }

  function renderProjects(filterCategory = 'all', searchQuery = '') {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    let filtered = portfolioData.projects;

    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        const title = p.title.toLowerCase();
        const descEn = p.short_desc_en.toLowerCase();
        const descBn = p.short_desc_bn.toLowerCase();
        const techs = p.techs.join(' ').toLowerCase();
        return title.includes(q) || descEn.includes(q) || descBn.includes(q) || techs.includes(q);
      });
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem; color: var(--accent-blue);"></i>
          <h3>${currentLang === 'bn' ? 'কোন প্রজেক্ট পাওয়া যায়নি' : 'No Projects Found'}</h3>
          <p>${currentLang === 'bn' ? 'অনুগ্রহ করে অন্য শব্দ বা ক্যাটাগরি ট্রাই করুন।' : 'Try adjusting your search or category filter.'}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(p => `
      <div class="glass-card project-card">
        ${renderProjectThumbnail(p.id)}
        <div class="project-info">
          <span class="project-category">${currentLang === 'bn' ? p.categoryName_bn : p.categoryName_en}</span>
          <h3>${p.title}</h3>
          <p>${currentLang === 'bn' ? p.short_desc_bn : p.short_desc_en}</p>
          <div class="project-techs">
            ${p.techs.map(t => `<span class="tech-badge">${t}</span>`).join('')}
          </div>
          <div class="project-actions">
            <a href="project-details.html?id=${p.id}" class="btn btn-secondary" style="width:100%; font-size:0.85rem; padding:0.6rem;">
              ${translations[currentLang].btnProjectDetails} <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }

  function initProjectFiltersAndSearch() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('project-search-input');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter || 'all';
        const searchVal = searchInput ? searchInput.value : '';
        renderProjects(filter, searchVal);
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        renderProjects(activeFilter, e.target.value);
      });
    }
  }

  function renderFAQs() {
    const container = document.getElementById('faq-accordion');
    if (!container) return;

    container.innerHTML = portfolioData.faqs.map((faq, index) => `
      <div class="glass-card faq-item ${index === 0 ? 'active' : ''}">
        <div class="faq-question">
          <span>${currentLang === 'bn' ? faq.q_bn : faq.q_en}</span>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="faq-answer">
          <p>${currentLang === 'bn' ? faq.a_bn : faq.a_en}</p>
        </div>
      </div>
    `).join('');

    initAccordion();
  }

  function initAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(q => {
      q.addEventListener('click', () => {
        const item = q.parentElement;
        const isActive = item.classList.contains('active');

        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. Project Details Page View Handler
     -------------------------------------------------------------------------- */
  function initProjectDetailsPage() {
    const container = document.getElementById('project-detail-content');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id') || 'shs-bazar';

    const project = portfolioData.projects.find(p => p.id === projectId) || portfolioData.projects[0];

    container.innerHTML = `
      <div class="glass-card" style="padding: 2.5rem; margin-bottom: 3rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2rem;">
          <div>
            <span class="badge-pill" style="margin-bottom: 0.8rem;">
              <i class="fas fa-tag"></i> ${currentLang === 'bn' ? project.categoryName_bn : project.categoryName_en}
            </span>
            <h1 style="font-size: 2.5rem; font-weight: 800; margin-top: 0.5rem;">${project.title}</h1>
          </div>
          <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <i class="fas fa-external-link-alt"></i> ${translations[currentLang].btnLivePreview}
          </a>
        </div>

        ${renderProjectThumbnail(project.id, true)}

        <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 2.5rem;">
          <div>
            <h3 style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: 700;">${currentLang === 'bn' ? 'প্রজেক্ট বিবরণ' : 'Project Overview'}</h3>
            <p style="color: var(--text-muted); line-height: 1.8; margin-bottom: 2rem; font-size: 1.05rem;">
              ${currentLang === 'bn' ? project.full_desc_bn : project.full_desc_en}
            </p>

            <h3 style="font-size: 1.4rem; margin-bottom: 1rem; font-weight: 700;">${currentLang === 'bn' ? 'মূল ফিচারের তালিকা' : 'Key Features'}</h3>
            <ul style="display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 2rem;">
              ${(currentLang === 'bn' ? project.key_features_bn : project.key_features_en).map(feat => `
                <li style="display: flex; align-items: center; gap: 0.75rem; color: var(--text-main);">
                  <i class="fas fa-check-circle" style="color: var(--accent-blue); font-size: 1.1rem;"></i>
                  ${feat}
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="glass-card" style="padding: 1.75rem; height: fit-content;">
            <h3 style="font-size: 1.2rem; margin-bottom: 1.25rem; font-weight: 700; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.75rem;">
              ${currentLang === 'bn' ? 'প্রজেক্ট ইনফরমেশন' : 'Project Metadata'}
            </h3>

            <div style="margin-bottom: 1.25rem;">
              <span style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">${currentLang === 'bn' ? 'ক্লায়েন্ট' : 'Client'}</span>
              <p style="font-weight: 600; font-size: 0.95rem;">${currentLang === 'bn' ? project.client_bn : project.client_en}</p>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <span style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">${currentLang === 'bn' ? 'ব্যবহৃত প্রযুক্তি' : 'Technologies Used'}</span>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                ${project.techs.map(t => `<span class="tech-badge" style="background: rgba(56, 189, 248, 0.15); color: var(--accent-blue);">${t}</span>`).join('')}
              </div>
            </div>

            <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
              <i class="fas fa-external-link-alt"></i> ${currentLang === 'bn' ? 'লাইভ সাইটে যান' : 'Visit Live Project'}
            </a>
          </div>
        </div>
      </div>
    `;

    const freeTextForm = document.getElementById('others-free-text-form');
    if (freeTextForm) {
      freeTextForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const textVal = document.getElementById('others-custom-text')?.value.trim() || '';
        if (!textVal) return;
        const waMessage = `*Custom Project Request — WebWorldBD*\n\n*Requirement Details:*\n${textVal}`;
        const waUrl = `https://wa.me/8801342697743?text=${encodeURIComponent(waMessage)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      });
    }
  }

  /* --------------------------------------------------------------------------
     7b. Dedicated Service Detail Page View Handler
     -------------------------------------------------------------------------- */
  function initServiceDetailPage() {
    const container = document.getElementById('service-detail-app');
    if (!container) return;

    const attrSlug = container.getAttribute('data-service-slug');
    let serviceSlug = attrSlug;

    if (!serviceSlug) {
      const pathParts = window.location.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      serviceSlug = fileName.replace('.html', '');
    }

    const service = portfolioData.services.find(s => s.slug === serviceSlug || s.id === serviceSlug) || portfolioData.services[0];

    document.title = `${currentLang === 'bn' ? service.title_bn : service.title_en} | WebWorldBD`;

    const titleText = currentLang === 'bn' ? service.title_bn : service.title_en;
    const descText = currentLang === 'bn' ? service.desc_bn : service.desc_en;
    const overviewText = currentLang === 'bn' ? service.overview_bn : service.overview_en;
    const includesList = currentLang === 'bn' ? service.includes_bn : service.includes_en;
    const featuresList = currentLang === 'bn' ? service.features_bn : service.features_en;
    const audienceList = currentLang === 'bn' ? service.audience_bn : service.audience_en;
    const deliveryText = currentLang === 'bn' ? service.delivery_bn : service.delivery_en;
    const revisionsText = currentLang === 'bn' ? service.revisions_bn : service.revisions_en;
    const responsiveText = currentLang === 'bn' ? service.responsive_bn : service.responsive_en;

    const isSubdir = window.location.pathname.includes('/services/');
    const startProjectUrl = isSubdir ? '../start-project.html?service=others' : 'start-project.html?service=others';
    const contactLink = service.id === 'others' ? startProjectUrl : getContactUrl();
    const servicesLink = getServicesPageUrl();
    const homeLink = getHomeUrl();

    container.innerHTML = `
      <div style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <a href="${servicesLink}" class="btn btn-secondary" style="padding: 0.45rem 0.9rem; font-size: 0.85rem; border-radius: var(--radius-full);">
          <i class="fas fa-arrow-left"></i> ${translations[currentLang].btnBackToServices}
        </a>
        <nav style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: var(--text-muted); flex-wrap: wrap;">
          <a href="${homeLink}" style="color: var(--text-muted); text-decoration: none;">
            <i class="fas fa-home"></i> ${translations[currentLang].breadcrumbHome}
          </a>
          <span>/</span>
          <a href="${servicesLink}" style="color: var(--text-muted); text-decoration: none;">
            ${translations[currentLang].breadcrumbServices}
          </a>
          <span>/</span>
          <span style="color: var(--accent-blue); font-weight: 600;">${titleText}</span>
        </nav>
      </div>

      <div class="glass-card" style="padding: 2.5rem; margin-bottom: 2.5rem; border-color: rgba(56, 189, 248, 0.3);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
            <div class="service-icon" style="width: 70px; height: 70px; font-size: 2rem; margin-bottom: 0;">
              <i class="${service.icon || 'fas fa-laptop-code'}"></i>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.4rem;">
                <h1 style="font-size: 2.2rem; font-weight: 800; margin: 0;">${titleText}</h1>
              </div>
              <p style="color: var(--text-muted); font-size: 1.05rem; max-width: 650px; margin: 0;">
                ${descText}
              </p>
            </div>
          </div>
          <div>
            <a href="${contactLink}" class="btn btn-primary" style="padding: 0.85rem 1.8rem; font-size: 1rem;">
              <i class="fas fa-rocket"></i> ${translations[currentLang].btnStartProjectNow}
            </a>
          </div>
        </div>
      </div>

      ${service.id === 'others' ? `
      <div class="glass-card" style="padding: 2.25rem; margin-bottom: 2.5rem; border-color: rgba(56, 189, 248, 0.4);">
        <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--accent-blue); display: flex; align-items: center; gap: 0.6rem;">
          <i class="fas fa-pen-to-square"></i> ${translations[currentLang].formCustomDescLabel}
        </h2>
        <p style="color: var(--text-muted); margin-bottom: 1.25rem;">
          ${translations[currentLang].formCustomDescPlaceholder}
        </p>
        <form id="others-free-text-form" style="display: flex; flex-direction: column; gap: 1rem;">
          <textarea id="others-custom-text" rows="4" class="form-control" style="width: 100%; padding: 0.85rem 1.1rem; border-radius: var(--radius-md); background: var(--bg-glass); border: 1px solid var(--border-glass); color: var(--text-main); font-family: inherit; font-size: 0.98rem;" placeholder="${translations[currentLang].formCustomDescPlaceholder}" required></textarea>
          <div style="display: flex; gap: 0.85rem; flex-wrap: wrap;">
            <button type="submit" class="btn btn-primary" style="padding: 0.75rem 1.5rem;">
              <i class="fab fa-whatsapp"></i> ${currentLang === 'bn' ? 'হোয়াটসঅ্যাপে পাঠান' : 'Submit via WhatsApp'}
            </button>
            <a href="${startProjectUrl}" class="btn btn-secondary" style="padding: 0.75rem 1.5rem;">
              <i class="fas fa-clipboard-list"></i> ${translations[currentLang].formSubmitBtn}
            </a>
          </div>
        </form>
      </div>
      ` : ''}

      <div class="glass-card" style="padding: 2.25rem; margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--accent-blue); display: flex; align-items: center; gap: 0.6rem;">
          <i class="fas fa-info-circle"></i> ${translations[currentLang].sectionOverviewTitle}
        </h2>
        <p style="color: var(--text-main); font-size: 1.08rem; line-height: 1.85; margin: 0;">
          ${overviewText}
        </p>
      </div>

      <div class="glass-card" style="padding: 2.25rem; margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--accent-blue); display: flex; align-items: center; gap: 0.6rem;">
          <i class="fas fa-list-check"></i> ${translations[currentLang].sectionIncludesTitle}
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
          ${includesList.map(item => `
            <div style="display: flex; align-items: flex-start; gap: 0.75rem; background: var(--bg-glass); border: 1px solid var(--border-glass); padding: 0.9rem 1.1rem; border-radius: var(--radius-md);">
              <i class="fas fa-check-circle" style="color: var(--accent-blue); font-size: 1.15rem; margin-top: 3px; flex-shrink: 0;"></i>
              <span style="font-size: 0.95rem; font-weight: 600; color: var(--text-main); line-height: 1.5;">${item}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--accent-blue); display: flex; align-items: center; gap: 0.6rem;">
          <i class="fas fa-star"></i> ${translations[currentLang].sectionFeaturesTitle}
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          ${featuresList.map(feat => `
            <div class="glass-card" style="padding: 1.75rem;">
              <div class="service-icon" style="margin-bottom: 1rem;">
                <i class="${feat.icon}"></i>
              </div>
              <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem;">${feat.title}</h3>
              <p style="color: var(--text-muted); font-size: 0.95rem; margin: 0; line-height: 1.6;">${feat.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="glass-card" style="padding: 2.25rem; margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.25rem; color: var(--accent-blue); display: flex; align-items: center; gap: 0.6rem;">
          <i class="fas fa-bullseye"></i> ${translations[currentLang].sectionAudienceTitle}
        </h2>
        <div style="display: flex; flex-wrap: wrap; gap: 0.85rem;">
          ${audienceList.map(aud => `
            <div style="padding: 0.6rem 1.3rem; border-radius: var(--radius-full); background: rgba(56, 189, 248, 0.1); border: 1px solid var(--border-glow); color: var(--text-main); font-weight: 600; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 0.5rem;">
              <i class="fas fa-user-check" style="color: var(--accent-blue);"></i>
              ${aud}
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--accent-blue); display: flex; align-items: center; gap: 0.6rem;">
          <i class="fas fa-clock-rotate-left"></i> ${translations[currentLang].sectionDeliveryTitle}
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;">
          <div class="glass-card" style="padding: 1.5rem; text-align: center;">
            <i class="fas fa-truck-fast" style="font-size: 2rem; color: var(--accent-blue); margin-bottom: 0.75rem;"></i>
            <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.3rem;">${translations[currentLang].cardDeliveryTime}</h4>
            <p style="color: var(--accent-blue); font-weight: 700; font-size: 1.1rem; margin: 0;">${deliveryText}</p>
          </div>

          <div class="glass-card" style="padding: 1.5rem; text-align: center;">
            <i class="fas fa-rotate-left" style="font-size: 2rem; color: var(--accent-purple); margin-bottom: 0.75rem;"></i>
            <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.3rem;">${translations[currentLang].cardRevisionPolicy}</h4>
            <p style="color: var(--accent-purple); font-weight: 700; font-size: 1.1rem; margin: 0;">${revisionsText}</p>
          </div>

          <div class="glass-card" style="padding: 1.5rem; text-align: center;">
            <i class="fas fa-mobile-screen-button" style="font-size: 2rem; color: var(--accent-emerald); margin-bottom: 0.75rem;"></i>
            <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.3rem;">${translations[currentLang].cardMobileOptimization}</h4>
            <p style="color: var(--accent-emerald); font-weight: 700; font-size: 1.1rem; margin: 0;">${responsiveText}</p>
          </div>
        </div>
      </div>

      <div class="glass-card" style="padding: 2.75rem; text-align: center; border-color: rgba(56, 189, 248, 0.4); background: linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.85) 100%);">
        <h3 style="font-size: 1.85rem; margin-bottom: 0.75rem; font-weight: 800;">
          ${currentLang === 'bn' ? `আপনার ${service.title_bn} প্রজেক্ট শুরু করতে প্রস্তুত?` : `Ready to start your ${service.title_en} project?`}
        </h3>
        <p style="color: var(--text-muted); max-width: 620px; margin: 0 auto 1.75rem; font-size: 1.05rem;">
          ${currentLang === 'bn' ? 'আমাদের সাথে সরাসরি হোয়াটসঅ্যাপ, টেলিগ্রাম বা ফাইভারের মাধ্যমে যোগাযোগ করুন।' : 'Get in touch directly via WhatsApp, Telegram, or Fiverr to discuss your project.'}
        </p>
        <div style="display: flex; gap: 0.85rem; justify-content: center; flex-wrap: wrap;">
          <a href="${contactLink}" class="btn btn-primary" style="padding: 0.85rem 1.8rem; font-size: 1rem;">
            <i class="fas fa-paper-plane"></i> ${translations[currentLang].btnStartProjectNow}
          </a>
          <a href="https://wa.me/8801342697743" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="padding: 0.85rem 1.5rem; font-size: 1rem;">
            <i class="fab fa-whatsapp"></i> ${translations[currentLang].btnWhatsAppNav}
          </a>
          <a href="${portfolioData.profile.telegram}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 0.85rem 1.5rem; font-size: 1rem;">
            <i class="fab fa-telegram"></i> ${translations[currentLang].btnTelegram}
          </a>
          <a href="${portfolioData.profile.fiverrWebGig || portfolioData.profile.fiverrProfile}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 0.85rem 1.5rem; font-size: 1rem; border-color: #1dbf73; color: #1dbf73;">
            <i class="fas fa-store"></i> ${translations[currentLang].btnFiverr}
          </a>
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     7c. Viewport Entrance Scroll Animations
     -------------------------------------------------------------------------- */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    animatedElements.forEach(el => observer.observe(el));
  }

  /* --------------------------------------------------------------------------
     8. Back to Top & Contact Form
     -------------------------------------------------------------------------- */
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------------------------
     9. Client Account Auth Tabs Switcher & Interactivity
     -------------------------------------------------------------------------- */
  function initAuthTabs() {
    const authCardContainer = document.getElementById('auth-card-container');
    const loginTabBtn = document.getElementById('tab-btn-login');
    const regTabBtn = document.getElementById('tab-btn-register');
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const forgotForm = document.getElementById('forgot-form');
    const userDashView = document.getElementById('dashboard-user-view');
    const tabsWrapper = document.getElementById('auth-tabs-wrapper');
    const alertBox = document.getElementById('auth-alert-box');
    const alertMsg = document.getElementById('auth-alert-message');
    const alertClose = document.getElementById('auth-alert-close');
    const forgotPassLink = document.getElementById('forgot-password-link');
    const backToLoginBtn = document.getElementById('back-to-login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (!authCardContainer || !loginTabBtn || !regTabBtn || !loginForm || !regForm) return;

    function showAlert(message, type = 'error') {
      if (!alertBox || !alertMsg) return;
      alertBox.className = `auth-alert-box alert-${type}`;
      alertMsg.textContent = message;
      alertBox.style.display = 'flex';
    }

    function hideAlert() {
      if (alertBox) alertBox.style.display = 'none';
    }

    if (alertClose) {
      alertClose.addEventListener('click', hideAlert);
    }

    function setFieldError(fieldId, errorMsg) {
      const input = document.getElementById(fieldId);
      const errorSpan = document.getElementById(`${fieldId}-error`);
      if (input) input.classList.add('is-invalid');
      if (errorSpan) {
        errorSpan.textContent = errorMsg;
        errorSpan.classList.add('visible');
      }
    }

    function clearFieldErrors() {
      const invalidInputs = document.querySelectorAll('.auth-form .form-control');
      invalidInputs.forEach(i => i.classList.remove('is-invalid'));
      const errorSpans = document.querySelectorAll('.field-error-msg');
      errorSpans.forEach(s => {
        s.textContent = '';
        s.classList.remove('visible');
      });
      hideAlert();
    }

    function switchAuthTab(targetTab) {
      clearFieldErrors();
      if (targetTab === 'login') {
        authCardContainer.setAttribute('data-active-tab', 'login');
        loginTabBtn.classList.add('active');
        regTabBtn.classList.remove('active');
        loginForm.style.display = 'flex';
        regForm.style.display = 'none';
        if (forgotForm) forgotForm.style.display = 'none';
        if (tabsWrapper) tabsWrapper.style.display = 'flex';
      } else if (targetTab === 'register') {
        authCardContainer.setAttribute('data-active-tab', 'register');
        regTabBtn.classList.add('active');
        loginTabBtn.classList.remove('active');
        regForm.style.display = 'flex';
        loginForm.style.display = 'none';
        if (forgotForm) forgotForm.style.display = 'none';
        if (tabsWrapper) tabsWrapper.style.display = 'flex';
      } else if (targetTab === 'forgot') {
        loginForm.style.display = 'none';
        regForm.style.display = 'none';
        if (forgotForm) forgotForm.style.display = 'flex';
        if (tabsWrapper) tabsWrapper.style.display = 'none';
      }
    }

    loginTabBtn.addEventListener('click', () => switchAuthTab('login'));
    regTabBtn.addEventListener('click', () => switchAuthTab('register'));

    if (forgotPassLink) {
      forgotPassLink.addEventListener('click', () => switchAuthTab('forgot'));
    }

    if (backToLoginBtn) {
      backToLoginBtn.addEventListener('click', () => switchAuthTab('login'));
    }

    const passwordToggleBtns = document.querySelectorAll('.password-toggle-btn');
    passwordToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        if (!input) return;
        const icon = btn.querySelector('i');

        if (input.type === 'password') {
          input.type = 'text';
          if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
          }
        } else {
          input.type = 'password';
          if (icon) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
          }
        }
      });
    });

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        const mod = window.FirebaseModule;
        if (mod && mod.auth && mod.signOut) {
          mod.signOut(mod.auth).then(() => {
            if (userDashView) userDashView.style.display = 'none';
            const infoNotice = document.getElementById('auth-info-notice');
            if (infoNotice) infoNotice.style.display = 'flex';
            switchAuthTab('register');
            showAlert(currentLang === 'bn' ? 'সফলভাবে লগআউট করা হয়েছে।' : 'Logged out successfully.', 'info');
          }).catch(err => {
            showAlert(getFirebaseErrorMessage(err ? err.code : ''), 'error');
          });
        }
      });
    }

    function getFirebaseErrorMessage(errorCode) {
      switch (errorCode) {
        case 'auth/email-already-in-use':
          return translations[currentLang].errEmailInUse;
        case 'auth/weak-password':
          return translations[currentLang].errWeakPassword;
        case 'auth/user-not-found':
          return translations[currentLang].errUserNotFound;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return translations[currentLang].errWrongPassword;
        case 'auth/popup-closed-by-user':
          return translations[currentLang].errPopupClosed;
        case 'auth/invalid-email':
          return translations[currentLang].errEmailRequired;
        default:
          return translations[currentLang].errAuthDefault;
      }
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFieldErrors();

      const emailInput = document.getElementById('login-email');
      const passInput = document.getElementById('login-password');
      const submitBtn = document.getElementById('login-submit-btn');

      const email = emailInput ? emailInput.value.trim() : '';
      const password = passInput ? passInput.value : '';

      let hasError = false;

      if (!email || !isValidEmail(email)) {
        setFieldError('login-email', translations[currentLang].errEmailRequired);
        hasError = true;
      }

      if (!password || password.length < 6) {
        setFieldError('login-password', translations[currentLang].errPasswordRequired);
        hasError = true;
      }

      if (hasError) return;

      submitBtn.classList.add('loading');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnIcon = submitBtn.querySelector('.btn-icon');
      const originalText = btnText ? btnText.textContent : '';

      if (btnText) {
        btnText.innerHTML = `<span class="btn-spinner"></span>${currentLang === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Authenticating...'}`;
      }
      if (btnIcon) btnIcon.style.display = 'none';

      const mod = window.FirebaseModule;
      if (mod && mod.auth && mod.signInWithEmailAndPassword) {
        mod.signInWithEmailAndPassword(mod.auth, email, password)
          .then(() => {
            submitBtn.classList.remove('loading');
            if (btnText) btnText.textContent = originalText;
            if (btnIcon) btnIcon.style.display = 'inline-block';
            showAlert(translations[currentLang].msgLoginSuccess, 'success');
          })
          .catch((error) => {
            submitBtn.classList.remove('loading');
            if (btnText) btnText.textContent = originalText;
            if (btnIcon) btnIcon.style.display = 'inline-block';
            showAlert(getFirebaseErrorMessage(error.code), 'error');
          });
      }
    });

    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFieldErrors();

      const nameInput = document.getElementById('reg-name');
      const emailInput = document.getElementById('reg-email');
      const passInput = document.getElementById('reg-password');
      const confirmInput = document.getElementById('reg-confirm-password');
      const submitBtn = document.getElementById('reg-submit-btn');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passInput ? passInput.value : '';
      const confirmPassword = confirmInput ? confirmInput.value : '';

      let hasError = false;

      if (!name) {
        setFieldError('reg-name', translations[currentLang].errNameRequired);
        hasError = true;
      }

      if (!email || !isValidEmail(email)) {
        setFieldError('reg-email', translations[currentLang].errEmailRequired);
        hasError = true;
      }

      if (!password || password.length < 6) {
        setFieldError('reg-password', translations[currentLang].errPasswordRequired);
        hasError = true;
      }

      if (password !== confirmPassword) {
        setFieldError('reg-confirm', translations[currentLang].errPasswordMismatch);
        hasError = true;
      }

      if (hasError) return;

      submitBtn.classList.add('loading');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnIcon = submitBtn.querySelector('.btn-icon');
      const originalText = btnText ? btnText.textContent : '';

      if (btnText) {
        btnText.innerHTML = `<span class="btn-spinner"></span>${currentLang === 'bn' ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'Creating Account...'}`;
      }
      if (btnIcon) btnIcon.style.display = 'none';

      const mod = window.FirebaseModule;
      if (mod && mod.auth && mod.createUserWithEmailAndPassword) {
        mod.createUserWithEmailAndPassword(mod.auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            if (mod.updateProfile) {
              return mod.updateProfile(user, { displayName: name });
            }
          })
          .then(() => {
            submitBtn.classList.remove('loading');
            if (btnText) btnText.textContent = originalText;
            if (btnIcon) btnIcon.style.display = 'inline-block';
            showAlert(translations[currentLang].msgRegisterSuccess, 'success');
          })
          .catch((error) => {
            submitBtn.classList.remove('loading');
            if (btnText) btnText.textContent = originalText;
            if (btnIcon) btnIcon.style.display = 'inline-block';
            showAlert(getFirebaseErrorMessage(error.code), 'error');
          });
      }
    });

    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearFieldErrors();

        const resetEmailInput = document.getElementById('reset-email');
        const submitBtn = document.getElementById('reset-submit-btn');
        const email = resetEmailInput ? resetEmailInput.value.trim() : '';

        if (!email || !isValidEmail(email)) {
          setFieldError('reset-email', translations[currentLang].errEmailRequired);
          return;
        }

        submitBtn.classList.add('loading');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        const originalText = btnText ? btnText.textContent : '';

        if (btnText) {
          btnText.innerHTML = `<span class="btn-spinner"></span>${currentLang === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...'}`;
        }
        if (btnIcon) btnIcon.style.display = 'none';

        const mod = window.FirebaseModule;
        if (mod && mod.auth && mod.sendPasswordResetEmail) {
          mod.sendPasswordResetEmail(mod.auth, email)
            .then(() => {
              submitBtn.classList.remove('loading');
              if (btnText) btnText.textContent = originalText;
              if (btnIcon) btnIcon.style.display = 'inline-block';
              switchAuthTab('login');
              showAlert(translations[currentLang].msgResetSuccess, 'success');
            })
            .catch((error) => {
              submitBtn.classList.remove('loading');
              if (btnText) btnText.textContent = originalText;
              if (btnIcon) btnIcon.style.display = 'inline-block';
              showAlert(getFirebaseErrorMessage(error.code), 'error');
            });
        }
      });
    }

    function initGoogleAuth() {
      const customLoginBtn = document.getElementById('custom-google-login-btn');
      const customRegBtn = document.getElementById('custom-google-reg-btn');

      function triggerGoogleSignIn() {
        const mod = window.FirebaseModule;
        if (mod && mod.auth && mod.GoogleAuthProvider && mod.signInWithPopup) {
          const provider = new mod.GoogleAuthProvider();
          mod.signInWithPopup(mod.auth, provider)
            .then(() => {
              showAlert(translations[currentLang].msgGoogleAuthSuccess, 'success');
            })
            .catch((error) => {
              if (error.code !== 'auth/popup-closed-by-user') {
                showAlert(getFirebaseErrorMessage(error.code), 'error');
              } else {
                showAlert(translations[currentLang].errPopupClosed, 'error');
              }
            });
        }
      }

      if (customLoginBtn) customLoginBtn.addEventListener('click', triggerGoogleSignIn);
      if (customRegBtn) customRegBtn.addEventListener('click', triggerGoogleSignIn);
    }

    initGoogleAuth();
  }

  /* --------------------------------------------------------------------------
     9b. Global Firebase Auth State Observer & Nav Updates
     -------------------------------------------------------------------------- */
  function initFirebaseAuthObserver() {
    const userDashView = document.getElementById('dashboard-user-view');
    const authCardContainer = document.getElementById('auth-card-container');
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const forgotForm = document.getElementById('forgot-form');
    const tabsWrapper = document.getElementById('auth-tabs-wrapper');
    const infoNotice = document.getElementById('auth-info-notice');

    let authLoader = document.getElementById('auth-loading-overlay');
    if (!authLoader && authCardContainer) {
      authLoader = document.createElement('div');
      authLoader.id = 'auth-loading-overlay';
      authLoader.style.cssText = 'text-align: center; padding: 2.5rem 1rem; font-size: 1.1rem; color: var(--accent-blue); font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.75rem;';
      authLoader.innerHTML = `<span class="btn-spinner" style="width: 22px; height: 22px; border-width: 3px;"></span> <span>${currentLang === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</span>`;
      authCardContainer.insertBefore(authLoader, authCardContainer.firstChild);

      if (loginForm) loginForm.style.display = 'none';
      if (regForm) regForm.style.display = 'none';
      if (forgotForm) forgotForm.style.display = 'none';
      if (tabsWrapper) tabsWrapper.style.display = 'none';
      if (infoNotice) infoNotice.style.display = 'none';
      if (userDashView) userDashView.style.display = 'none';
    }

    let checkAttempts = 0;
    function checkFirebaseModule() {
      const mod = window.FirebaseModule;
      if (mod && mod.auth && mod.onAuthStateChanged) {
        mod.onAuthStateChanged(mod.auth, (user) => {
          if (authLoader) authLoader.style.display = 'none';

          const accountNavSpans = document.querySelectorAll('.nav-menu [data-i18n="navAccount"]');
          const accountSubEl = document.querySelector('[data-i18n="accountSub"]');

          if (user) {
            window.currentUserState = user;
            const userName = user.displayName || (user.email ? user.email.split('@')[0] : 'User');

            accountNavSpans.forEach(span => { span.textContent = userName; });

            if (accountSubEl) accountSubEl.textContent = translations[currentLang].accountSubLoggedIn;

            if (userDashView) {
              const nameEl = document.getElementById('user-display-name');
              const emailEl = document.getElementById('user-display-email');
              const avatarEl = document.getElementById('user-avatar-img');
              const avatarInitialEl = document.getElementById('user-avatar-initial');

              const displayName = user.displayName || user.email || 'SHAFAET HOSSEN SARIP';
              if (nameEl) nameEl.textContent = displayName;
              if (emailEl) emailEl.textContent = user.email || '';

              const firstChar = displayName.trim().charAt(0).toUpperCase() || 'S';

              if (user.photoURL) {
                if (avatarEl) {
                  avatarEl.src = user.photoURL;
                  avatarEl.style.display = 'block';
                  avatarEl.onerror = () => {
                    avatarEl.style.display = 'none';
                    if (avatarInitialEl) {
                      avatarInitialEl.textContent = firstChar;
                      avatarInitialEl.style.display = 'flex';
                    }
                  };
                }
                if (avatarInitialEl) avatarInitialEl.style.display = 'none';
              } else {
                if (avatarEl) avatarEl.style.display = 'none';
                if (avatarInitialEl) {
                  avatarInitialEl.textContent = firstChar;
                  avatarInitialEl.style.display = 'flex';
                }
              }

              if (loginForm) loginForm.style.display = 'none';
              if (regForm) regForm.style.display = 'none';
              if (forgotForm) forgotForm.style.display = 'none';
              if (tabsWrapper) tabsWrapper.style.display = 'none';
              if (infoNotice) infoNotice.style.display = 'none';

              userDashView.style.display = 'block';
            }

            // Sync Settings Page Account View
            updateSettingsAccountView(user);
          } else {
            window.currentUserState = null;
            accountNavSpans.forEach(span => { span.textContent = translations[currentLang].navAccount; });

            if (accountSubEl) accountSubEl.textContent = translations[currentLang].accountSub;

            if (userDashView) {
              userDashView.style.display = 'none';
              if (infoNotice) infoNotice.style.display = 'flex';
              if (tabsWrapper) tabsWrapper.style.display = 'flex';

              const activeTab = authCardContainer ? authCardContainer.getAttribute('data-active-tab') : 'register';
              if (activeTab === 'login') {
                if (loginForm) loginForm.style.display = 'flex';
                if (regForm) regForm.style.display = 'none';
              } else {
                if (regForm) regForm.style.display = 'flex';
                if (loginForm) loginForm.style.display = 'none';
              }
            }

            // Sync Settings Page Account View
            updateSettingsAccountView(null);
          }
        });
      } else {
        checkAttempts++;
        if (checkAttempts > 40) {
          if (authLoader) authLoader.style.display = 'none';
          if (infoNotice) infoNotice.style.display = 'flex';
          if (tabsWrapper) tabsWrapper.style.display = 'flex';
          return;
        }
        setTimeout(checkFirebaseModule, 50);
      }
    }

    checkFirebaseModule();
  }

  /* Helper to update account view on settings.html */
  function updateSettingsAccountView(user) {
    const loggedInBox = document.getElementById('settings-account-logged-in');
    const loggedOutBox = document.getElementById('settings-account-logged-out');

    if (!loggedInBox || !loggedOutBox) return;

    if (user) {
      loggedOutBox.style.display = 'none';
      loggedInBox.style.display = 'block';

      const nameEl = document.getElementById('settings-user-name');
      const emailEl = document.getElementById('settings-user-email');
      const photoEl = document.getElementById('settings-user-photo');

      if (nameEl) nameEl.textContent = user.displayName || 'Client User';
      if (emailEl) emailEl.textContent = user.email || '';
      if (photoEl) photoEl.src = user.photoURL || 'profile.jpg';
    } else {
      loggedInBox.style.display = 'none';
      loggedOutBox.style.display = 'block';
    }
  }

  /* --------------------------------------------------------------------------
     10. Custom Project Request Form Handlers
     -------------------------------------------------------------------------- */
  function initStartProjectForm() {
    const form = document.getElementById('start-project-form');
    if (!form) return;

    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const typeSelect = document.getElementById('project-req-type');

    if (typeSelect && serviceParam) {
      if (serviceParam === 'others') {
        typeSelect.value = 'others';
      } else if (typeSelect.querySelector(`option[value="${serviceParam}"]`)) {
        typeSelect.value = serviceParam;
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('project-req-name')?.value.trim() || '';
      const contact = document.getElementById('project-req-contact')?.value.trim() || '';
      const type = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : 'Custom Project';
      const budget = document.getElementById('project-req-budget')?.value || 'Flexible';
      const desc = document.getElementById('project-req-desc')?.value.trim() || '';

      const waMessage = `*New Custom Project Request — WebWorldBD*\n\n` +
        `*Name:* ${name}\n` +
        `*Contact:* ${contact}\n` +
        `*Project Type:* ${type}\n` +
        `*Budget:* ${budget}\n` +
        `*Requirements:* ${desc}`;

      const waUrl = `https://wa.me/8801342697743?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  /* --------------------------------------------------------------------------
     11. Dedicated Settings Page Logic
     -------------------------------------------------------------------------- */
  function initSettingsPage() {
    if (!document.getElementById('card-appearance')) return;

    // Appearance Theme Radios
    const themeRadios = document.querySelectorAll('input[name="theme-radio"]');
    themeRadios.forEach(radio => {
      radio.checked = (radio.value === currentTheme);
      radio.addEventListener('change', () => {
        applyTheme(radio.value);
      });
    });

    // Appearance Language Radios
    const langRadios = document.querySelectorAll('input[name="lang-radio"]');
    langRadios.forEach(radio => {
      radio.checked = (radio.value === currentLang);
      radio.addEventListener('change', () => {
        applyLanguage(radio.value);
      });
    });

    // Notifications Switches
    const notifProjectSwitch = document.getElementById('notif-project-switch');
    const notifPromoSwitch = document.getElementById('notif-promo-switch');

    if (notifProjectSwitch) {
      notifProjectSwitch.checked = localStorage.getItem('webworldbd_notif_project') !== 'false';
      notifProjectSwitch.addEventListener('change', () => {
        localStorage.setItem('webworldbd_notif_project', notifProjectSwitch.checked);
      });
    }

    if (notifPromoSwitch) {
      notifPromoSwitch.checked = localStorage.getItem('webworldbd_notif_promo') === 'true';
      notifPromoSwitch.addEventListener('change', () => {
        localStorage.setItem('webworldbd_notif_promo', notifPromoSwitch.checked);
      });
    }

    // Clear Cache Button
    const clearCacheBtn = document.getElementById('btn-clear-cache');
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', () => {
        const confirmMsg = currentLang === 'bn'
          ? 'আপনি কি নিশ্চিত যে আপনার লোকাল প্রেফারেন্স ও ক্যাশ পরিষ্কার করতে চান?'
          : 'Are you sure you want to clear your local preferences and cache?';

        if (confirm(confirmMsg)) {
          localStorage.removeItem('webworldbd_theme');
          localStorage.removeItem('webworldbd_lang');
          localStorage.removeItem('webworldbd_notif_project');
          localStorage.removeItem('webworldbd_notif_promo');

          applyTheme('dark');
          applyLanguage('en');

          alert(translations[currentLang].msgCacheCleared || 'Cache cleared successfully!');
        }
      });
    }

    // Modal Triggers & Controls
    const editProfileBtn = document.getElementById('btn-edit-profile');
    const changePassBtn = document.getElementById('btn-change-password');
    const deleteAccountBtn = document.getElementById('btn-delete-account');
    const logoutSettingsBtn = document.getElementById('btn-logout-settings');

    const editProfileModal = document.getElementById('modal-edit-profile');
    const changePassModal = document.getElementById('modal-change-password');
    const deleteAccountModal = document.getElementById('modal-delete-account');

    function closeModal(modal) {
      if (modal) modal.classList.remove('active');
    }

    document.querySelectorAll('.btn-modal-cancel').forEach(btn => {
      btn.addEventListener('click', () => {
        closeModal(editProfileModal);
        closeModal(changePassModal);
        closeModal(deleteAccountModal);
      });
    });

    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', () => {
        const user = window.currentUserState;
        if (!user) return;
        document.getElementById('edit-profile-name').value = user.displayName || '';
        document.getElementById('edit-profile-photo').value = user.photoURL || '';
        editProfileModal.classList.add('active');
      });
    }

    if (changePassBtn) {
      changePassBtn.addEventListener('click', () => {
        changePassModal.classList.add('active');
      });
    }

    if (deleteAccountBtn) {
      deleteAccountBtn.addEventListener('click', () => {
        deleteAccountModal.classList.add('active');
      });
    }

    if (logoutSettingsBtn) {
      logoutSettingsBtn.addEventListener('click', () => {
        const mod = window.FirebaseModule;
        if (mod && mod.auth && mod.signOut) {
          mod.signOut(mod.auth).then(() => {
            alert(currentLang === 'bn' ? 'সফলভাবে লগআউট করা হয়েছে।' : 'Logged out successfully.');
          });
        }
      });
    }

    // Edit Profile Form Submit
    const formEditProfile = document.getElementById('form-edit-profile');
    if (formEditProfile) {
      formEditProfile.addEventListener('submit', (e) => {
        e.preventDefault();
        const mod = window.FirebaseModule;
        const user = window.currentUserState;
        if (!mod || !user || !mod.updateProfile) return;

        const newName = document.getElementById('edit-profile-name').value.trim();
        const newPhoto = document.getElementById('edit-profile-photo').value.trim();

        mod.updateProfile(user, {
          displayName: newName,
          photoURL: newPhoto || null
        }).then(() => {
          closeModal(editProfileModal);
          updateSettingsAccountView(user);
          alert(translations[currentLang].msgProfileUpdated);
        }).catch(err => {
          alert(err.message);
        });
      });
    }

    // Change Password Form Submit
    const formChangePassword = document.getElementById('form-change-password');
    if (formChangePassword) {
      formChangePassword.addEventListener('submit', (e) => {
        e.preventDefault();
        const mod = window.FirebaseModule;
        const user = window.currentUserState;
        if (!mod || !user || !mod.updatePassword) return;

        const oldPass = document.getElementById('change-pass-old').value;
        const newPass = document.getElementById('change-pass-new').value;
        const confirmPass = document.getElementById('change-pass-confirm').value;

        if (newPass !== confirmPass) {
          alert(translations[currentLang].errPasswordMismatch);
          return;
        }

        if (mod.EmailAuthProvider && mod.reauthenticateWithCredential) {
          const cred = mod.EmailAuthProvider.credential(user.email, oldPass);
          mod.reauthenticateWithCredential(user, cred)
            .then(() => mod.updatePassword(user, newPass))
            .then(() => {
              closeModal(changePassModal);
              document.getElementById('change-pass-old').value = '';
              document.getElementById('change-pass-new').value = '';
              document.getElementById('change-pass-confirm').value = '';
              alert(translations[currentLang].msgPasswordChanged);
            })
            .catch(err => {
              alert(err.message || translations[currentLang].errWrongPassword);
            });
        } else {
          mod.updatePassword(user, newPass)
            .then(() => {
              closeModal(changePassModal);
              alert(translations[currentLang].msgPasswordChanged);
            })
            .catch(err => alert(err.message));
        }
      });
    }

    // Delete Account Form Submit
    const formDeleteAccount = document.getElementById('form-delete-account');
    if (formDeleteAccount) {
      formDeleteAccount.addEventListener('submit', (e) => {
        e.preventDefault();
        const mod = window.FirebaseModule;
        const user = window.currentUserState;
        if (!mod || !user || !mod.deleteUser) return;

        const pass = document.getElementById('delete-pass-confirm').value;

        if (mod.EmailAuthProvider && mod.reauthenticateWithCredential) {
          const cred = mod.EmailAuthProvider.credential(user.email, pass);
          mod.reauthenticateWithCredential(user, cred)
            .then(() => mod.deleteUser(user))
            .then(() => {
              closeModal(deleteAccountModal);
              alert(translations[currentLang].msgAccountDeleted);
            })
            .catch(err => alert(err.message || translations[currentLang].errWrongPassword));
        } else {
          mod.deleteUser(user)
            .then(() => {
              closeModal(deleteAccountModal);
              alert(translations[currentLang].msgAccountDeleted);
            })
            .catch(err => alert(err.message));
        }
      });
    }
  }
});
