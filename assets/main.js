/* ============================================================
   ZAKI PROPERTY GROUP — Global JavaScript
   ============================================================ */

/* ── Navbar Scroll & Mobile Menu ───────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link detection
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ── Scroll Reveal Animation ───────────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ── Format Currency (IDR) ─────────────────────────────────── */
function formatIDR(number) {
  if (number >= 1_000_000_000) {
    const val = number / 1_000_000_000;
    return `Rp ${val % 1 === 0 ? val : val.toFixed(1)} M`;
  }
  if (number >= 1_000_000) {
    const val = number / 1_000_000;
    return `Rp ${val % 1 === 0 ? val : val.toFixed(0)} Jt`;
  }
  return `Rp ${number.toLocaleString('id-ID')}`;
}

/* ── Newsletter Form ────────────────────────────────────────── */
(function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn   = form.querySelector('button');
    if (!input || !input.value) return;
    btn.textContent = 'Terima Kasih! ✓';
    btn.disabled = true;
    btn.style.background = 'var(--green-600)';
    input.value = '';
    setTimeout(() => {
      btn.textContent = 'Berlangganan';
      btn.disabled = false;
      btn.style.background = '';
    }, 3500);
  });
})();

/* ── Price Range Slider ─────────────────────────────────────── */
function initPriceSlider(sliderId, displayId) {
  const slider  = document.getElementById(sliderId);
  const display = document.getElementById(displayId);
  if (!slider || !display) return;

  const prices = [500_000_000, 1_000_000_000, 2_000_000_000, 5_000_000_000, 10_000_000_000];
  slider.max = prices.length - 1;

  function update() {
    display.textContent = formatIDR(prices[slider.value]);
  }
  slider.addEventListener('input', update);
  update();
}

/* ── Tabs Component ─────────────────────────────────────────── */
function initTabs(containerSelector) {
  const containers = document.querySelectorAll(containerSelector);
  containers.forEach(container => {
    const tabs    = container.querySelectorAll('[data-tab]');
    const panels  = container.querySelectorAll('[data-panel]');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        container.querySelector(`[data-panel="${target}"]`)?.classList.add('active');
      });
    });

    // Init first tab active
    if (tabs[0]) tabs[0].click();
  });
}

/* ── Testimonial Slider ─────────────────────────────────────── */
function initTestimonialSlider(sliderSelector) {
  const slider = document.querySelector(sliderSelector);
  if (!slider) return;

  const track = slider.querySelector('.slider-track');
  const slides = slider.querySelectorAll('.slider-slide');
  const prev   = slider.querySelector('.slider-prev');
  const next   = slider.querySelector('.slider-next');
  const dotsEl = slider.querySelector('.slider-dots');

  if (!track || !slides.length) return;

  let current = 0;
  const total  = slides.length;

  // Build dots
  if (dotsEl) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i+1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    });
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    slider.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  if (prev) prev.addEventListener('click', () => goTo(current - 1));
  if (next) next.addEventListener('click', () => goTo(current + 1));

  // Auto-advance
  let autoplay = setInterval(() => goTo(current + 1), 5500);
  slider.addEventListener('mouseenter', () => clearInterval(autoplay));
  slider.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(current + 1), 5500);
  });

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
  }, { passive: true });
}

/* ── Filter Toggle (mobile sidebar) ────────────────────────── */
function initFilterToggle() {
  const toggleBtn = document.getElementById('filter-toggle');
  const filterPanel = document.getElementById('filter-panel');
  if (!toggleBtn || !filterPanel) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = filterPanel.classList.toggle('open');
    toggleBtn.textContent = isOpen ? '✕ Tutup Filter' : '⚡ Filter Properti';
  });
}

/* ── Search Form Handler ────────────────────────────────────── */
(function initSearchForm() {
  const form = document.getElementById('quick-search-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const params = new URLSearchParams();
    data.forEach((value, key) => { if (value) params.append(key, value); });
    window.location.href = `catalog.html?${params.toString()}`;
  });
})();

/* ── Cookie-based simple state (no localStorage) ───────────── */
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}
function setCookie(name, value, days = 30) {
  const exp = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${exp}; path=/; SameSite=Lax`;
}