(function () {
  var nav = document.querySelector('.site-nav');
  if (!nav) return;
  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

(function () {
  var galleryImgs = Array.prototype.slice.call(document.querySelectorAll('.gallery img'));
  var priceCards = Array.prototype.slice.call(document.querySelectorAll('.price-card[data-lightbox-img]'));
  if (!galleryImgs.length && !priceCards.length) return;

  var lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML =
    '<button type="button" class="lightbox-btn lightbox-close" aria-label="Close">&#10005;</button>' +
    '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous image">&#8249;</button>' +
    '<button type="button" class="lightbox-btn lightbox-next" aria-label="Next image">&#8250;</button>' +
    '<figure class="lightbox-figure">' +
      '<img alt="">' +
      '<figcaption class="lightbox-caption"></figcaption>' +
    '</figure>';
  document.body.appendChild(lightbox);

  var imgEl = lightbox.querySelector('img');
  var captionEl = lightbox.querySelector('.lightbox-caption');
  var closeBtn = lightbox.querySelector('.lightbox-close');
  var prevBtn = lightbox.querySelector('.lightbox-prev');
  var nextBtn = lightbox.querySelector('.lightbox-next');
  var currentIndex = 0;
  var galleryMode = false;
  var lastFocused = null;

  function captionFor(img) {
    var figcaption = img.closest('figure').querySelector('figcaption');
    return figcaption ? figcaption.textContent : img.alt;
  }

  function show(index) {
    currentIndex = (index + galleryImgs.length) % galleryImgs.length;
    var img = galleryImgs[currentIndex];
    imgEl.src = img.currentSrc || img.src;
    imgEl.alt = img.alt;
    captionEl.textContent = captionFor(img);
  }

  function openGallery(index) {
    galleryMode = true;
    lightbox.classList.remove('is-single');
    prevBtn.style.display = '';
    nextBtn.style.display = '';
    lastFocused = document.activeElement;
    show(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function openSingle(src, alt, caption) {
    galleryMode = false;
    lightbox.classList.add('is-single');
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    lastFocused = document.activeElement;
    imgEl.src = src;
    imgEl.alt = alt || '';
    captionEl.textContent = caption || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.classList.remove('is-single');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  galleryImgs.forEach(function (img, index) {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Enlarge image: ' + (img.alt || ''));
    img.addEventListener('click', function () { openGallery(index); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGallery(index);
      }
    });
  });

  priceCards.forEach(function (card) {
    var src = card.getAttribute('data-lightbox-img');
    var alt = card.getAttribute('data-lightbox-alt') || '';
    var caption = (card.querySelector('.room-name') || {}).textContent || alt;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'View room photo: ' + caption);
    card.addEventListener('click', function () { openSingle(src, alt, caption); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openSingle(src, alt, caption);
      }
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { if (galleryMode) show(currentIndex - 1); });
  nextBtn.addEventListener('click', function () { if (galleryMode) show(currentIndex + 1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (galleryMode && e.key === 'ArrowLeft') show(currentIndex - 1);
    if (galleryMode && e.key === 'ArrowRight') show(currentIndex + 1);
  });
})();

(function () {
  var track = document.getElementById('programDays');
  if (!track) return;
  var days = Array.prototype.slice.call(track.querySelectorAll('.program-day'));
  var prevBtn = document.getElementById('dayPrev');
  var nextBtn = document.getElementById('dayNext');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          days.forEach(function (d) { d.classList.remove('is-active'); });
          entry.target.classList.add('is-active');
        }
      });
    }, { root: track, rootMargin: '0px -35% 0px -35%', threshold: 0.6 });
    days.forEach(function (d) { observer.observe(d); });
  }

  function scrollByCard(dir) {
    var card = days[0];
    var amount = card ? card.getBoundingClientRect().width + 24 : 300;
    track.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }
  if (prevBtn) prevBtn.addEventListener('click', function () { scrollByCard(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { scrollByCard(1); });

  track.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      track.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });
})();

(function () {
  var fab = document.querySelector('.contact-fab');
  if (!fab) return;
  var mainBtn = fab.querySelector('.contact-fab-main');

  function close() {
    fab.classList.remove('is-open');
    mainBtn.setAttribute('aria-expanded', 'false');
  }
  function toggle() {
    var isOpen = fab.classList.toggle('is-open');
    mainBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  mainBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    toggle();
  });

  document.addEventListener('click', function (e) {
    if (!fab.contains(e.target)) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();

(function () {
  var widget = document.querySelector('.chatbot-widget');
  if (!widget) return;
  var toggleBtn = widget.querySelector('.chatbot-toggle');
  var closeBtn = widget.querySelector('.chatbot-panel-close');
  var iframe = widget.querySelector('.chatbot-iframe');
  var loaded = false;

  function loadIframe() {
    if (loaded) return;
    iframe.src = iframe.getAttribute('data-src');
    loaded = true;
  }
  function close() {
    widget.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }
  function toggle() {
    var isOpen = widget.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (isOpen) loadIframe();
  }

  toggleBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    toggle();
  });

  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    close();
  });

  document.addEventListener('click', function (e) {
    if (!widget.contains(e.target)) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
