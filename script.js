// Scroll-triggered entrance animations
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Split heading lines into words for a build-from-right effect
  function wrapWords(node, counter) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        const parts = child.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (part === '') return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            const w = document.createElement('span');
            w.className = 'aw';
            w.textContent = part;
            w.style.setProperty('--wd', (counter.i * 52) + 'ms');
            counter.i++;
            frag.appendChild(w);
          }
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {
        wrapWords(child, counter);
      }
    });
  }

  document.querySelectorAll('.hero-title, .display').forEach(function (heading) {
    const counter = { i: 0 };
    heading.querySelectorAll('.line').forEach(function (line) {
      line.removeAttribute('data-anim');
      wrapWords(line, counter);
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
        child.style.setProperty('--d', (i * 90) + 'ms');
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

  // Lead forms redirect to Calendly with prefilled name/email/phone
  document.querySelectorAll('.lead-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const inputs = form.querySelectorAll('input');
      const name  = (inputs[0] && inputs[0].value.trim()) || '';
      const email = (inputs[1] && inputs[1].value.trim()) || '';
      const phone = (inputs[2] && inputs[2].value.trim()) || '';
      const params = new URLSearchParams();
      if (name)  params.set('name', name);
      if (email) params.set('email', email);
      if (phone) params.set('a1', phone);
      const base = 'https://calendly.com/infoproductsdesigns/30min';
      const qs = params.toString();
      window.location.href = qs ? base + '?' + qs : base;
    });
  });

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
