(function () {
  var mobileButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (mobileButton && mobileNav) {
    mobileButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dotsWrap = document.querySelector('[data-hero-dots]');
  var currentSlide = 0;
  var slideTimer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });

    if (dotsWrap) {
      Array.prototype.slice.call(dotsWrap.children).forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === currentSlide);
      });
    }
  }

  function startSlides() {
    if (slideTimer) {
      window.clearInterval(slideTimer);
    }

    if (slides.length > 1) {
      slideTimer = window.setInterval(function () {
        showSlide(currentSlide + 1);
      }, 5200);
    }
  }

  if (slides.length && dotsWrap) {
    slides.forEach(function (_, index) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', '切换焦点影片');
      dot.addEventListener('click', function () {
        showSlide(index);
        startSlides();
      });
      dotsWrap.appendChild(dot);
    });

    var next = document.querySelector('[data-hero-next]');
    var prev = document.querySelector('[data-hero-prev]');

    if (next) {
      next.addEventListener('click', function () {
        showSlide(currentSlide + 1);
        startSlides();
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(currentSlide - 1);
        startSlides();
      });
    }

    showSlide(0);
    startSlides();
  }

  var searchInput = document.querySelector('[data-search-input]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-type]'));
  var activeType = '全部';

  function normalized(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilters() {
    var keyword = normalized(searchInput ? searchInput.value : '');

    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year'),
        card.getAttribute('data-type'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-category')
      ].map(normalized).join(' ');

      var typeValue = card.getAttribute('data-type') || '';
      var typeMatched = activeType === '全部' || typeValue.indexOf(activeType) !== -1 || haystack.indexOf(normalized(activeType)) !== -1;
      var keywordMatched = !keyword || haystack.indexOf(keyword) !== -1;

      card.classList.toggle('is-hidden', !(typeMatched && keywordMatched));
    });
  }

  if (searchInput && cards.length) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (filterButtons.length) {
    filterButtons.forEach(function (button, index) {
      if (index === 0) {
        button.classList.add('is-active');
      }

      button.addEventListener('click', function () {
        activeType = button.getAttribute('data-filter-type') || '全部';
        filterButtons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        applyFilters();
      });
    });
  }

  var video = document.querySelector('[data-player-video]');
  var playButton = document.querySelector('[data-play-button]');

  if (video && playButton) {
    var shell = video.closest('.video-shell');
    var streamUrl = video.getAttribute('data-stream-url');
    var playerReady = false;
    var hlsInstance = null;

    function prepareVideo() {
      if (playerReady || !streamUrl) {
        return;
      }

      playerReady = true;

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }

    function playVideo() {
      prepareVideo();

      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }

      if (shell) {
        shell.classList.add('is-playing');
      }
    }

    playButton.addEventListener('click', playVideo);

    video.addEventListener('play', function () {
      if (shell) {
        shell.classList.add('is-playing');
      }
    });

    video.addEventListener('emptied', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
    });
  }
})();
