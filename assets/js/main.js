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
  if (!galleryImgs.length) return;

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

  function open(index) {
    lastFocused = document.activeElement;
    show(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  galleryImgs.forEach(function (img, index) {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Enlarge image: ' + (img.alt || ''));
    img.addEventListener('click', function () { open(index); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(index);
      }
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { show(currentIndex - 1); });
  nextBtn.addEventListener('click', function () { show(currentIndex + 1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
    if (e.key === 'ArrowRight') show(currentIndex + 1);
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
