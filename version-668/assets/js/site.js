(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function bindMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    function bindHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                start();
            });
        });
        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    function normalize(text) {
        return (text || '').toString().toLowerCase().replace(/\s+/g, '');
    }

    function bindFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
        panels.forEach(function (panel) {
            var input = panel.querySelector('[data-local-search]');
            var buttons = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-type]'));
            var list = document.querySelector('[data-card-list]');
            var empty = document.querySelector('[data-empty-state]');
            var activeType = 'all';
            if (!list) {
                return;
            }

            function apply() {
                var query = normalize(input ? input.value : '');
                var visible = 0;
                Array.prototype.slice.call(list.querySelectorAll('[data-card]')).forEach(function (card) {
                    var haystack = normalize(card.getAttribute('data-search'));
                    var type = card.getAttribute('data-type') || '';
                    var matchQuery = !query || haystack.indexOf(query) !== -1;
                    var matchType = activeType === 'all' || type === activeType;
                    var show = matchQuery && matchType;
                    card.classList.toggle('card-hidden', !show);
                    if (show) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('is-visible', visible === 0);
                }
            }

            if (input) {
                input.addEventListener('input', apply);
            }
            buttons.forEach(function (button) {
                button.addEventListener('click', function () {
                    activeType = button.getAttribute('data-filter-type') || 'all';
                    buttons.forEach(function (item) {
                        item.classList.toggle('active', item === button);
                    });
                    apply();
                });
            });
            apply();
        });
    }

    function bindSearchPage() {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        var input = document.querySelector('[data-query-input]');
        var local = document.querySelector('[data-local-search]');
        if (input) {
            input.value = query;
        }
        if (local && query) {
            local.value = query;
            local.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    ready(function () {
        bindMenu();
        bindHero();
        bindFilters();
        bindSearchPage();
    });
})();
