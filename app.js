(() => {
  'use strict';
  const config = window.FEELKS_CONFIG;
  const content = window.FEELKS_CONTENT;
  const projects = window.FEELKS_PROJECTS || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const paths = {
    coffee:'<path d="M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z"/><path d="M17 9h2a3 3 0 1 1 0 6h-2M3 23h17M7 2v2m5-2v2m5-2v2"/>',
    building:'<rect x="5" y="3" width="14" height="20" rx="2"/><path d="M10 23v-5h4v5M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1"/>',
    glass:'<path d="M4 3h16l-2 7a6 6 0 0 1-12 0L4 3ZM12 16v7M8 23h8M6 8h12"/>',
    route:'<circle cx="6" cy="5" r="3"/><circle cx="18" cy="21" r="3"/><path d="M9 5h8a4 4 0 0 1 0 8H7a4 4 0 0 0 0 8h8"/>',
    sliders:'<path d="M5 3v5m0 6v9M12 3v11m0 6v3M19 3v2m0 6v12"/><rect x="2" y="8" width="6" height="6" rx="2"/><rect x="9" y="14" width="6" height="6" rx="2"/><rect x="16" y="5" width="6" height="6" rx="2"/>',
    spark:'<path d="m13 2 2.5 7.5L23 12l-7.5 2.5L13 22l-2.5-7.5L3 12l7.5-2.5L13 2ZM4 2v4M2 4h4M22 20v4m-2-2h4"/>',
    team:'<circle cx="12" cy="7" r="4"/><path d="M5 23v-3a7 7 0 0 1 14 0v3M20 5a4 4 0 0 1 0 8m2 10v-3a6 6 0 0 0-2-4M4 5a4 4 0 0 0 0 8m-2 10v-3a6 6 0 0 1 2-4"/>',
    instagram:'<rect x="3" y="3" width="20" height="20" rx="6"/><circle cx="13" cy="13" r="4.5"/><circle cx="19" cy="7" r=".6" fill="currentColor"/>',
    whatsapp:'<path d="M22 12.5a9.5 9.5 0 0 1-14 8.4L3 22l1.2-4.8A9.5 9.5 0 1 1 22 12.5Z"/><path d="M9 7.5c-3 1 0 8 5 9 2 .3 3-2 2-2.5l-2-1-1 1c-2-.8-3-2-3.5-3.5l1-1L9 7.5Z"/>',
    info:'<circle cx="13" cy="13" r="10"/><path d="M13 11v7m0-11v.2"/>',
    check:'<path d="m5 13 5 5L22 6"/>',
    arrowNW:'<path d="M20 20 6 6M6 18V6h12"/>',
    arrowNE:'<path d="M6 20 20 6M8 6h12v12"/>',
    arrowLeft:'<path d="M22 13H4m8 8-8-8 8-8"/>',
    arrowRight:'<path d="M4 13h18m-8-8 8 8-8 8"/>',
    arrowUp:'<path d="M13 22V4m-8 8 8-8 8 8"/>',
    arrowDown:'<path d="M13 4v18m-8-8 8 8 8-8"/>'
  };
  const icon = name => `<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.coffee}</svg>`;
  const arrow = name => `<span class="arrow-icon" aria-hidden="true">${icon(name)}</span>`;
  const digits = value => String(value).replace(/[۰-۹]/g, n => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(n))).replace(/[٠-٩]/g, n => String('٠١٢٣٤٥٦٧٨٩'.indexOf(n)));
  function normalizePhone(value) { let number = digits(value).replace(/[\s\-()]/g, ''); if (number.startsWith('0098')) number = '0' + number.slice(4); else if (number.startsWith('+98')) number = '0' + number.slice(3); return number; }
  function whatsappNumber() { let number = digits(config.whatsapp?.number || '').replace(/[\s+\-()]/g, ''); if (number.startsWith('00')) number = number.slice(2); if (/^0[1-9]\d{9}$/.test(number)) number = '98' + number.slice(1); return /^[1-9]\d{7,14}$/.test(number) ? number : ''; }
  const waNumber = whatsappNumber();
  const waUrl = message => waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}` : '#contact';
  function discussionMessage(service, project) { return service ? `سلام، برای گفت‌وگو دربارهٔ «${service.title}» با فیلکس در ارتباطم.${project ? `\nتجربهٔ مورد اشاره: ${project.title}` : ''}\nمایلم دربارهٔ همکاری در این زمینه صحبت کنیم.` : 'سلام، برای گفت‌وگو دربارهٔ همکاری با فیلکس پیام می‌دهم.'; }
  function setWhatsAppLink(link, service, project) { link.href = waUrl(discussionMessage(service, project)); if (waNumber) { link.target = '_blank'; link.rel = 'noopener noreferrer'; } }

  Object.entries(config.theme).forEach(([key, value]) => {
    const names = {accent:'--accent',accentDark:'--accent-dark',accentLight:'--accent-light',ink:'--ink',muted:'--muted',warm:'--warm'};
    if (names[key]) document.documentElement.style.setProperty(names[key], value);
  });
  $('.brand-slogan').textContent = config.brand.slogan;
  document.querySelectorAll('.brand-logo').forEach(img => img.src = config.brand.logo);
  $('#hero-image').src = config.images.hero;
  const partnerImage = $('#partners-image');
  partnerImage.src = config.partners.image; partnerImage.alt = config.partners.alt;
  if (window.FEELKS_PARTNERS?.length) {
    const strip = $('.partners-strip'); strip.classList.add('has-individual-logos');
    strip.innerHTML = window.FEELKS_PARTNERS.map(p => `<div class="partner-logo" role="img" aria-label="${escape(p.label || p.name)}"><svg viewBox="${p.x} ${p.y} ${p.width} ${p.height}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href="${escape(config.partners.image)}" width="2089" height="286"/></svg></div>`).join('');
  }
  $('#service-cards').innerHTML = content.services.map((s, i) => `<a href="#${escape(s.id)}" class="service-card${i === 0 ? ' featured' : ''}" aria-label="جزئیات خدمات ${escape(s.title)}"><div class="card-image-wrap"><img class="card-image" src="${escape(config.images[s.id])}" alt="${escape(s.alt)}" width="600" height="380" loading="lazy"></div><div class="card-content"><h3 class="card-title">${escape(s.title)}</h3><p class="card-description">${escape(s.cardText)}</p><span class="card-link">جزئیات خدمات <span class="card-arrow">${arrow('arrowLeft')}</span></span></div></a>`).join('');

  const dialog = $('#media-dialog');
  function stopVideos(root) { root.querySelectorAll('video').forEach(video => video.pause()); }
  function closeDialog() { stopVideos(dialog); if (dialog.open) dialog.close(); $('.dialog-media', dialog).replaceChildren(); }
  $('.dialog-close', dialog).addEventListener('click', closeDialog);
  dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
  dialog.addEventListener('close', () => { stopVideos(dialog); $('.dialog-media', dialog).replaceChildren(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopVideos(document); });
  const browsers = new Map();
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const formatNumber = value => new Intl.NumberFormat('fa-IR').format(value);
  $('#service-details').innerHTML = content.services.map((s, i) => {
    const list = projects[s.id] || [];
    return `<section class="service-detail${i === 0 ? ' featured' : ''}" id="${escape(s.id)}" aria-labelledby="${escape(s.id)}-main-title"><div class="container detail-shell"><div class="detail-copy"><p class="detail-number"><span>${escape(s.number)}</span><strong id="${escape(s.id)}-main-title">${escape(s.title)}</strong></p><div class="detail-view" aria-live="polite" aria-atomic="true"></div><div class="detail-actions"><button class="button experiences-toggle" type="button" aria-expanded="false" aria-controls="${escape(s.id)}-experiences">تجربیات ${arrow('arrowNW')}</button></div><div class="experiences-panel" id="${escape(s.id)}-experiences" hidden><p class="experience-hover-note">یک تجربه را انتخاب کنید تا اطلاعات و رسانه‌های آن را ببینید.</p><div class="experience-options" role="group" aria-label="تجربه‌های ${escape(s.title)}"><button class="experience-option experience-reset" type="button" data-project="" aria-pressed="true">بازگشت به معرفی خدمت</button>${list.map(p => `<button class="experience-option" type="button" data-project="${escape(p.id)}" aria-pressed="false">${escape(p.title)}</button>`).join('')}</div>${list.length ? '' : '<p class="experience-empty">هنوز تجربه‌ای برای این خدمت منتشر نشده است.</p>'}<a class="button button-outline service-whatsapp experience-consultation" href="#contact" data-service="${escape(s.id)}">گفت‌وگو دربارهٔ ${escape(s.title)} ${arrow('arrowNW')}</a></div></div><figure class="detail-visual"><div class="media-stage" aria-label="رسانه‌های ${escape(s.title)}"></div><div class="media-toolbar"><button class="media-prev scroll-button" type="button" aria-label="رسانهٔ قبلی">${arrow('arrowRight')}</button><span class="media-count" aria-live="polite"></span><button class="media-next scroll-button" type="button" aria-label="رسانهٔ بعدی">${arrow('arrowLeft')}</button></div><figcaption class="media-caption"></figcaption></figure></div></section>`;
  }).join('');

  function createMedia(item, isProject) {
    const element = document.createElement(item.type === 'video' ? 'video' : 'img');
    element.src = item.src; element.className = `${isProject ? 'project-media' : 'service-media'} is-entering`;
    if (item.type === 'video') {
      element.controls = true; element.muted = true; element.autoplay = false; element.playsInline = true; element.preload = 'metadata';
      element.setAttribute('aria-label', item.alt || 'ویدئوی تجربهٔ فیلکس');
      if (item.poster) element.poster = item.poster;
      if (item.captions) { const track = document.createElement('track'); Object.assign(track, {kind:'captions',src:item.captions,srclang:'fa',label:'فارسی'}); element.append(track); }
    } else { element.alt = item.alt || ''; element.decoding = 'async'; }
    return element;
  }
  for (const service of content.services) {
    const root = document.getElementById(service.id);
    const state = { service, list: projects[service.id] || [], selected: null, preview: null, index: 0, previewIndex: 0 };
    browsers.set(service.id, state);
    const findProject = id => state.list.find(p => p.id === id) || null;
    const currentProject = () => findProject(state.preview || state.selected);
    const mediaItems = () => currentProject() ? (currentProject().media || []).filter(m => m.src && ['image','video'].includes(m.type)) : [{type:'image',src:config.images[service.id],alt:service.alt}];
    const stage = $('.media-stage', root);
    const options = [...root.querySelectorAll('.experience-option')];
    function renderMedia() {
      stopVideos(stage);
      const project = currentProject(), items = mediaItems();
      const index = state.preview ? state.previewIndex : state.index;
      const item = items[index] || items[0];
      stage.replaceChildren(); stage.classList.toggle('is-project', !!project);
      if (item) stage.append(createMedia(item, !!project));
      else { const p = document.createElement('p'); p.className = 'media-unavailable'; p.textContent = 'رسانهٔ این تجربه هنوز اضافه نشده است.'; stage.append(p); }
      $('.media-count', root).textContent = items.length ? `${formatNumber(index + 1)} از ${formatNumber(items.length)}` : 'بدون رسانه';
      $('.media-prev', root).disabled = items.length < 2; $('.media-next', root).disabled = items.length < 2;
      $('.media-caption', root).textContent = state.preview && state.preview !== state.selected ? `پیش‌نمایش: ${project.title}` : project ? project.title : 'معرفی خدمت';
      options.forEach(option => { option.setAttribute('aria-pressed', String(option.dataset.project === (state.selected || ''))); option.classList.toggle('is-preview', !!state.preview && option.dataset.project === state.preview); });
    }
    function renderCopy() {
      const project = findProject(state.selected);
      const items = project ? project.items || [] : service.items;
      $('.detail-view', root).innerHTML = `<h2 class="detail-project-title">${escape(project ? project.title : service.heading)}</h2>${project ? '' : `<p class="detail-audience">${escape(service.audience)}</p>`}<p class="detail-description">${escape(project ? project.description : service.description)}</p>${items.length ? `<ul class="detail-items">${items.map(item => `<li><span class="check-icon">${icon('check')}</span><span>${escape(item)}</span></li>`).join('')}</ul>` : '<p class="detail-note">جزئیات اقدامات این پروژه هنوز منتشر نشده است.</p>'}<p class="detail-collaboration detail-note"><strong>نوع همکاری: </strong>${escape(project ? project.collaboration || 'اطلاعات نوع همکاری این پروژه هنوز تکمیل نشده است.' : service.collaboration || service.note)}</p>`;
      setWhatsAppLink($('.service-whatsapp', root), service, project);
      $('.service-whatsapp', root).dataset.project = state.selected || '';
    }
    function selectProject(id) { closeDialog(); state.selected = findProject(id)?.id || null; state.preview = null; state.index = 0; state.previewIndex = 0; renderCopy(); renderMedia(); }
    const toggle = $('.experiences-toggle', root);
    toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); $('.experiences-panel', root).hidden = !open; if (!open) { state.preview = null; renderMedia(); } });
    options.forEach(option => {
      option.addEventListener('click', () => selectProject(option.dataset.project));
      option.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse' && finePointer.matches && option.dataset.project && option.dataset.project !== state.selected) { state.preview = option.dataset.project; state.previewIndex = 0; renderMedia(); } });
    });
    $('.experiences-panel', root).addEventListener('pointerleave', () => { if (state.preview) { state.preview = null; renderMedia(); } });
    $('.experience-options', root).addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
      const current = options.indexOf(document.activeElement); if (current < 0) return;
      event.preventDefault(); const delta = ['ArrowLeft','ArrowDown'].includes(event.key) ? 1 : -1;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (current + delta + options.length) % options.length; options[next].focus();
    });
    const changeSlide = delta => { const items = mediaItems(); if (items.length < 2) return; if (state.preview) state.previewIndex = (state.previewIndex + delta + items.length) % items.length; else state.index = (state.index + delta + items.length) % items.length; renderMedia(); };
    $('.media-prev', root).addEventListener('click', () => changeSlide(-1)); $('.media-next', root).addEventListener('click', () => changeSlide(1));
    renderCopy(); renderMedia();
    // جای متن معرفی را حفظ می‌کنیم تا انتخاب تجربه، باکس رسانه و صفحه را جابه‌جا نکند.
    const view = $('.detail-view', root), defaultMarkup = view.innerHTML;
    function preserveCopyHeight() {
      const probe = document.createElement('div'); probe.className = 'detail-view'; probe.innerHTML = defaultMarkup;
      Object.assign(probe.style, {position:'absolute',visibility:'hidden',pointerEvents:'none',width:`${view.getBoundingClientRect().width}px`,minHeight:'0',left:'0',top:'0'});
      probe.setAttribute('aria-hidden','true'); $('.detail-copy', root).append(probe);
      view.style.minHeight = `${Math.ceil(probe.getBoundingClientRect().height)}px`; probe.remove();
    }
    let copyWidth = 0;
    if ('ResizeObserver' in window) new ResizeObserver(entries => { const width = entries[0].contentRect.width; if (Math.abs(width - copyWidth) > 1) { copyWidth = width; preserveCopyHeight(); } }).observe(view);
    document.fonts?.ready.then(preserveCopyHeight);
  }

  $('#benefit-cards').innerHTML = content.benefits.map(b => `<article class="benefit-card"><span class="benefit-icon">${icon(b.icon)}</span><h3>${escape(b.title)}</h3><p>${escape(b.text)}</p></article>`).join('');
  $('#process-steps').innerHTML = content.process.map(s => `<li class="process-step"><span class="step-number">${escape(s.number)}</span><h3>${escape(s.title)}</h3><p>${escape(s.text)}</p></li>`).join('');
  $('#faq-list').innerHTML = content.faq.map(f => `<details class="faq-item"><summary>${escape(f.q)}</summary><p>${escape(f.a)}</p></details>`).join('');
  document.querySelectorAll('[data-icon]').forEach(element => element.innerHTML = icon(element.dataset.icon));
  const arrows = {'↖':'arrowNW','↗':'arrowNE','←':'arrowLeft','→':'arrowRight','↑':'arrowUp','↓':'arrowDown'};
  document.querySelectorAll('span[aria-hidden="true"]').forEach(element => { const name = arrows[element.textContent.trim()]; if (name) { element.classList.add('arrow-icon'); element.innerHTML = icon(name); } });
  document.querySelectorAll('[data-whatsapp]').forEach(link => setWhatsAppLink(link));
  $('#whatsapp-number').textContent = config.whatsapp?.number || '';
  if (!waNumber) $('#whatsapp-main').hidden = true;
  const contactDetails = $('#contact-details');
  for (const [key, prefix] of [['phone','tel:'],['email','mailto:'],['address',null]]) {
    if (!config.contact[key]) continue;
    const element = document.createElement(prefix ? 'a' : 'p'); element.textContent = config.contact[key];
    if (prefix) { element.href = prefix + config.contact[key]; element.dir = 'ltr'; }
    contactDetails.append(element);
  }
  document.querySelectorAll('a[href*="instagram.com"]:not(.instagram-card)').forEach(link => { link.href = `https://www.instagram.com/${encodeURIComponent(config.contact.instagram)}/`; });

  const menuToggle = $('.menu-toggle'), nav = $('#main-nav');
  const closeMenu = () => { menuToggle.setAttribute('aria-expanded','false'); menuToggle.setAttribute('aria-label','باز کردن منو'); nav.classList.remove('is-open'); };
  menuToggle.addEventListener('click', () => { const open = menuToggle.getAttribute('aria-expanded') !== 'true'; menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو'); nav.classList.toggle('is-open',open); });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') { closeMenu(); menuToggle.focus(); } });
  document.addEventListener('click', event => { if (!nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu(); });
  matchMedia('(max-width:680px)').addEventListener('change',closeMenu);

  const form = $('#cooperation-form'), serviceSelect = $('#service'), status = $('#form-status');
  const fields = ['full-name','phone','service'].map(id => document.getElementById(id));
  let formProject = null;
  function clearError(input) { input.removeAttribute('aria-invalid'); const error = document.getElementById(input.id + '-error'); if (error) error.textContent = ''; }
  function validate(input) {
    let error = '';
    if (input.id === 'full-name' && input.value.trim().length < 3) error = 'لطفاً نام و نام خانوادگی خود را کامل وارد کنید.';
    if (input.id === 'phone' && !/^0[1-9][0-9]{9}$/.test(normalizePhone(input.value))) error = 'لطفاً شماره تماس معتبر، مانند ۰۹۱۲۳۴۵۶۷۸۹ وارد کنید.';
    if (input.id === 'service' && !content.services.some(service => service.id === input.value)) error = 'لطفاً نوع خدمت مورد نظر را انتخاب کنید.';
    clearError(input); if (error) { input.setAttribute('aria-invalid','true'); document.getElementById(input.id + '-error').textContent = error; } return !error;
  }
  function renderContext() { const context = $('#form-context'); context.hidden = !formProject; $('span',context).textContent = formProject ? `تجربهٔ مورد اشاره: ${formProject.title}` : ''; }
  $('.form-context button').addEventListener('click', () => { formProject = null; renderContext(); });
  document.querySelectorAll('.service-whatsapp').forEach(link => link.addEventListener('click', () => { serviceSelect.value = link.dataset.service; clearError(serviceSelect); formProject = (projects[link.dataset.service] || []).find(project => project.id === link.dataset.project) || null; renderContext(); status.hidden = true; }));
  serviceSelect.addEventListener('change', () => { formProject = null; renderContext(); });
  fields.forEach(input => { input.addEventListener('blur', () => { if (input.value || input.hasAttribute('aria-invalid')) validate(input); }); input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', () => { if (input.hasAttribute('aria-invalid')) validate(input); status.hidden = true; }); });
  if (!waNumber) { $('#form-notice').innerHTML = '<p>شمارهٔ واتساپ هنوز تنظیم نشده است؛ فعلاً پیامی ارسال نمی‌شود.</p>'; }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!fields.map(validate).every(Boolean)) { status.hidden = true; $('[aria-invalid="true"]',form).focus(); return; }
    if (!waNumber) { status.textContent = 'شمارهٔ واتساپ فیلکس هنوز تنظیم نشده است. پیامی ارسال نشد.'; status.hidden = false; return; }
    const service = content.services.find(s => s.id === serviceSelect.value);
    const lines = ['سلام، برای گفت‌وگو دربارهٔ همکاری با فیلکس پیام می‌دهم.', `نام و نام خانوادگی: ${form.elements.fullName.value.trim()}`, `شماره تماس: ${normalizePhone(form.elements.phone.value)}`, `نام شرکت یا مجموعه: ${form.elements.company.value.trim() || 'ذکر نشده'}`, `خدمت مورد نظر: ${service.title}`];
    if (formProject) lines.push(`تجربهٔ مورد اشاره: ${formProject.title}`);
    if (form.elements.need.value.trim()) lines.push(`توضیحات: ${form.elements.need.value.trim()}`);
    const url = waUrl(lines.join('\n'));
    status.replaceChildren(document.createTextNode('پیش‌نویس پیام آماده است؛ ارسال نهایی را در واتساپ انجام دهید. '));
    const fallback = document.createElement('a'); fallback.href = url; fallback.target = '_blank'; fallback.rel = 'noopener noreferrer'; fallback.textContent = 'باز کردن پیش‌نویس در واتساپ'; status.append(fallback); status.hidden = false;
    window.open(url,'_blank','noopener,noreferrer');
  });
  // داده‌های فرم تنها برای ساخت پیش‌نویس استفاده می‌شوند؛ هیچ API یا ذخیره‌سازی محلی نداریم.
  if (location.hash) requestAnimationFrame(() => { try { document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({behavior:'instant'}); } catch (_) {} });
})();
