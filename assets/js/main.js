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
  initBackToTop();
  initContactForm();

  // Dynamic Content Rendering
  if (document.getElementById('services-grid')) renderServices();
  if (document.getElementById('capabilities-grid')) renderCapabilities();
  if (document.getElementById('projects-grid')) {
    renderProjects('all', '');
    initProjectFiltersAndSearch();
  }
  if (document.getElementById('testimonials-grid')) renderTestimonials();
  if (document.getElementById('faq-accordion')) renderFAQs();
  if (document.getElementById('project-detail-content')) initProjectDetailsPage();

  /* --------------------------------------------------------------------------
     2. Theme & Language Functions
     -------------------------------------------------------------------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('webworldbd_theme', theme);
    currentTheme = theme;

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
      themeToggleBtn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
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

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('webworldbd_lang', lang);

    if (lang === 'bn') {
      document.body.classList.add('lang-bn');
    } else {
      document.body.classList.remove('lang-bn');
    }

    // Update text elements with data-i18n attribute
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translations[lang][key];
        } else {
          el.textContent = translations[lang][key];
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

    // Re-render dynamic sections if present
    if (document.getElementById('services-grid')) renderServices();
    if (document.getElementById('capabilities-grid')) renderCapabilities();
    if (document.getElementById('projects-grid')) {
      const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
      const searchVal = document.getElementById('project-search-input')?.value || '';
      renderProjects(activeFilter, searchVal);
    }
    if (document.getElementById('testimonials-grid')) renderTestimonials();
    if (document.getElementById('faq-accordion')) renderFAQs();
    if (document.getElementById('project-detail-content')) initProjectDetailsPage();
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

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.toggle('fa-bars');
          icon.classList.toggle('fa-times');
        }
      });

      // Close menu when clicking links
      navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          const icon = mobileToggle.querySelector('i');
          if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
          }
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
          navMenu.classList.remove('active');
          const icon = mobileToggle.querySelector('i');
          if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
          }
        }
      });
    }
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
        ctx.fillStyle = currentTheme === 'dark'
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

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target') || '0', 10);
          const suffix = entry.target.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 600;
          const stepTime = 20;
          const increment = Math.ceil(target / (duration / stepTime));

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
    }, { threshold: 0.2 });

    counterEls.forEach(el => observer.observe(el));
  }

  /* --------------------------------------------------------------------------
     6. Dynamic Content Renderers
     -------------------------------------------------------------------------- */
  function renderServices() {
    const container = document.getElementById('services-grid');
    if (!container) return;

    container.innerHTML = portfolioData.services.map(s => `
      <div class="glass-card service-card">
        <div>
          <div class="service-icon"><i class="fas fa-laptop-code"></i></div>
          <h3>${currentLang === 'bn' ? s.title_bn : s.title_en}</h3>
          <p>${currentLang === 'bn' ? s.desc_bn : s.desc_en}</p>
        </div>
        <div class="service-price">
          <span>${translations[currentLang].startingFrom}</span>
          <span>${currentLang === 'bn' ? s.price_bn : s.price_en}</span>
        </div>
      </div>
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

  function renderTestimonials() {
    const container = document.getElementById('testimonials-grid');
    if (!container) return;

    container.innerHTML = portfolioData.testimonials.map(t => `
      <div class="glass-card" style="padding: 2rem;">
        <div style="color: var(--accent-orange); margin-bottom: 1rem;">
          <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
        </div>
        <p style="color: var(--text-muted); font-style: italic; margin-bottom: 1.5rem; font-size: 0.95rem;">
          "${currentLang === 'bn' ? t.text_bn : t.text_en}"
        </p>
        <div>
          <h4 style="font-size: 1.05rem; font-weight: 700;">${currentLang === 'bn' ? t.name_bn : t.name_en}</h4>
          <span style="font-size: 0.85rem; color: var(--accent-blue);">${currentLang === 'bn' ? t.role_bn : t.role_en}</span>
        </div>
      </div>
    `).join('');
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

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value;
      const email = document.getElementById('form-email')?.value;
      const message = document.getElementById('form-message')?.value;

      if (!name || !email || !message) {
        alert(currentLang === 'bn' ? 'অনুগ্রহ করে সকল তথ্য পূরণ করুন।' : 'Please fill in all required fields.');
        return;
      }

      alert(currentLang === 'bn'
        ? 'ধন্যবাদ! আপনার মেসেজটি সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।'
        : 'Thank you! Your message has been sent successfully. I will get back to you shortly.');

      form.reset();
    });
  }
});
