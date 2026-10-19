(() => {
  'use strict';
  const config = window.FEELKS_CONFIG;
  const content = window.FEELKS_CONTENT;
  const escape = (text) => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const paths = {
    coffee: '<path d="M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z"/><path d="M17 9h2a3 3 0 1 1 0 6h-2M3 23h17M7 2v2m5-2v2m5-2v2"/>',
    building: '<rect x="5" y="3" width="14" height="20" rx="2"/><path d="M10 23v-5h4v5M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1"/>',
    glass: '<path d="M4 3h16l-2 7a6 6 0 0 1-12 0L4 3ZM12 16v7M8 23h8M6 8h12"/>',
    route: '<circle cx="6" cy="5" r="3"/><circle cx="18" cy="21" r="3"/><path d="M9 5h8a4 4 0 0 1 0 8H7a4 4 0 0 0 0 8h8"/>',
    sliders: '<path d="M5 3v5m0 6v9M12 3v11m0 6v3M19 3v2m0 6v12"/><rect x="2" y="8" width="6" height="6" rx="2"/><rect x="9" y="14" width="6" height="6" rx="2"/><rect x="16" y="5" width="6" height="6" rx="2"/>',
    spark: '<path d="m13 2 2.5 7.5L23 12l-7.5 2.5L13 22l-2.5-7.5L3 12l7.5-2.5L13 2ZM4 2v4M2 4h4M22 20v4m-2-2h4"/>',
    team: '<circle cx="12" cy="7" r="4"/><path d="M5 23v-3a7 7 0 0 1 14 0v3M20 5a4 4 0 0 1 0 8m2 10v-3a6 6 0 0 0-2-4M4 5a4 4 0 0 0 0 8m-2 10v-3a6 6 0 0 1 2-4"/>',
    instagram: '<rect x="3" y="3" width="20" height="20" rx="6"/><circle cx="13" cy="13" r="4.5"/><circle cx="19" cy="7" r=".6" fill="currentColor"/>',
    info: '<circle cx="13" cy="13" r="10"/><path d="M13 11v7m0-11v.2"/>',
    check: '<path d="m5 13 5 5L22 6"/>',
    arrowNW: '<path d="M20 20 6 6M6 18V6h12"/>',
    arrowNE: '<path d="M6 20 20 6M8 6h12v12"/>',
    arrowLeft: '<path d="M22 13H4m8 8-8-8 8-8"/>',
    arrowUp: '<path d="M13 22V4m-8 8 8-8 8 8"/>',
    arrowDown: '<path d="M13 4v18m-8-8 8 8 8-8"/>'
  };
  const icon = name => `<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.coffee}</svg>`;
  Object.entries(config.theme).forEach(([key, value]) => {
    const names = { accent: '--accent', accentDark: '--accent-dark', accentLight: '--accent-light' };
    if (names[key]) document.documentElement.style.setProperty(names[key], value);
  });
  document.getElementById('hero-image').src = config.images.hero;
  document.getElementById('service-cards').innerHTML = content.services.map((s, i) => `
    <a href="#${escape(s.id)}" class="service-card${i === 0 ? ' featured' : ''}" aria-label="جزئیات خدمات ${escape(s.title)}">
      <div class="card-image-wrap"><img class="card-image" src="${escape(config.images[s.id])}" alt="${escape(s.alt)}" width="600" height="380" loading="lazy">${i === 0 ? '<span class="card-badge">خدمت محوری فیلکس</span>' : ''}</div>
      <div class="card-content"><h3 class="card-title">${escape(s.title)}</h3><p class="card-description">${escape(s.cardText)}</p><span class="card-link">جزئیات خدمات <span class="card-arrow" aria-hidden="true">←</span></span></div>
    </a>`).join('');
  document.getElementById('service-details').innerHTML = content.services.map((s, i) => `
    <section class="service-detail${i === 0 ? ' featured' : ''}" id="${escape(s.id)}" aria-labelledby="${escape(s.id)}-title"><div class="container detail-shell">
      <div class="detail-copy"><p class="detail-number"><span>${escape(s.number)}</span> ${escape(s.title)}</p><h2 id="${escape(s.id)}-title">${escape(s.heading)}</h2><p class="detail-audience">${escape(s.audience)}</p><p class="detail-description">${escape(s.description)}</p><ul class="detail-items">${s.items.map(item => `<li><span class="check-icon">${icon('check')}</span><span>${escape(item)}</span></li>`).join('')}</ul><p class="detail-note">${escape(s.note)}</p><a class="button" href="#contact" data-service="${escape(s.id)}">${escape(s.cta)} <span aria-hidden="true">↖</span></a></div>
      <figure class="detail-visual"><img src="${escape(config.images[s.id])}" alt="${escape(s.alt)}" width="700" height="800" loading="lazy"><span class="detail-visual-label">${icon(s.icon)} ${escape(s.tag)}</span><figcaption>تصویر عمومی برای معرفی خدمت؛ عکس پروژهٔ فیلکس نیست.</figcaption></figure>
    </div></section>`).join('');
  document.getElementById('benefit-cards').innerHTML = content.benefits.map(b => `<article class="benefit-card"><span class="benefit-icon">${icon(b.icon)}</span><h3>${escape(b.title)}</h3><p>${escape(b.text)}</p></article>`).join('');
  document.getElementById('process-steps').innerHTML = content.process.map(s => `<li class="process-step"><span class="step-number">${escape(s.number)}</span><h3>${escape(s.title)}</h3><p>${escape(s.text)}</p></li>`).join('');
  document.getElementById('faq-list').innerHTML = content.faq.map(f => `<details class="faq-item"><summary>${escape(f.q)}</summary><p>${escape(f.a)}</p></details>`).join('');
  document.querySelectorAll('[data-icon]').forEach(el => el.innerHTML = icon(el.dataset.icon));
  const arrows = { '↖': 'arrowNW', '↗': 'arrowNE', '←': 'arrowLeft', '↑': 'arrowUp', '↓': 'arrowDown' };
  document.querySelectorAll('span[aria-hidden="true"]').forEach(el => {
    const name = arrows[el.textContent.trim()];
    if (name) { el.classList.add('arrow-icon'); el.innerHTML = icon(name); }
  });

  const contactDetails = document.getElementById('contact-details');
  if (config.contact.phone) {
    const a = document.createElement('a'); a.href = 'tel:' + normalizeDigits(config.contact.phone).replace(/[^+0-9]/g, ''); a.dir = 'ltr'; a.textContent = config.contact.phone; contactDetails.append(a);
  }
  if (config.contact.email) {
    const a = document.createElement('a'); a.href = 'mailto:' + config.contact.email; a.dir = 'ltr'; a.textContent = config.contact.email; contactDetails.append(a);
  }
  if (config.contact.address) { const p = document.createElement('p'); p.textContent = config.contact.address; contactDetails.append(p); }
  document.querySelectorAll('a[href*="instagram.com"]').forEach(a => {
    a.href = 'https://www.instagram.com/' + encodeURIComponent(config.contact.instagram) + '/';
    const label = a.querySelector('[dir="ltr"]'); if (label) label.textContent = (a.classList.contains('instagram-link') ? '@' : '') + config.contact.instagram;
  });

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  const closeMenu = () => { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'باز کردن منو'); nav.classList.remove('is-open'); };
  toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو'); nav.classList.toggle('is-open', open); });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
  document.addEventListener('click', event => { if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu(); });
  const mobile = matchMedia('(max-width: 680px)');
  mobile.addEventListener('change', closeMenu);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { nav.querySelectorAll('a[aria-current]').forEach(a => a.removeAttribute('aria-current')); const a = nav.querySelector(`a[href="#${entry.target.id}"]`); if (a) a.setAttribute('aria-current', 'location'); } });
    }, {rootMargin: '-15% 0px -60% 0px', threshold: 0});
    ['services', 'experience', 'process', 'contact'].forEach(id => observer.observe(document.getElementById(id)));
  }

  const form = document.getElementById('cooperation-form');
  const serviceSelect = document.getElementById('service');
  const status = document.getElementById('form-status');
  const submit = document.getElementById('form-submit');
  const fields = ['full-name', 'phone', 'service'].map(id => document.getElementById(id));
  document.querySelectorAll('[data-service]').forEach(a => a.addEventListener('click', () => {
    serviceSelect.value = a.dataset.service;
    clearError(serviceSelect);
    status.hidden = true;
  }));
  function normalizeDigits(value) { return String(value).replace(/[۰-۹]/g, n => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(n))).replace(/[٠-٩]/g, n => String('٠١٢٣٤٥٦٧٨٩'.indexOf(n))); }
  function normalizePhone(value) { let phone = normalizeDigits(value).replace(/[\s\-()]/g, ''); if (phone.startsWith('0098')) phone = '0' + phone.slice(4); else if (phone.startsWith('+98')) phone = '0' + phone.slice(3); return phone; }
  function clearError(input) { input.removeAttribute('aria-invalid'); const error = document.getElementById(input.id + '-error'); if (error) error.textContent = ''; }
  function validate(input) {
    let error = '';
    if (input.id === 'full-name') { if (!input.value.trim()) error = 'لطفاً نام و نام خانوادگی خود را وارد کنید.'; else if (input.value.trim().length < 3) error = 'لطفاً نام و نام خانوادگی را کامل وارد کنید.'; }
    if (input.id === 'phone') { if (!input.value.trim()) error = 'لطفاً شماره تماس خود را وارد کنید.'; else if (!/^0[1-9][0-9]{9}$/.test(normalizePhone(input.value))) error = 'شماره تماس معتبر، مانند ۰۹۱۲۳۴۵۶۷۸۹ یا ۰۲۱۱۲۳۴۵۶۷۸ وارد کنید.'; }
    if (input.id === 'service' && !content.services.some(s => s.id === input.value)) error = 'لطفاً نوع خدمت مورد نظر را انتخاب کنید.';
    clearError(input);
    if (error) { input.setAttribute('aria-invalid', 'true'); document.getElementById(input.id + '-error').textContent = error; }
    return !error;
  }
  fields.forEach(input => { input.addEventListener('blur', () => { if (input.value || input.getAttribute('aria-invalid')) validate(input); }); input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', () => { if (input.getAttribute('aria-invalid')) validate(input); status.hidden = true; }); });
  function showStatus(message, type = '') { status.textContent = message; status.className = 'form-status' + (type ? ' is-' + type : ''); status.hidden = false; status.focus({preventScroll:true}); }
  const connected = typeof config.form.endpoint === 'string' && config.form.endpoint.startsWith('https://');
  if (connected) {
    document.getElementById('form-notice').hidden = true;
    document.getElementById('form-help').textContent = 'اطلاعات این فرم برای بررسی درخواست همکاری ارسال می‌شود.';
    submit.innerHTML = 'ارسال درخواست همکاری <span aria-hidden="true">←</span>';
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const valid = fields.map(validate).every(Boolean);
    if (!valid) { status.hidden = true; form.querySelector('[aria-invalid="true"]').focus(); return; }
    if (!connected) { showStatus('اطلاعات فرم معتبر است. ارسال هنوز فعال نیست؛ هیچ درخواستی ثبت نشده و اطلاعات شما ارسال یا ذخیره نشده است. برای ارتباط با فیلکس می‌توانید از پیوند اینستاگرام استفاده کنید.'); return; }
    const payload = { fullName: form.elements.fullName.value.trim(), phone: normalizePhone(form.elements.phone.value), company: form.elements.company.value.trim(), service: serviceSelect.value, need: form.elements.need.value.trim() };
    submit.disabled = true; submit.textContent = 'در حال ارسال…';
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(config.form.endpoint, { method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body:JSON.stringify(payload), signal:controller.signal });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error('not-confirmed');
      showStatus('درخواست شما ثبت شد. سپاس از اینکه نیازتان را با فیلکس در میان گذاشتید.', 'success');
      form.reset(); fields.forEach(clearError);
    } catch (_) { showStatus('ارسال درخواست تأیید نشد. لطفاً دوباره تلاش کنید یا از طریق اینستاگرام با ما در ارتباط باشید.', 'error'); }
    finally { clearTimeout(timeout); submit.disabled = false; submit.innerHTML = 'ارسال درخواست همکاری <span aria-hidden="true">←</span>'; }
  });
  // اجرای مستقیم فایل نیز پشتیبانی می‌شود؛ فایل‌های JS عمداً ماژول نیستند.
  if (location.hash) requestAnimationFrame(() => { const target = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (target) target.scrollIntoView({behavior:'instant'}); });
})();
