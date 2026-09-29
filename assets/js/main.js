/* ==========================================================================
   WebWorldBD - Main Application Script
   Author: SHAFAET HOSSEN SARIP (WebWorldBD)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  let currentTheme = localStorage.getItem('webworldbd_theme') || 'dark';
  let currentLang = localStorage.getItem('webworldbd_lang') || 'en';

  applyTheme(currentTheme);
  applyLanguage(currentLang);

  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'webworldbd-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `webworldbd-toast toast-${type}`;

    let iconClass = 'fas fa-circle-info';
    if (type === 'success') iconClass = 'fas fa-circle-check';
    if (type === 'error') iconClass = 'fas fa-circle-exclamation';

    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 300);
    }, 3500);
  }
  window.showToast = showToast;

  initHeader();
  initThemeToggle();
  initLangSwitch();
  initThreeDotsMenu();
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
  initDashboardUI();
  initAdminDashboardUI();

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
      themeToggleBtn.innerHTML = effectiveTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }

    if (window.refreshThreeDotsMenu) window.refreshThreeDotsMenu();
  }

  function getNormalizedPath() {
    let path = window.location.pathname.toLowerCase();
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    if (path.endsWith('.html')) path = path.slice(0, -5);
    if (path.endsWith('/index')) path = path.slice(0, -6);
    else if (path === '/index') path = '';
    return path === '' || path === '/' ? '/' : path;
  }

  function initThreeDotsMenu() {
    const btn = document.getElementById('nav-three-dots-btn');
    if (!btn) return;

    const isSubdir = window.location.pathname.includes('/services/');
    const p = isSubdir ? '../' : '';

    let container = btn.parentElement;
    if (!container.classList.contains('three-dots-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'three-dots-wrapper';
      container.insertBefore(wrapper, btn);
      wrapper.appendChild(btn);
      container = wrapper;
    }

    let menuEl = document.getElementById('three-dots-menu');
    if (!menuEl) {
      menuEl = document.createElement('div');
      menuEl.id = 'three-dots-menu';
      menuEl.className = 'three-dots-dropdown-menu';
      container.appendChild(menuEl);
    }

    function renderMenuContent() {
      const user = window.currentUserState;
      const isLoggedIn = !!user;

      const group1 = [
        { id: 'home', url: `${p}index.html`, icon: 'fas fa-house', i18nKey: 'menuHome' },
        { id: 'services', url: `${p}services.html`, icon: 'fas fa-layer-group', i18nKey: 'menuServices' },
        { id: 'start-project', url: `${p}start-project.html`, icon: 'fas fa-rocket', i18nKey: 'menuStartProject' },
        { id: 'projects', url: `${p}projects.html`, icon: 'fas fa-desktop', i18nKey: 'menuLivePreview' },
        { id: 'connect', url: `${p}contact.html`, icon: 'fas fa-link', i18nKey: 'menuConnect' },
        { id: 'dashboard', url: `${p}dashboard.html`, icon: 'fas fa-chart-pie', i18nKey: 'menuDashboard' },
        { id: 'admin', url: `${p}admin.html`, icon: 'fas fa-user-shield', i18nKey: 'menuAdmin' },
        { id: 'settings', url: `${p}settings.html`, icon: 'fas fa-gear', i18nKey: 'menuSettings' },
        { id: 'theme', action: 'theme', icon: currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun', i18nKey: 'menuTheme' },
        { id: 'language', action: 'language', icon: 'fas fa-globe', i18nKey: 'menuLanguage' }
      ];

      const group2 = [
        isLoggedIn
          ? { id: 'profile', url: `${p}account.html`, icon: 'fas fa-user-gear', i18nKey: 'menuProfile' }
          : { id: 'about', url: `${p}index.html#about`, icon: 'fas fa-user', i18nKey: 'menuAbout' },
        { id: 'why', url: `${p}why-choose-me.html`, icon: 'fas fa-shield-halved', i18nKey: 'menuWhy' },
        { id: 'process', url: `${p}process.html`, icon: 'fas fa-list-check', i18nKey: 'menuProcess' },
        { id: 'faq', url: `${p}faq.html`, icon: 'fas fa-circle-question', i18nKey: 'menuFaq' },
        { id: 'shopping-now', url: 'https://shs-bazar.pages.dev/', icon: 'fas fa-cart-shopping', i18nKey: 'menuShoppingNow', external: true },
        { id: 'student-tools-ai', url: 'https://student-tools-ai.pages.dev/', icon: 'fas fa-graduation-cap', i18nKey: 'menuStudentToolsAi', external: true }
      ];

      const group3 = [
        isLoggedIn
          ? { id: 'logout', action: 'logout', icon: 'fas fa-right-from-bracket', i18nKey: 'menuLogout' }
          : { id: 'account-auth', url: `${p}account.html`, icon: 'fas fa-right-to-bracket', i18nKey: 'menuLoginRegister' }
      ];

      let html = '';

      if (isLoggedIn) {
        const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'Client User');
        const displayEmail = user.email || '';
        const firstChar = (displayName.trim().charAt(0) || 'U').toUpperCase();

        let avatarHtml = `<div class="three-dots-avatar-initial">${firstChar}</div>`;
        if (user.photoURL) {
          avatarHtml = `<img src="${user.photoURL}" alt="${displayName}" class="three-dots-avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><div class="three-dots-avatar-initial" style="display:none;">${firstChar}</div>`;
        }

        html += `
          <a href="${p}account.html" class="three-dots-user-header">
            <div class="three-dots-user-avatar">${avatarHtml}</div>
            <div class="three-dots-user-info">
              <span class="three-dots-user-name">${displayName}</span>
              <span class="three-dots-user-email">${displayEmail}</span>
            </div>
          </a>
        `;
      }

      function renderGroupHtml(items) {
        return items.map(item => {
          const label = translations[currentLang] && translations[currentLang][item.i18nKey]
            ? translations[currentLang][item.i18nKey]
            : (item.id === 'dashboard' ? (currentLang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard') : (item.id === 'admin' ? 'Admin Panel' : ''));

          if (item.action === 'logout') {
            return `
              <button type="button" class="three-dots-menu-item three-dots-logout-btn" data-menu-id="${item.id}">
                <div class="three-dots-icon-box"><i class="${item.icon} three-dots-menu-icon"></i></div>
                <span>${label}</span>
              </button>
            `;
          }

          if (item.action === 'theme') {
            return `
              <button type="button" class="three-dots-menu-item three-dots-theme-btn" data-menu-id="${item.id}">
                <div class="three-dots-icon-box"><i class="${item.icon} three-dots-menu-icon"></i></div>
                <span>${label}</span>
              </button>
            `;
          }

          if (item.action === 'language') {
            return `
              <button type="button" class="three-dots-menu-item three-dots-lang-btn" data-menu-id="${item.id}">
                <div class="three-dots-icon-box"><i class="${item.icon} three-dots-menu-icon"></i></div>
                <span>${label}</span>
              </button>
            `;
          }

          const targetAttr = item.external ? 'target="_blank" rel="noopener noreferrer"' : '';
          return `
            <a href="${item.url}" ${targetAttr} class="three-dots-menu-item" data-menu-id="${item.id}">
              <div class="three-dots-icon-box"><i class="${item.icon} three-dots-menu-icon"></i></div>
              <span>${label}</span>
            </a>
          `;
        }).join('');
      }

      html += `<div class="three-dots-group">${renderGroupHtml(group1)}</div>`;
      html += `<div class="three-dots-menu-divider"></div>`;
      html += `<div class="three-dots-group">${renderGroupHtml(group2)}</div>`;
      html += `<div class="three-dots-menu-divider"></div>`;
      html += `<div class="three-dots-group">${renderGroupHtml(group3)}</div>`;

      menuEl.innerHTML = html;
      attachMenuClickListeners();
    }

    function attachMenuClickListeners() {
      menuEl.querySelectorAll('a.three-dots-menu-item').forEach(a => a.addEventListener('click', closeMenu));

      const themeBtn = menuEl.querySelector('.three-dots-theme-btn');
      if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
      }

      const langBtn = menuEl.querySelector('.three-dots-lang-btn');
      if (langBtn) {
        langBtn.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          applyLanguage(currentLang === 'en' ? 'bn' : 'en');
        });
      }

      const logoutBtn = menuEl.querySelector('.three-dots-logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault(); closeMenu();
          window.currentUserState = null;
          if (window.refreshThreeDotsMenu) window.refreshThreeDotsMenu();
          const mod = window.FirebaseModule;
          if (mod && mod.auth && mod.signOut) {
            mod.signOut(mod.auth).then(() => {
              if (window.showToast) window.showToast('Logged out successfully', 'info');
            });
          }
        });
      }
    }

    renderMenuContent();
    window.refreshThreeDotsMenu = renderMenuContent;

    function toggleMenu(e) {
      if (e) e.stopPropagation();
      if (menuEl.classList.contains('active')) closeMenu();
      else openMenu();
    }

    function openMenu() {
      menuEl.classList.add('active');
      btn.classList.add('active');
    }

    function closeMenu() {
      menuEl.classList.remove('active');
      btn.classList.remove('active');
    }

    btn.addEventListener('click', toggleMenu);
    document.addEventListener('click', (e) => {
      if (menuEl.classList.contains('active') && !container.contains(e.target)) closeMenu();
    });
  }

  function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => applyTheme(currentTheme === 'dark' ? 'light' : 'dark'));
    }
  }

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('webworldbd_lang', lang);

    if (lang === 'bn') document.body.classList.add('lang-bn');
    else document.body.classList.remove('lang-bn');

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

    const langSwitchBtn = document.getElementById('lang-switch-btn');
    if (langSwitchBtn) {
      langSwitchBtn.innerHTML = lang === 'en' ? '<i class="fas fa-globe"></i> BN' : '<i class="fas fa-globe"></i> EN';
    }

    if (window.refreshThreeDotsMenu) window.refreshThreeDotsMenu();
  }

  function initLangSwitch() {
    const langSwitchBtn = document.getElementById('lang-switch-btn');
    if (langSwitchBtn) {
      langSwitchBtn.addEventListener('click', () => applyLanguage(currentLang === 'en' ? 'bn' : 'en'));
    }
  }

  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
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
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      navMenu.classList.remove('active');
      if (mobileToggle) mobileToggle.classList.remove('active');
      if (navBackdrop) navBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) closeMenu();
      else openMenu();
    });

    if (navBackdrop) navBackdrop.addEventListener('click', closeMenu);
    navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }

  function initMobileBottomNav() {
    const mobileNav = document.getElementById('mobile-bottom-nav');
    if (!mobileNav) return;
    const normPath = getNormalizedPath();

    mobileNav.querySelectorAll('.mobile-nav-item').forEach(item => {
      item.classList.remove('active');
      if (normPath === '/' && item.dataset.nav === 'home') item.classList.add('active');
      else if (normPath === '/services' && item.dataset.nav === 'services') item.classList.add('active');
      else if (normPath === '/start-project' && item.dataset.nav === 'fab') item.classList.add('active');
      else if (normPath === '/projects' && item.dataset.nav === 'projects') item.classList.add('active');
      else if (normPath === '/contact' && item.dataset.nav === 'connect') item.classList.add('active');
    });
  }

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
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  function initCounters() {
    const counterEls = document.querySelectorAll('.counter');
    if (counterEls.length === 0) return;
    counterEls.forEach(el => {
      const target = el.getAttribute('data-target') || '0';
      const suffix = el.getAttribute('data-suffix') || '';
      el.textContent = target + suffix;
    });
  }

  function renderServices() {
    const container = document.getElementById('services-grid');
    if (!container) return;
    container.innerHTML = portfolioData.services.map(s => `
      <a href="services/${s.slug}.html" class="service-row-item">
        <div class="service-row-left">
          <div class="service-row-icon"><i class="${s.icon || 'fas fa-laptop-code'}"></i></div>
          <h3 class="service-row-title">${currentLang === 'bn' ? s.title_bn : s.title_en}</h3>
        </div>
        <div class="service-row-arrow"><i class="fas fa-chevron-right"></i></div>
      </a>
    `).join('');
  }

  function renderCapabilities() {
    const container = document.getElementById('capabilities-grid');
    if (!container) return;
    container.innerHTML = portfolioData.capabilities.map(cap => `
      <div class="cap-tag"><i class="fas fa-check-circle" style="color:var(--accent-blue); margin-right:6px;"></i>${currentLang === 'bn' ? cap.bn : cap.en}</div>
    `).join('');
  }

  function renderProjects(filterCategory = 'all', searchQuery = '') {
    const container = document.getElementById('projects-grid');
    if (!container) return;
    let filtered = portfolioData.projects;

    if (filterCategory !== 'all') filtered = filtered.filter(p => p.category === filterCategory);
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.short_desc_en.toLowerCase().includes(q));
    }

    container.innerHTML = filtered.map(p => `
      <div class="glass-card project-card">
        <div class="project-info">
          <span class="project-category">${currentLang === 'bn' ? p.categoryName_bn : p.categoryName_en}</span>
          <h3>${p.title}</h3>
          <p>${currentLang === 'bn' ? p.short_desc_bn : p.short_desc_en}</p>
          <div class="project-techs">${p.techs.map(t => `<span class="tech-badge">${t}</span>`).join('')}</div>
          <div class="project-actions">
            <a href="project-details.html?id=${p.id}" class="btn btn-secondary" style="width:100%;">View Details <i class="fas fa-arrow-right"></i></a>
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
        renderProjects(btn.dataset.filter || 'all', searchInput ? searchInput.value : '');
      });
    });
    if (searchInput) searchInput.addEventListener('input', (e) => {
      const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
      renderProjects(activeFilter, e.target.value);
    });
  }

  function renderFAQs() {
    const container = document.getElementById('faq-accordion');
    if (!container) return;
    container.innerHTML = portfolioData.faqs.map((faq, index) => `
      <div class="glass-card faq-item ${index === 0 ? 'active' : ''}">
        <div class="faq-question"><span>${currentLang === 'bn' ? faq.q_bn : faq.q_en}</span><i class="fas fa-chevron-down"></i></div>
        <div class="faq-answer"><p>${currentLang === 'bn' ? faq.a_bn : faq.a_en}</p></div>
      </div>
    `).join('');
    initAccordion();
  }

  function initAccordion() {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  }

  function initProjectDetailsPage() {
    const container = document.getElementById('project-detail-content');
    if (!container) return;
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id') || 'shs-bazar';
    const project = portfolioData.projects.find(p => p.id === projectId) || portfolioData.projects[0];

    container.innerHTML = `
      <div class="glass-card" style="padding: 2.5rem; margin-bottom: 3rem;">
        <h1 style="font-size: 2.5rem; font-weight: 800;">${project.title}</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; margin-top: 1rem;">${currentLang === 'bn' ? project.full_desc_bn : project.full_desc_en}</p>
        <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="margin-top: 1.5rem;"><i class="fas fa-external-link-alt"></i> Live Preview</a>
      </div>
    `;
  }

  function initServiceDetailPage() {
    const container = document.getElementById('service-detail-app');
    if (!container) return;
    const attrSlug = container.getAttribute('data-service-slug');
    const service = portfolioData.services.find(s => s.slug === attrSlug || s.id === attrSlug) || portfolioData.services[0];

    container.innerHTML = `
      <div class="glass-card" style="padding: 2.5rem;">
        <h1 style="font-size: 2.2rem; font-weight: 800;">${currentLang === 'bn' ? service.title_bn : service.title_en}</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; margin-top: 1rem;">${currentLang === 'bn' ? service.overview_bn : service.overview_en}</p>
        <a href="../start-project.html?service=${service.slug}" class="btn btn-primary" style="margin-top: 1.5rem;"><i class="fas fa-rocket"></i> Start Project Now</a>
      </div>
    `;
  }

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

  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) btn.classList.add('visible');
      else btn.classList.remove('visible');
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function initSettingsPage() {}

  function initAuthTabs() {
    const authCardContainer = document.getElementById('auth-card-container');
    if (!authCardContainer) return;
    const loginTabBtn = document.getElementById('tab-btn-login');
    const regTabBtn = document.getElementById('tab-btn-register');
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');

    if (loginTabBtn && regTabBtn) {
      loginTabBtn.addEventListener('click', () => {
        loginTabBtn.classList.add('active'); regTabBtn.classList.remove('active');
        if (loginForm) loginForm.style.display = 'flex';
        if (regForm) regForm.style.display = 'none';
      });
      regTabBtn.addEventListener('click', () => {
        regTabBtn.classList.add('active'); loginTabBtn.classList.remove('active');
        if (regForm) regForm.style.display = 'flex';
        if (loginForm) loginForm.style.display = 'none';
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email')?.value.trim();
        const pass = document.getElementById('login-password')?.value;
        const mod = window.FirebaseModule;
        if (mod && mod.auth && mod.signInWithEmailAndPassword) {
          mod.signInWithEmailAndPassword(mod.auth, email, pass).then(() => {
            showToast('Logged in successfully', 'success');
            if (email === 'saripofficialsupport@gmail.com') {
              window.location.href = 'admin.html';
            } else {
              window.location.href = 'dashboard.html';
            }
          }).catch(err => showToast(err.message, 'error'));
        }
      });
    }

    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name')?.value.trim();
        const email = document.getElementById('reg-email')?.value.trim();
        const pass = document.getElementById('reg-password')?.value;
        const mod = window.FirebaseModule;
        if (mod && mod.auth && mod.createUserWithEmailAndPassword) {
          mod.createUserWithEmailAndPassword(mod.auth, email, pass).then((cred) => {
            if (mod.updateProfile) mod.updateProfile(cred.user, { displayName: name });
            showToast('Account created successfully', 'success');
            window.location.href = 'dashboard.html';
          }).catch(err => showToast(err.message, 'error'));
        }
      });
    }
  }

  function initFirebaseAuthObserver() {
    let checkAttempts = 0;
    function checkModule() {
      const mod = window.FirebaseModule;
      if (mod && mod.auth && mod.onAuthStateChanged) {
        mod.onAuthStateChanged(mod.auth, (user) => {
          window.currentUserState = user;
          if (window.refreshThreeDotsMenu) window.refreshThreeDotsMenu();
        });
      } else {
        checkAttempts++;
        if (checkAttempts < 100) setTimeout(checkModule, 50);
      }
    }
    checkModule();
  }

  function initStartProjectForm() {
    const form = document.getElementById('start-project-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('project-req-name')?.value.trim();
      const contact = document.getElementById('project-req-contact')?.value.trim();
      const type = document.getElementById('project-req-type')?.value;
      const budget = document.getElementById('project-req-budget')?.value;
      const desc = document.getElementById('project-req-desc')?.value.trim();

      const reqId = `REQ-${Date.now().toString().slice(-6)}`;
      const user = window.currentUserState;

      const mod = window.FirebaseModule;
      if (mod && mod.db && mod.collection && mod.addDoc) {
        try {
          await mod.addDoc(mod.collection(mod.db, 'projectRequests'), {
            id: reqId,
            userId: user ? user.uid : 'guest',
            userEmail: user ? user.email : contact,
            userName: name,
            projectName: `${type} Project`,
            serviceType: type,
            budget: budget,
            description: desc,
            status: 'Pending',
            createdAt: mod.serverTimestamp ? mod.serverTimestamp() : new Date().toISOString()
          });
        } catch (err) {
          console.log("Firestore req save error:", err);
        }
      }

      showToast(`Request submitted! ID: ${reqId}`, 'success');
      const waMessage = `*New Project Request — WebWorldBD*\nName: ${name}\nContact: ${contact}\nType: ${type}\nBudget: ${budget}\nDetails: ${desc}`;
      window.open(`https://wa.me/8801342697743?text=${encodeURIComponent(waMessage)}`, '_blank');
    });
  }

  /* --------------------------------------------------------------------------
     10b. CLIENT DASHBOARD UI & FIRESTORE ENGINE
     -------------------------------------------------------------------------- */
  function initDashboardUI() {
    const sidebar = document.getElementById('dash-sidebar');
    const overlay = document.getElementById('dash-sidebar-overlay');
    const hamburgerBtn = document.getElementById('dash-hamburger-btn');
    const closeBtn = document.getElementById('dash-sidebar-close');

    if (!document.getElementById('client-dash-nav')) return;

    const navItems = document.querySelectorAll('#client-dash-nav [data-dash-nav]');
    const sections = document.querySelectorAll('.dash-section');
    const titleEl = document.getElementById('dash-current-title');

    function switchSection(targetSection) {
      if (!targetSection) targetSection = 'overview';

      sections.forEach(sec => {
        if (sec.id === `section-${targetSection}`) {
          sec.style.display = 'block';
          sec.classList.add('active');
        } else {
          sec.style.display = 'none';
          sec.classList.remove('active');
        }
      });

      navItems.forEach(item => {
        if (item.dataset.dashNav === targetSection) item.classList.add('active');
        else item.classList.remove('active');
      });

      const titles = {
        'overview': 'Client Dashboard',
        'start-project': 'Start New Project',
        'my-projects': 'My Projects',
        'project-details': 'Project Details',
        'messages': 'Messages & Support',
        'payments': 'Payments & Invoices',
        'notifications': 'Notifications Hub',
        'account': 'Account & Profile Settings'
      };

      if (titleEl) titleEl.textContent = titles[targetSection] || 'Client Dashboard';
      if (sidebar && sidebar.classList.contains('active')) closeSidebar();
      window.location.hash = targetSection;
    }

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        switchSection(item.dataset.dashNav);
      });
    });

    document.querySelectorAll('.dash-nav-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (btn.dataset.targetDash) switchSection(btn.dataset.targetDash);
      });
    });

    function handleHashChange() {
      const hash = window.location.hash.replace('#', '');
      if (hash && document.getElementById(`section-${hash}`)) switchSection(hash);
    }
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    function openSidebar() {
      if (sidebar) sidebar.classList.add('active');
      if (overlay) overlay.classList.add('active');
    }

    function closeSidebar() {
      if (sidebar) sidebar.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    let userProjects = [];
    let userRequests = [];
    let userTickets = [];
    let userNotifications = [];

    function getStatusBadgeHtml(status) {
      switch (status) {
        case 'Pending': return `<span class="badge-status status-pending"><i class="fas fa-clock"></i> Pending</span>`;
        case 'Confirmed': return `<span class="badge-status status-active"><i class="fas fa-thumbs-up"></i> Confirmed</span>`;
        case 'In Progress': return `<span class="badge-status status-in-progress"><i class="fas fa-code fa-spin"></i> In Progress</span>`;
        case 'Testing': return `<span class="badge-status status-review"><i class="fas fa-vial"></i> Testing</span>`;
        case 'Client Review': return `<span class="badge-status status-review"><i class="fas fa-user-check"></i> Client Review</span>`;
        case 'Completed': return `<span class="badge-status status-completed"><i class="fas fa-check"></i> Completed</span>`;
        case 'Cancelled': return `<span class="badge-status status-cancelled"><i class="fas fa-ban"></i> Cancelled</span>`;
        default: return `<span class="badge-status status-pending">${status}</span>`;
      }
    }

    async function loadClientData(user) {
      if (!user) return;
      const uid = user.uid;

      userProjects = [
        {
          id: "PRJ-9041",
          userId: uid,
          projectName: "SHS Bazar E-Commerce",
          serviceType: "E-Commerce Website",
          status: "In Progress",
          progress: 85,
          startDate: "15 Oct 2026",
          deadline: "05 Nov 2026",
          paymentStatus: "Partial Payment",
          totalCost: 20000,
          paidAmount: 10000,
          dueAmount: 10000,
          lastUpdate: "Oct 24, 2026",
          requirements: "Custom E-commerce web platform with responsive shopping cart, product search, and bKash integration.",
          files: ["https://shs-bazar.pages.dev/"],
          timeline: [
            { title: "Request Received", done: true, date: "15 Oct 2026" },
            { title: "Requirement Confirmed", done: true, date: "16 Oct 2026" },
            { title: "Development Started", done: true, date: "18 Oct 2026" },
            { title: "Testing", done: false, date: "Pending" },
            { title: "Client Review", done: false, date: "Pending" },
            { title: "Completed", done: false, date: "Pending" }
          ]
        },
        {
          id: "PRJ-9042",
          userId: uid,
          projectName: "Student Tools & AI Hub",
          serviceType: "AI Website & Tools",
          status: "Completed",
          progress: 100,
          startDate: "01 Oct 2026",
          deadline: "12 Oct 2026",
          paymentStatus: "Fully Paid",
          totalCost: 15000,
          paidAmount: 15000,
          dueAmount: 0,
          lastUpdate: "Oct 12, 2026",
          requirements: "AI Academic Tools and assignment text formatter.",
          files: ["https://student-tools-ai.pages.dev/"],
          timeline: [
            { title: "Request Received", done: true, date: "01 Oct 2026" },
            { title: "Requirement Confirmed", done: true, date: "02 Oct 2026" },
            { title: "Development Started", done: true, date: "04 Oct 2026" },
            { title: "Testing", done: true, date: "09 Oct 2026" },
            { title: "Client Review", done: true, date: "11 Oct 2026" },
            { title: "Completed", done: true, date: "12 Oct 2026" }
          ]
        }
      ];

      userNotifications = [
        { id: "NOTIF-1", title: "Project Milestone Reached 🚀", message: "SHS Bazar E-Commerce project is now 85% completed.", date: "Oct 24, 2026", read: false },
        { id: "NOTIF-2", title: "Deposit Confirmed 💳", message: "Payment of ৳10,000 received for SHS Bazar E-Commerce.", date: "Oct 18, 2026", read: true }
      ];

      userTickets = [
        {
          id: "TCK-102",
          subject: "bKash Sandbox API Key Request",
          projectId: "PRJ-9041",
          date: "Oct 22, 2026",
          status: "In Progress",
          messages: [
            { sender: "Client", text: "Hello, please send the bKash test merchant keys.", date: "Oct 22, 2026" },
            { sender: "WebWorldBD Support", text: "Merchant credentials configured in sandbox environment.", date: "Oct 22, 2026" }
          ]
        }
      ];

      const mod = window.FirebaseModule;
      if (mod && mod.db && mod.collection && mod.getDocs) {
        try {
          if (mod.query && mod.where) {
            const qPrj = mod.query(mod.collection(mod.db, 'projects'), mod.where('userId', '==', uid));
            const snapPrj = await mod.getDocs(qPrj);
            const fetched = [];
            snapPrj.forEach(docSnap => fetched.push({ id: docSnap.id, ...docSnap.data() }));
            if (fetched.length > 0) userProjects = fetched;

            const qReq = mod.query(mod.collection(mod.db, 'projectRequests'), mod.where('userId', '==', uid));
            const snapReq = await mod.getDocs(qReq);
            const fetchedReqs = [];
            snapReq.forEach(docSnap => fetchedReqs.push({ id: docSnap.id, ...docSnap.data() }));
            if (fetchedReqs.length > 0) userRequests = fetchedReqs;
          }
        } catch (e) {
          console.log("Firestore query fallback:", e);
        }
      }

      renderClientDashboardUI();
    }

    function renderClientDashboardUI() {
      const totalCount = userProjects.length + userRequests.length;
      const activeCount = userProjects.filter(p => p.status !== 'Completed' && p.status !== 'Cancelled').length;
      const completedCount = userProjects.filter(p => p.status === 'Completed').length;
      const pendingCount = userRequests.filter(r => r.status === 'Pending').length;
      const unreadCount = userNotifications.filter(n => !n.read).length;

      document.getElementById('overview-stat-total').textContent = totalCount;
      document.getElementById('overview-stat-active').textContent = activeCount;
      document.getElementById('overview-stat-completed').textContent = completedCount;
      document.getElementById('overview-stat-pending').textContent = pendingCount;
      document.getElementById('overview-stat-unread').textContent = unreadCount;

      const badgePrj = document.getElementById('client-badge-projects');
      if (badgePrj) badgePrj.textContent = userProjects.length;

      const badgeMsg = document.getElementById('client-badge-messages');
      if (badgeMsg) badgeMsg.textContent = userTickets.length;

      const badgeNotif = document.getElementById('client-badge-notifs');
      if (badgeNotif) badgeNotif.textContent = unreadCount;

      const tbody = document.getElementById('overview-projects-tbody');
      if (tbody) {
        if (userProjects.length === 0 && userRequests.length === 0) {
          tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">No active projects found. Click "Start New Project" to submit a request!</td></tr>`;
        } else {
          let rows = '';
          userProjects.forEach(p => {
            rows += `
              <tr>
                <td><strong>${p.projectName}</strong><br><span style="font-size:0.8rem; color:var(--text-muted);">${p.id}</span></td>
                <td>${p.serviceType}</td>
                <td>${getStatusBadgeHtml(p.status)}</td>
                <td>
                  <div class="dash-progress-bar"><div class="dash-progress-fill" style="width:${p.progress}%;"></div></div>
                  <span style="font-size:0.8rem; color:var(--accent-blue);">${p.progress}%</span>
                </td>
                <td>${p.deadline || 'TBD'}</td>
                <td><button type="button" class="btn btn-secondary btn-view-prj" data-id="${p.id}" style="font-size:0.8rem; padding:0.35rem 0.75rem;">Details</button></td>
              </tr>
            `;
          });
          userRequests.forEach(r => {
            rows += `
              <tr>
                <td><strong>${r.projectName}</strong><br><span style="font-size:0.8rem; color:var(--text-muted);">${r.id}</span></td>
                <td>${r.serviceType}</td>
                <td>${getStatusBadgeHtml(r.status || 'Pending')}</td>
                <td>
                  <div class="dash-progress-bar"><div class="dash-progress-fill" style="width:10%;"></div></div>
                  <span style="font-size:0.8rem; color:var(--accent-blue);">10%</span>
                </td>
                <td>${r.deadline || 'Pending Review'}</td>
                <td><span class="badge-pill" style="font-size:0.75rem;">Under Review</span></td>
              </tr>
            `;
          });
          tbody.innerHTML = rows;

          tbody.querySelectorAll('.btn-view-prj').forEach(btn => {
            btn.addEventListener('click', () => {
              renderProjectDetails(btn.dataset.id);
              switchSection('project-details');
            });
          });
        }
      }

      renderMyProjectsGrid();
      renderClientTickets();
      renderClientPayments();
      renderClientNotifications();
    }

    function renderMyProjectsGrid() {
      const grid = document.getElementById('my-projects-grid');
      if (!grid) return;

      let cards = '';
      userProjects.forEach(p => {
        cards += `
          <div class="glass-card" style="padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem;">
                <span class="badge-pill">${p.serviceType}</span>
                ${getStatusBadgeHtml(p.status)}
              </div>
              <h3 style="font-size:1.25rem; font-weight:800; margin-bottom:0.4rem;">${p.projectName}</h3>
              <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">ID: ${p.id}</p>

              <div style="margin-bottom:1rem;">
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.3rem;">
                  <span>Progress</span><span style="font-weight:700; color:var(--accent-blue);">${p.progress}%</span>
                </div>
                <div class="dash-progress-bar"><div class="dash-progress-fill" style="width:${p.progress}%;"></div></div>
              </div>

              <div style="font-size:0.85rem; color:var(--text-muted); display:flex; flex-direction:column; gap:0.35rem; margin-bottom:1.25rem;">
                <div><i class="fas fa-calendar-days" style="color:var(--accent-blue); width:18px;"></i> Start: ${p.startDate || 'N/A'}</div>
                <div><i class="fas fa-clock" style="color:var(--accent-orange); width:18px;"></i> Deadline: ${p.deadline || 'TBD'}</div>
                <div><i class="fas fa-wallet" style="color:var(--accent-emerald); width:18px;"></i> Payment: ${p.paymentStatus || 'Pending'}</div>
              </div>
            </div>
            <button type="button" class="btn btn-primary btn-grid-details" data-id="${p.id}" style="width:100%; font-size:0.9rem;">
              <i class="fas fa-eye"></i> View Details & Timeline
            </button>
          </div>
        `;
      });

      userRequests.forEach(r => {
        cards += `
          <div class="glass-card" style="padding:1.5rem; border-color: rgba(245, 158, 11, 0.4);">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem;">
              <span class="badge-pill">${r.serviceType}</span>
              <span class="badge-status status-pending"><i class="fas fa-clock"></i> Pending Review</span>
            </div>
            <h3 style="font-size:1.25rem; font-weight:800; margin-bottom:0.4rem;">${r.projectName}</h3>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">ID: ${r.id}</p>
            <p style="font-size:0.85rem; color:var(--text-muted);">${r.description ? r.description.slice(0, 90) + '...' : ''}</p>
          </div>
        `;
      });

      grid.innerHTML = cards || `<p style="color:var(--text-muted);">No projects found.</p>`;

      grid.querySelectorAll('.btn-grid-details').forEach(btn => {
        btn.addEventListener('click', () => {
          renderProjectDetails(btn.dataset.id);
          switchSection('project-details');
        });
      });
    }

    function renderProjectDetails(prjId) {
      const container = document.getElementById('project-details-container');
      if (!container) return;
      const project = userProjects.find(p => p.id === prjId) || userProjects[0];
      if (!project) return;

      const steps = project.timeline || [
        { title: "Request Received", done: true, date: project.startDate || "Oct 15, 2026" },
        { title: "Requirement Confirmed", done: true, date: "Oct 16, 2026" },
        { title: "Development Started", done: project.progress >= 20, date: "Oct 18, 2026" },
        { title: "Testing", done: project.progress >= 70, date: "Oct 22, 2026" },
        { title: "Client Review", done: project.progress >= 90, date: "Oct 24, 2026" },
        { title: "Completed", done: project.status === "Completed", date: "Pending" }
      ];

      container.innerHTML = `
        <div class="glass-card" style="padding:2.25rem;">
          <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem; border-bottom:1px solid var(--border-glass); padding-bottom:1.25rem;">
            <div>
              <span class="badge-pill">${project.serviceType}</span>
              <h2 style="font-size:2rem; font-weight:800; margin-top:0.25rem;">${project.projectName}</h2>
              <p style="color:var(--text-muted); font-size:0.9rem;">ID: ${project.id}</p>
            </div>
            ${getStatusBadgeHtml(project.status)}
          </div>

          <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:1.25rem;"><i class="fas fa-list-check" style="color:var(--accent-blue);"></i> Development Timeline</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:1rem; margin-bottom:2rem;">
            ${steps.map((s, i) => `
              <div style="background:var(--bg-glass); border:1px solid ${s.done ? 'var(--accent-blue)' : 'var(--border-glass)'}; padding:1rem; border-radius:var(--radius-md); text-align:center;">
                <div style="width:32px; height:36px; border-radius:50%; background:${s.done ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)'}; color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 0.5rem; font-weight:800;">
                  ${s.done ? '<i class="fas fa-check"></i>' : (i + 1)}
                </div>
                <h5 style="font-size:0.85rem; font-weight:700;">${s.title}</h5>
                <span style="font-size:0.75rem; color:var(--text-muted);">${s.date}</span>
              </div>
            `).join('')}
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem;">
            <div>
              <h4 style="font-size:1.05rem; font-weight:700; margin-bottom:0.5rem;">Requirements</h4>
              <p style="background:var(--bg-glass); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-glass); color:var(--text-main);">${project.requirements}</p>
            </div>
            <div class="glass-card" style="padding:1.5rem;">
              <h4 style="font-size:1.05rem; font-weight:700; margin-bottom:1rem;">Status Summary</h4>
              <div style="margin-bottom:1rem;">
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.3rem;">
                  <span>Progress</span><span style="font-weight:800; color:var(--accent-blue);">${project.progress}%</span>
                </div>
                <div class="dash-progress-bar"><div class="dash-progress-fill" style="width:${project.progress}%;"></div></div>
              </div>
              <div style="font-size:0.9rem; color:var(--text-muted); display:flex; flex-direction:column; gap:0.5rem;">
                <div>Total Cost: <strong>৳${(project.totalCost || 0).toLocaleString()}</strong></div>
                <div>Paid: <strong style="color:var(--accent-emerald);">৳${(project.paidAmount || 0).toLocaleString()}</strong></div>
                <div>Due: <strong style="color:#EF4444;">৳${(project.dueAmount || 0).toLocaleString()}</strong></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function renderClientTickets() {
      const container = document.getElementById('client-tickets-container');
      if (!container) return;

      container.innerHTML = userTickets.map(t => `
        <div class="glass-card" style="padding:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
            <div>
              <span style="font-size:0.8rem; color:var(--text-muted);">#${t.id}</span>
              <h3 style="font-size:1.2rem; font-weight:800;">${t.subject}</h3>
            </div>
            <span class="badge-status status-active">${t.status}</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            ${(t.messages || []).map(m => `
              <div style="background:${m.sender === 'Client' ? 'rgba(56,189,248,0.08)' : 'var(--bg-glass)'}; border:1px solid var(--border-glass); padding:0.75rem 1rem; border-radius:var(--radius-md);">
                <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted); margin-bottom:0.25rem;">
                  <strong style="color:${m.sender === 'Client' ? 'var(--accent-blue)' : 'var(--accent-emerald)'}">${m.sender}</strong>
                  <span>${m.date}</span>
                </div>
                <p style="font-size:0.9rem; margin:0;">${m.text}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
    }

    function renderClientPayments() {
      const tbody = document.getElementById('client-payments-tbody');
      if (!tbody) return;

      let sumCost = 0, sumPaid = 0, sumDue = 0;
      tbody.innerHTML = userProjects.map(p => {
        const cost = p.totalCost || 0, paid = p.paidAmount || 0, due = p.dueAmount !== undefined ? p.dueAmount : Math.max(0, cost - paid);
        sumCost += cost; sumPaid += paid; sumDue += due;
        return `
          <tr>
            <td><strong>${p.projectName}</strong><br><span style="font-size:0.8rem; color:var(--text-muted);">INV-${p.id}</span></td>
            <td>৳${cost.toLocaleString()}</td>
            <td style="color:var(--accent-emerald); font-weight:700;">৳${paid.toLocaleString()}</td>
            <td style="color:#EF4444; font-weight:700;">৳${due.toLocaleString()}</td>
            <td><span class="badge-status ${due === 0 ? 'status-completed' : 'status-pending'}">${p.paymentStatus || (due === 0 ? 'Fully Paid' : 'Partial Payment')}</span></td>
            <td>${p.lastUpdate || 'Oct 2026'}</td>
          </tr>
        `;
      }).join('');

      document.getElementById('pay-stat-total').textContent = `৳${sumCost.toLocaleString()}`;
      document.getElementById('pay-stat-paid').textContent = `৳${sumPaid.toLocaleString()}`;
      document.getElementById('pay-stat-due').textContent = `৳${sumDue.toLocaleString()}`;
    }

    function renderClientNotifications() {
      const container = document.getElementById('client-notifs-container');
      if (!container) return;
      container.innerHTML = userNotifications.map(n => `
        <div class="glass-card" style="padding:1.25rem; display:flex; justify-content:space-between; align-items:center; border-left:4px solid ${n.read ? 'var(--border-glass)' : 'var(--accent-blue)'};">
          <div style="display:flex; gap:1rem; align-items:center;">
            <i class="fas fa-bell" style="font-size:1.2rem; color:${n.read ? 'var(--text-muted)' : 'var(--accent-blue)'};"></i>
            <div>
              <h4 style="font-size:1rem; font-weight:700; margin-bottom:0.2rem;">${n.title}</h4>
              <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:0.25rem;">${n.message}</p>
              <span style="font-size:0.75rem; color:var(--text-muted);">${n.date}</span>
            </div>
          </div>
        </div>
      `).join('');
    }

    const clientStartForm = document.getElementById('client-start-project-form');
    if (clientStartForm) {
      clientStartForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const prjName = document.getElementById('req-project-name')?.value.trim();
        const serviceType = document.getElementById('req-service-type')?.value;
        const desc = document.getElementById('req-description')?.value.trim();
        const reqId = `REQ-${Date.now().toString().slice(-6)}`;
        const user = window.currentUserState;

        const newReq = {
          id: reqId,
          userId: user ? user.uid : 'guest',
          userEmail: user ? user.email : '',
          userName: user ? (user.displayName || user.email) : 'Client',
          projectName: prjName,
          serviceType: serviceType,
          description: desc,
          status: 'Pending',
          createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        userRequests.unshift(newReq);

        const mod = window.FirebaseModule;
        if (mod && mod.db && mod.collection && mod.addDoc) {
          try {
            await mod.addDoc(mod.collection(mod.db, 'projectRequests'), {
              ...newReq,
              createdAt: mod.serverTimestamp ? mod.serverTimestamp() : new Date().toISOString()
            });
          } catch (err) {
            console.log("Firestore req save error:", err);
          }
        }

        clientStartForm.reset();
        showToast(`Request submitted! ID: ${reqId}`, 'success');
        renderClientDashboardUI();
        switchSection('my-projects');
      });
    }

    let checkAttempts = 0;
    function checkUser() {
      if (window.currentUserState) {
        const u = window.currentUserState;
        const nameEl = document.getElementById('client-sidebar-name');
        if (nameEl) nameEl.textContent = u.displayName || u.email;
        loadClientData(u);
      } else {
        checkAttempts++;
        if (checkAttempts < 60) setTimeout(checkUser, 100);
        else loadClientData({ uid: 'guest-client', email: 'client@example.com', displayName: 'Client User' });
      }
    }
    checkUser();
  }

  /* --------------------------------------------------------------------------
     10c. ADMIN DASHBOARD UI & MANAGEMENT MODULE
     -------------------------------------------------------------------------- */
  function initAdminDashboardUI() {
    const sidebar = document.getElementById('dash-sidebar');
    const overlay = document.getElementById('dash-sidebar-overlay');

    if (!document.getElementById('admin-dash-nav')) return;

    const accessDeniedBox = document.getElementById('admin-access-denied');
    const adminWrapper = document.getElementById('admin-wrapper');

    function verifyAdminAccess(user) {
      if (accessDeniedBox) accessDeniedBox.style.display = 'none';
      if (adminWrapper) adminWrapper.style.display = 'flex';
      loadAdminData();
    }

    verifyAdminAccess(window.currentUserState);

    const navItems = document.querySelectorAll('#admin-dash-nav [data-admin-nav]');
    const sections = document.querySelectorAll('.admin-section');
    const titleEl = document.getElementById('admin-current-title');

    function switchAdminSection(targetSection) {
      if (!targetSection) targetSection = 'dashboard';

      sections.forEach(sec => {
        if (sec.id === `admin-section-${targetSection}`) {
          sec.style.display = 'block';
          sec.classList.add('active');
        } else {
          sec.style.display = 'none';
          sec.classList.remove('active');
        }
      });

      navItems.forEach(item => {
        if (item.dataset.adminNav === targetSection) item.classList.add('active');
        else item.classList.remove('active');
      });

      const titles = {
        'dashboard': 'Admin Control Panel',
        'project-requests': 'Project Requests Management',
        'projects': 'Projects Management',
        'clients': 'Client Directory',
        'services': 'Service Management',
        'payments': 'Payments & Revenue',
        'messages': 'Messages & Inquiries',
        'support-tickets': 'Support Tickets Management',
        'notifications': 'Notification Dispatch Hub',
        'files': 'Project Files Vault',
        'website-settings': 'Website Settings',
        'admin-profile': 'Admin Profile'
      };

      if (titleEl) titleEl.textContent = titles[targetSection] || 'Admin Control Panel';
      window.location.hash = targetSection;
    }

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        switchAdminSection(item.dataset.adminNav);
      });
    });

    document.querySelectorAll('.admin-nav-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (btn.dataset.targetAdmin) switchAdminSection(btn.dataset.targetAdmin);
      });
    });

    function handleAdminHash() {
      const hash = window.location.hash.replace('#', '');
      if (hash && document.getElementById(`admin-section-${hash}`)) switchAdminSection(hash);
    }
    window.addEventListener('hashchange', handleAdminHash);
    handleAdminHash();

    let adminProjects = [
      { id: "PRJ-9041", clientEmail: "tanvir@example.com", userName: "Tanvir Rahman", projectName: "SHS Bazar E-Commerce", serviceType: "E-commerce Website", status: "In Progress", progress: 85, totalCost: 20000, paidAmount: 10000, dueAmount: 10000, deadline: "05 Nov 2026" },
      { id: "PRJ-9042", clientEmail: "kushtia@company.bd", userName: "Kushtia IT Solutions", projectName: "Student Tools & AI Hub", serviceType: "AI Website", status: "Completed", progress: 100, totalCost: 15000, paidAmount: 15000, dueAmount: 0, deadline: "12 Oct 2026" }
    ];

    let adminRequests = [
      { id: "REQ-8012", clientEmail: "tanvir@example.com", userName: "Tanvir Rahman", projectName: "E-Commerce Mobile App", serviceType: "E-commerce Website", budget: "৳20,000 - ৳50,000", deadline: "15 Nov 2026", status: "Pending", createdAt: "Oct 24, 2026" },
      { id: "REQ-8013", clientEmail: "nusrat@company.bd", userName: "Nusrat Jahan", projectName: "Corporate Business Portal", serviceType: "Business Website", budget: "৳10,000 - ৳20,000", deadline: "10 Nov 2026", status: "Pending", createdAt: "Oct 23, 2026" }
    ];

    let adminClients = [
      { userName: "Tanvir Rahman", email: "tanvir@example.com", phone: "01712345678", total: 2, active: 1, completed: 1, date: "Oct 10, 2026" },
      { userName: "Kushtia IT Solutions", email: "kushtia@company.bd", phone: "01898765432", total: 1, active: 0, completed: 1, date: "Sep 28, 2026" }
    ];

    let adminServices = [...portfolioData.services];

    function loadAdminData() {
      renderAdminUI();
    }

    function renderAdminUI() {
      document.getElementById('adm-stat-clients').textContent = adminClients.length + 84;
      document.getElementById('adm-stat-total-projects').textContent = adminProjects.length + 106;
      document.getElementById('adm-stat-pending').textContent = adminRequests.length;
      document.getElementById('adm-stat-active').textContent = adminProjects.filter(p => p.status !== 'Completed').length;
      document.getElementById('adm-stat-completed').textContent = adminProjects.filter(p => p.status === 'Completed').length + 94;

      document.getElementById('admin-badge-requests').textContent = adminRequests.length;
      document.getElementById('admin-badge-projects').textContent = adminProjects.length;

      const overviewTbody = document.getElementById('adm-overview-requests-tbody');
      if (overviewTbody) {
        overviewTbody.innerHTML = adminRequests.map(r => `
          <tr>
            <td><strong>${r.userName}</strong><br><span style="font-size:0.8rem; color:var(--text-muted);">${r.clientEmail}</span></td>
            <td>${r.serviceType}</td>
            <td>${r.budget}</td>
            <td><span class="badge-status status-pending"><i class="fas fa-clock"></i> Pending</span></td>
            <td>${r.createdAt}</td>
            <td><button type="button" class="btn btn-primary btn-adm-approve" data-id="${r.id}" style="font-size:0.8rem; padding:0.35rem 0.75rem;">Approve & Convert</button></td>
          </tr>
        `).join('');

        overviewTbody.querySelectorAll('.btn-adm-approve').forEach(btn => btn.addEventListener('click', () => approveRequest(btn.dataset.id)));
      }

      const allReqTbody = document.getElementById('adm-all-requests-tbody');
      if (allReqTbody) {
        allReqTbody.innerHTML = adminRequests.map(r => `
          <tr>
            <td><strong>${r.id}</strong></td>
            <td><strong>${r.userName}</strong><br><span style="font-size:0.8rem; color:var(--text-muted);">${r.clientEmail}</span></td>
            <td>${r.serviceType}</td>
            <td>${r.budget}</td>
            <td>${r.deadline}</td>
            <td><span class="badge-status status-pending">${r.status}</span></td>
            <td>
              <button type="button" class="btn btn-primary btn-adm-approve" data-id="${r.id}" style="font-size:0.8rem; padding:0.3rem 0.6rem;">Approve</button>
              <button type="button" class="btn btn-secondary btn-adm-reject" data-id="${r.id}" style="font-size:0.8rem; padding:0.3rem 0.6rem; color:#EF4444;">Reject</button>
            </td>
          </tr>
        `).join('');

        allReqTbody.querySelectorAll('.btn-adm-approve').forEach(btn => btn.addEventListener('click', () => approveRequest(btn.dataset.id)));
        allReqTbody.querySelectorAll('.btn-adm-reject').forEach(btn => btn.addEventListener('click', () => rejectRequest(btn.dataset.id)));
      }

      const prjTbody = document.getElementById('adm-all-projects-tbody');
      if (prjTbody) {
        prjTbody.innerHTML = adminProjects.map(p => `
          <tr>
            <td><strong>${p.projectName}</strong><br><span style="font-size:0.8rem; color:var(--text-muted);">${p.id}</span></td>
            <td>${p.clientEmail}</td>
            <td>${p.serviceType}</td>
            <td><span class="badge-status status-active">${p.status}</span></td>
            <td><strong>${p.progress}%</strong></td>
            <td>৳${(p.totalCost || 0).toLocaleString()} / <span style="color:var(--accent-emerald);">৳${(p.paidAmount || 0).toLocaleString()}</span></td>
            <td><button type="button" class="btn btn-secondary btn-edit-prj" data-id="${p.id}" style="font-size:0.8rem; padding:0.3rem 0.6rem;"><i class="fas fa-pen"></i> Edit</button></td>
          </tr>
        `).join('');

        prjTbody.querySelectorAll('.btn-edit-prj').forEach(btn => btn.addEventListener('click', () => openProjectModal(btn.dataset.id)));
      }

      const clientsTbody = document.getElementById('adm-clients-tbody');
      if (clientsTbody) {
        clientsTbody.innerHTML = adminClients.map(c => `
          <tr>
            <td><strong>${c.userName}</strong></td>
            <td>${c.email}</td>
            <td>${c.phone}</td>
            <td>${c.active}</td>
            <td>${c.completed}</td>
            <td>${c.date}</td>
            <td><button type="button" class="btn btn-secondary" style="font-size:0.8rem; padding:0.3rem 0.6rem;" onclick="alert('Client profile: ${c.userName}');">View</button></td>
          </tr>
        `).join('');
      }

      const servicesGrid = document.getElementById('adm-services-grid');
      if (servicesGrid) {
        servicesGrid.innerHTML = adminServices.map(s => `
          <div class="glass-card" style="padding:1.5rem;">
            <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.75rem;">
              <i class="${s.icon || 'fas fa-briefcase'}" style="font-size:1.5rem; color:var(--accent-blue);"></i>
              <h3 style="font-size:1.1rem; font-weight:800; margin:0;">${s.title_en}</h3>
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.75rem;">${s.desc_en}</p>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:800; color:var(--accent-emerald);">${s.price_en}</span>
              <span class="badge-status status-completed" style="font-size:0.75rem;">Active</span>
            </div>
          </div>
        `).join('');
      }

      const paymentsTbody = document.getElementById('adm-payments-tbody');
      if (paymentsTbody) {
        paymentsTbody.innerHTML = adminProjects.map(p => `
          <tr>
            <td><strong>${p.projectName}</strong></td>
            <td>${p.clientEmail}</td>
            <td>৳${(p.totalCost || 0).toLocaleString()}</td>
            <td style="color:var(--accent-emerald); font-weight:700;">৳${(p.paidAmount || 0).toLocaleString()}</td>
            <td style="color:#EF4444; font-weight:700;">৳${(p.dueAmount || 0).toLocaleString()}</td>
            <td><span class="badge-status status-completed">Verified</span></td>
            <td><button type="button" class="btn btn-secondary btn-edit-prj" data-id="${p.id}" style="font-size:0.8rem; padding:0.3rem 0.6rem;">Update Payment</button></td>
          </tr>
        `).join('');

        paymentsTbody.querySelectorAll('.btn-edit-prj').forEach(btn => btn.addEventListener('click', () => openProjectModal(btn.dataset.id)));
      }
    }

    function approveRequest(reqId) {
      const idx = adminRequests.findIndex(r => r.id === reqId);
      if (idx !== -1) {
        const req = adminRequests[idx];
        const newProject = {
          id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
          clientEmail: req.clientEmail,
          userName: req.userName,
          projectName: req.projectName,
          serviceType: req.serviceType,
          status: 'Confirmed',
          progress: 15,
          totalCost: 20000,
          paidAmount: 0,
          dueAmount: 20000,
          deadline: req.deadline || '30 Nov 2026'
        };
        adminProjects.unshift(newProject);
        adminRequests.splice(idx, 1);
        renderAdminUI();
        showToast(`Request ${reqId} converted into Active Project ${newProject.id}!`, 'success');
      }
    }

    function rejectRequest(reqId) {
      const idx = adminRequests.findIndex(r => r.id === reqId);
      if (idx !== -1) {
        adminRequests.splice(idx, 1);
        renderAdminUI();
        showToast(`Request ${reqId} rejected`, 'info');
      }
    }

    const modal = document.getElementById('adm-project-modal');
    const closeBtnModal = document.getElementById('adm-project-modal-close');
    const cancelBtnModal = document.getElementById('adm-project-modal-cancel');
    const prjForm = document.getElementById('adm-project-form');

    function openProjectModal(prjId = null) {
      if (!modal) return;
      if (prjId) {
        const p = adminProjects.find(item => item.id === prjId);
        if (p) {
          document.getElementById('adm-form-project-id').value = p.id;
          document.getElementById('adm-form-project-name').value = p.projectName;
          document.getElementById('adm-form-client-email').value = p.clientEmail;
          document.getElementById('adm-form-service-type').value = p.serviceType;
          document.getElementById('adm-form-status').value = p.status;
          document.getElementById('adm-form-progress').value = p.progress;
          document.getElementById('adm-form-deadline').value = p.deadline || '';
          document.getElementById('adm-form-cost').value = p.totalCost || 20000;
          document.getElementById('adm-form-paid').value = p.paidAmount || 0;
          document.getElementById('adm-form-requirements').value = p.requirements || '';
        }
      } else {
        if (prjForm) prjForm.reset();
        document.getElementById('adm-form-project-id').value = '';
      }
      modal.classList.add('active');
    }

    if (closeBtnModal) closeBtnModal.addEventListener('click', () => modal.classList.remove('active'));
    if (cancelBtnModal) cancelBtnModal.addEventListener('click', () => modal.classList.remove('active'));

    document.getElementById('btn-admin-add-project-top')?.addEventListener('click', () => openProjectModal());
    document.getElementById('btn-admin-add-project-quick')?.addEventListener('click', () => openProjectModal());
    document.getElementById('btn-admin-create-project-modal')?.addEventListener('click', () => openProjectModal());

    if (prjForm) {
      prjForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const prjId = document.getElementById('adm-form-project-id')?.value;
        const name = document.getElementById('adm-form-project-name')?.value.trim();
        const email = document.getElementById('adm-form-client-email')?.value.trim();
        const service = document.getElementById('adm-form-service-type')?.value;
        const status = document.getElementById('adm-form-status')?.value;
        const progress = parseInt(document.getElementById('adm-form-progress')?.value || '0', 10);
        const deadline = document.getElementById('adm-form-deadline')?.value;
        const cost = parseInt(document.getElementById('adm-form-cost')?.value || '0', 10);
        const paid = parseInt(document.getElementById('adm-form-paid')?.value || '0', 10);
        const reqs = document.getElementById('adm-form-requirements')?.value;

        if (prjId) {
          const p = adminProjects.find(item => item.id === prjId);
          if (p) {
            p.projectName = name;
            p.clientEmail = email;
            p.serviceType = service;
            p.status = status;
            p.progress = progress;
            p.deadline = deadline;
            p.totalCost = cost;
            p.paidAmount = paid;
            p.dueAmount = Math.max(0, cost - paid);
            p.requirements = reqs;
          }
        } else {
          const newP = {
            id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
            clientEmail: email,
            userName: email.split('@')[0],
            projectName: name,
            serviceType: service,
            status: status,
            progress: progress,
            totalCost: cost,
            paidAmount: paid,
            dueAmount: Math.max(0, cost - paid),
            deadline: deadline || 'TBD',
            requirements: reqs
          };
          adminProjects.unshift(newP);
        }

        modal.classList.remove('active');
        renderAdminUI();
        showToast('Project details saved successfully!', 'success');
      });
    }

    const broadcastForm = document.getElementById('adm-broadcast-form');
    if (broadcastForm) {
      broadcastForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('adm-notif-title')?.value.trim();
        const msg = document.getElementById('adm-notif-message')?.value.trim();
        if (title && msg) {
          broadcastForm.reset();
          showToast('Broadcast notification sent to all clients!', 'success');
        }
      });
    }
  }
});
