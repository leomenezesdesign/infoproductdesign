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

  // Populate country-code (DDI) selects — United States first (default)
  const COUNTRIES = [
    ['+1','🇺🇸','United States'],
    ['+55','🇧🇷','Brazil'],
    ['+1','🇨🇦','Canada'],
    ['+351','🇵🇹','Portugal'],
    ['+44','🇬🇧','United Kingdom'],
    ['+34','🇪🇸','Spain'],
    ['+52','🇲🇽','Mexico'],
    ['+54','🇦🇷','Argentina'],
    ['+56','🇨🇱','Chile'],
    ['+57','🇨🇴','Colombia'],
    ['+51','🇵🇪','Peru'],
    ['+598','🇺🇾','Uruguay'],
    ['+595','🇵🇾','Paraguay'],
    ['+58','🇻🇪','Venezuela'],
    ['+593','🇪🇨','Ecuador'],
    ['+591','🇧🇴','Bolivia'],
    ['+49','🇩🇪','Germany'],
    ['+33','🇫🇷','France'],
    ['+39','🇮🇹','Italy'],
    ['+31','🇳🇱','Netherlands'],
    ['+41','🇨🇭','Switzerland'],
    ['+43','🇦🇹','Austria'],
    ['+32','🇧🇪','Belgium'],
    ['+46','🇸🇪','Sweden'],
    ['+47','🇳🇴','Norway'],
    ['+45','🇩🇰','Denmark'],
    ['+353','🇮🇪','Ireland'],
    ['+972','🇮🇱','Israel'],
    ['+61','🇦🇺','Australia'],
    ['+64','🇳🇿','New Zealand'],
    ['+81','🇯🇵','Japan'],
    ['+82','🇰🇷','South Korea'],
    ['+86','🇨🇳','China'],
    ['+91','🇮🇳','India'],
    ['+65','🇸🇬','Singapore'],
    ['+852','🇭🇰','Hong Kong'],
    ['+971','🇦🇪','United Arab Emirates'],
    ['+966','🇸🇦','Saudi Arabia'],
    ['+27','🇿🇦','South Africa'],
    ['+90','🇹🇷','Turkey'],
    ['+7','🇷🇺','Russia'],
  ];
  document.querySelectorAll('select.ddi').forEach(function (sel) {
    sel.innerHTML = COUNTRIES.map(function (c, i) {
      return '<option value="' + c[0] + '" data-flag="' + c[1] + '"'
        + (i === 0 ? ' selected' : '') + '>'
        + c[1] + ' ' + c[0] + ' — ' + c[2] + '</option>';
    }).join('');

    const wrap = sel.closest('.ddi-wrap');
    const flagEl = wrap && wrap.querySelector('.ddi-flag');
    const field = sel.closest('.phone-field');
    const phoneInput = field && field.querySelector('input[type="tel"]');
    let currentDial = sel.value;

    if (phoneInput && !phoneInput.value) {
      phoneInput.value = currentDial + ' ';
    }
    if (flagEl) {
      const opt = sel.options[sel.selectedIndex];
      flagEl.textContent = opt.getAttribute('data-flag') || '';
    }

    sel.addEventListener('change', function () {
      const newDial = sel.value;
      const opt = sel.options[sel.selectedIndex];
      if (flagEl) flagEl.textContent = opt.getAttribute('data-flag') || '';
      if (phoneInput) {
        const val = phoneInput.value;
        const prev = currentDial + ' ';
        if (val === '' || val.trim() === '') {
          phoneInput.value = newDial + ' ';
        } else if (val.startsWith(prev)) {
          phoneInput.value = newDial + ' ' + val.slice(prev.length);
        } else if (val.startsWith(currentDial)) {
          phoneInput.value = newDial + val.slice(currentDial.length);
        } else {
          phoneInput.value = newDial + ' ' + val;
        }
        phoneInput.focus();
        const len = phoneInput.value.length;
        phoneInput.setSelectionRange(len, len);
      }
      currentDial = newDial;
    });
  });

  // Google Apps Script Web App URL — receives leads and appends to the sheet.
  // Setup: Sheet → Extensions → Apps Script → paste the doPost function from
  // README/notes, Deploy → Web app → Access: Anyone, then paste the URL below.
  const LEAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxcQBZnrJpMXLORSQCbdW2m5Wpm3_6O568kYNePTinMX-y_NEuZCZqsQ-akZ98617DE-Q/exec';

  // Lead forms: save to sheet (fire-and-forget) then redirect to Calendly
  document.querySelectorAll('.lead-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const inputs = form.querySelectorAll('input');
      const name  = (inputs[0] && inputs[0].value.trim()) || '';
      const email = (inputs[1] && inputs[1].value.trim()) || '';
      // Phone input already includes the dial code (e.g. "+1 555-1234")
      const fullPhone = (inputs[2] && inputs[2].value.trim()) || '';

      // Send to Google Sheet via Apps Script (uses sendBeacon so the request
      // survives the redirect below and there's no CORS preflight)
      if (LEAD_ENDPOINT) {
        try {
          const payload = JSON.stringify({
            name: name, email: email, phone: fullPhone, source: location.pathname
          });
          navigator.sendBeacon(LEAD_ENDPOINT, payload);
        } catch (err) { /* ignore */ }
      }

      // Meta Pixel — Lead conversion event
      if (typeof fbq === 'function') {
        try { fbq('track', 'Lead'); } catch (err) { /* ignore */ }
      }

      const params = new URLSearchParams();
      if (name)  params.set('name', name);
      if (email) params.set('email', email);
      if (fullPhone) params.set('a1', fullPhone);
      const base = 'https://calendly.com/infoproductsdesigns/30min';
      const qs = params.toString();
      const dest = qs ? base + '?' + qs : base;

      // Give the pixel ~300ms to fire before navigating away
      setTimeout(function () { window.location.href = dest; }, 300);
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
