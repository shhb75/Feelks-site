/* دیدگاه‌ها و گالری؛ فقط محتوای واقعیِ ثبت‌شده در تنظیمات نمایش داده می‌شود. */
(() => {
  'use strict';

  let initialized = false;
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const safeUrl = value => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value, document.baseURI);
      return /^(https?:)$/.test(url.protocol) ? url.href : '';
    } catch (_) { return ''; }
  };
  const arrow = direction => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="${direction === 'right' ? 'm9 5 7 7-7 7' : 'm15 5-7 7 7 7'}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  function initTestimonials(content) {
    const track = document.getElementById('testimonial-track');
    if (!track) return;
    const previous = document.getElementById('testimonial-prev');
    const next = document.getElementById('testimonial-next');
    const services = Array.isArray(content.services) ? content.services : [];
    const entries = Array.isArray(content.testimonials) ? content.testimonials : [];
    const cards = [];
    track.replaceChildren();
    track.dir = 'rtl';
    track.tabIndex = 0;
    track.setAttribute('role', 'region');
    if (!track.hasAttribute('aria-label') && !track.hasAttribute('aria-labelledby')) {
      track.setAttribute('aria-label', 'دیدگاه مشتریان به تفکیک خدمات');
    }

    services.forEach(service => {
      const matching = entries.filter(item => item && item.service === service.id && typeof item.quote === 'string' && item.quote.trim());
      (matching.length ? matching : [null]).forEach(item => {
        const card = el('article', 'testimonial-card' + (item ? '' : ' testimonial-placeholder'));
        card.dataset.service = service.id;
        card.append(el('span', 'testimonial-service', service.title));
        if (!item) {
          card.append(el('h3', '', 'دیدگاه این خدمت هنوز منتشر نشده است'));
          card.setAttribute('aria-label', service.title + '؛ هنوز دیدگاهی منتشر نشده است');
        } else {
          card.append(el('blockquote', 'testimonial-quote', item.quote.trim()));
          const author = el('div', 'testimonial-author');
          const imageUrl = safeUrl(item.image);
          if (imageUrl) {
            const image = el('img', 'testimonial-avatar');
            image.src = imageUrl;
            image.alt = item.name ? 'تصویر ' + item.name : '';
            image.loading = 'lazy';
            image.decoding = 'async';
            image.width = 48;
            image.height = 48;
            image.addEventListener('error', () => image.remove(), { once: true });
            author.append(image);
          }
          const identity = el('div', 'testimonial-identity');
          if (item.name) identity.append(el('strong', '', item.name));
          const detail = [item.role, item.company].filter(value => typeof value === 'string' && value.trim()).join(' · ');
          if (detail) identity.append(el('span', '', detail));
          if (identity.childElementCount) author.append(identity);
          if (author.childElementCount) card.append(author);
        }
        track.append(card);
        cards.push(card);
      });
    });

    if (previous) {
      previous.innerHTML = arrow('right');
      previous.setAttribute('aria-label', 'دیدگاه قبلی');
      previous.setAttribute('aria-controls', track.id);
    }
    if (next) {
      next.innerHTML = arrow('left');
      next.setAttribute('aria-label', 'دیدگاه بعدی');
      next.setAttribute('aria-controls', track.id);
    }
    const edges = () => {
      const box = track.getBoundingClientRect();
      const style = getComputedStyle(track);
      return {
        left: box.left + parseFloat(style.borderLeftWidth || 0) + parseFloat(style.paddingLeft || 0),
        right: box.right - parseFloat(style.borderRightWidth || 0) - parseFloat(style.paddingRight || 0)
      };
    };
    const update = () => {
      const bounds = edges();
      const fits = track.scrollWidth <= track.clientWidth + 2 || cards.length < 2;
      if (previous) previous.disabled = fits || !cards.length || cards[0].getBoundingClientRect().right <= bounds.right + 2;
      if (next) next.disabled = fits || !cards.length || cards[cards.length - 1].getBoundingClientRect().left >= bounds.left - 2;
    };
    const move = step => {
      if (!cards.length) return;
      const bounds = edges();
      let nearest = 0;
      let distance = Infinity;
      cards.forEach((card, index) => {
        const current = Math.abs(card.getBoundingClientRect().right - bounds.right);
        if (current < distance) { distance = current; nearest = index; }
      });
      const target = cards[Math.max(0, Math.min(cards.length - 1, nearest + step))];
      // Scroll only this region: scrollIntoView would also move the page vertically.
      track.scrollBy({
        left: target.getBoundingClientRect().right - bounds.right,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    };
    previous?.addEventListener('click', () => move(-1));
    next?.addEventListener('click', () => move(1));
    track.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.target !== track) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        move(event.key === 'ArrowLeft' ? 1 : -1);
      }
    });
    let pending = false;
    track.addEventListener('scroll', () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => { pending = false; update(); });
      }
    }, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
    else window.addEventListener('resize', update, { passive: true });
    update();
  }

  function initInstagram(config) {
    const gallery = document.getElementById('instagram-gallery');
    const empty = document.getElementById('instagram-empty');
    const track = document.getElementById('instagram-track');
    const pause = document.getElementById('instagram-pause');
    if (!gallery || !track) return;
    const photos = (Array.isArray(config.instagram?.photos) ? config.instagram.photos : []).filter(photo => photo && safeUrl(photo.src));
    gallery.hidden = photos.length === 0;
    if (empty) empty.hidden = photos.length > 0;
    track.replaceChildren();
    if (!photos.length) { if (pause) pause.hidden = true; return; }

    const account = typeof config.contact?.instagram === 'string' ? config.contact.instagram : 'feelks.cafe';
    const profile = 'https://www.instagram.com/' + encodeURIComponent(account) + '/';
    track.dir = 'ltr';
    // Continuous movement needs fractional offsets and must not fight CSS snapping.
    track.style.scrollBehavior = 'auto';
    track.style.scrollSnapType = 'none';
    track.tabIndex = 0;
    track.setAttribute('role', 'region');
    if (!track.hasAttribute('aria-label') && !track.hasAttribute('aria-labelledby')) track.setAttribute('aria-label', 'تصاویر اینستاگرام فیلکس');
    const originals = photos.map(photo => {
      const card = el('a', 'instagram-card');
      card.href = safeUrl(photo.href) || profile;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      const image = el('img');
      image.src = safeUrl(photo.src);
      image.alt = typeof photo.alt === 'string' && photo.alt.trim() ? photo.alt : 'تصویر منتشرشده در اینستاگرام فیلکس';
      image.loading = 'lazy';
      image.decoding = 'async';
      card.append(image);
      track.append(card);
      return card;
    });

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let userPaused = reducedMotion.matches;
    let hovering = false;
    let focusing = false;
    let pointerDown = false;
    let manualUntil = 0;
    let resumeTimer = 0;
    let animation = 0;
    let lastFrame = 0;
    let motionLeft = 0;
    let cycleWidth = 0;
    let loop = false;
    const buttonState = () => {
      if (!pause) return;
      pause.hidden = !loop;
      pause.setAttribute('aria-pressed', String(userPaused));
      pause.setAttribute('aria-controls', track.id);
      pause.textContent = userPaused ? 'ادامهٔ حرکت تصاویر' : 'توقف حرکت تصاویر';
    };
    const canMove = () => loop && !userPaused && !hovering && !focusing && !pointerDown && !document.hidden && performance.now() >= manualUntil;
    const stop = () => {
      cancelAnimationFrame(animation);
      animation = 0;
      lastFrame = 0;
    };
    const frame = now => {
      animation = 0;
      if (!canMove()) { lastFrame = 0; return; }
      if (lastFrame) {
        const delta = Math.min(now - lastFrame, 64) * 0.016;
        motionLeft += delta;
        if (motionLeft >= cycleWidth) motionLeft %= cycleWidth;
        track.scrollLeft = motionLeft;
      }
      lastFrame = now;
      animation = requestAnimationFrame(frame);
    };
    const sync = () => {
      buttonState();
      if (canMove()) {
        if (!animation) { lastFrame = 0; motionLeft = track.scrollLeft; animation = requestAnimationFrame(frame); }
      } else stop();
    };
    const manualPause = () => {
      manualUntil = performance.now() + 1800;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(sync, 1850);
      sync();
    };
    const rebuild = () => {
      stop();
      const position = cycleWidth ? track.scrollLeft % cycleWidth : track.scrollLeft;
      track.querySelectorAll('[data-instagram-clone]').forEach(node => node.remove());
      track.scrollLeft = 0;
      loop = originals.length > 1;
      cycleWidth = 0;
      if (loop) {
        const appendCycle = () => originals.forEach(original => {
            const copy = original.cloneNode(true);
            copy.dataset.instagramClone = '';
            copy.setAttribute('aria-hidden', 'true');
            copy.tabIndex = -1;
            copy.querySelectorAll('img').forEach(image => { image.alt = ''; image.loading = 'eager'; });
            track.append(copy);
          });
        appendCycle();
        const firstCopy = track.querySelector('[data-instagram-clone]');
        cycleWidth = firstCopy.getBoundingClientRect().left - originals[0].getBoundingClientRect().left;
        if (cycleWidth > 0) {
          // Short source strips still need enough repeats to cover the viewport at the wrap point.
          const repeatCount = Math.ceil(track.clientWidth / cycleWidth);
          for (let index = 1; index < repeatCount; index += 1) appendCycle();
          if (track.scrollWidth < track.clientWidth + cycleWidth) appendCycle();
        } else loop = false;
      }
      track.scrollLeft = cycleWidth ? position % cycleWidth : position;
      sync();
    };
    pause?.addEventListener('click', () => { userPaused = !userPaused; sync(); });
    track.addEventListener('mouseenter', () => { hovering = true; sync(); });
    track.addEventListener('mouseleave', () => { hovering = false; sync(); });
    track.addEventListener('focusin', () => { focusing = true; sync(); });
    track.addEventListener('focusout', () => {
      requestAnimationFrame(() => { focusing = track.contains(document.activeElement); sync(); });
    });
    track.addEventListener('pointerdown', () => { pointerDown = true; sync(); }, { passive: true });
    const endPointer = () => {
      if (pointerDown) { pointerDown = false; manualPause(); }
    };
    window.addEventListener('pointerup', endPointer, { passive: true });
    window.addEventListener('pointercancel', endPointer, { passive: true });
    track.addEventListener('wheel', manualPause, { passive: true });
    track.addEventListener('keydown', event => {
      if (event.target !== track || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        manualPause();
        track.scrollBy({ left: (event.key === 'ArrowLeft' ? -1 : 1) * track.clientWidth * 0.75, behavior: 'auto' });
      }
    });
    track.addEventListener('scroll', () => {
      // Keep a user who reaches the repeated strip inside the equivalent original cycle.
      if (loop && cycleWidth && track.scrollLeft >= cycleWidth) track.scrollLeft %= cycleWidth;
    }, { passive: true });
    document.addEventListener('visibilitychange', sync);
    const motionChanged = () => { if (reducedMotion.matches) userPaused = true; sync(); };
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', motionChanged);
    else reducedMotion.addListener(motionChanged);
    if ('ResizeObserver' in window) new ResizeObserver(rebuild).observe(track);
    else window.addEventListener('resize', rebuild, { passive: true });
    originals.forEach(card => card.querySelector('img').addEventListener('load', rebuild, { once: true }));
    rebuild();
  }

  function init() {
    if (initialized) return;
    initialized = true;
    initTestimonials(window.FEELKS_CONTENT || {});
    initInstagram(window.FEELKS_CONFIG || {});
  }
  window.FEELKS_ENGAGEMENT = { init };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
