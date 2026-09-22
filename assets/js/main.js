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
        <div class="project-thumb" style="background-image: url('${p.image}');">
          <div class="project-thumb-overlay">
            <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding:0.5rem 1rem; font-size:0.85rem;">
              <i class="fas fa-external-link-alt"></i> ${translations[currentLang].btnLivePreview}
            </a>
            <a href="project-details.html?id=${p.id}" class="btn btn-secondary" style="padding:0.5rem 1rem; font-size:0.85rem;">
              <i class="fas fa-info-circle"></i> ${translations[currentLang].btnProjectDetails}
            </a>
          </div>
        </div>
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

        <div style="width: 100%; height: 380px; border-radius: 16px; background: url('${project.image}') center/cover no-repeat; border: 1px solid var(--border-glass); margin-bottom: 2.5rem; position: relative;">
          <div style="position: absolute; bottom: 15px; right: 15px; background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); padding: 0.5rem 1rem; border-radius: 30px; font-size: 0.85rem; color: #fff;">
            <i class="fas fa-shield-alt" style="color: var(--accent-blue);"></i> WebWorldBD Verified
          </div>
        </div>

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
