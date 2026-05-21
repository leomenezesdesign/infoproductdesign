// Scroll-triggered entrance animations
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Stagger lines inside the same heading
  document.querySelectorAll('.hero-title, .display, .contact-copy .big-heading').forEach(function (group) {
    group.querySelectorAll('.line').forEach(function (line, i) {
      line.style.setProperty('--d', (i * 90) + 'ms');
    });
  });

  // Stagger grouped card/list reveals
  const groups = [
    '.strategy-cards', '.why-grid', '.testimonial-grid',
    '.work-grid', '.service-list', '.process-grid', '.accordion'
  ];
  groups.forEach(function (sel) {
    const parent = document.querySelector(sel);
    if (!parent) return;
    Array.prototype.forEach.call(parent.children, function (child, i) {
      if (child.hasAttribute('data-anim')) {
        child.style.setProperty('--d', (i * 110) + 'ms');
      }
    });
  });

  if (reduced) {
    document.querySelectorAll('[data-anim], .line').forEach(function (el) {
      el.classList.add('in');
    });
  } else {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('[data-anim], .line').forEach(function (el) {
      io.observe(el);
    });
  }

  // FAQ accordion
  document.querySelectorAll('.acc-item').forEach(function (item) {
    const head = item.querySelector('.acc-head');
    const panel = item.querySelector('.acc-panel');
    head.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item.open').forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.acc-head').setAttribute('aria-expanded', 'false');
        other.querySelector('.acc-panel').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        head.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
})();
