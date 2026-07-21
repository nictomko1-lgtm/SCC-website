// Clean-path nav routing: intercepts in-page anchor clicks and shows /gallery
// style URLs (via History API) instead of #gallery, while still scrolling
// within the same single-page document. Falls back to native anchor jumps
// if this script fails to load or JS is disabled.
(function () {
    var BASE_PATH = document.body.getAttribute('data-base-path') || '';
    var SLUGS = ['gallery', 'services', 'reviews', 'why-us', 'contact', 'service-areas'];

    function pathForSlug(slug) {
        return slug ? BASE_PATH + '/' + slug : (BASE_PATH || '/');
    }

    function slugFromPath() {
        var path = location.pathname;
        if (BASE_PATH && path.indexOf(BASE_PATH) === 0) path = path.slice(BASE_PATH.length);
        path = path.replace(/^\/|\/$/g, '');
        return SLUGS.indexOf(path) !== -1 ? path : null;
    }

    function scrollToSlug(slug, smooth) {
        var target = document.getElementById(slug || 'homepage');
        if (!target) return;
        target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    }

    function onNavClick(e) {
        var href = e.currentTarget.getAttribute('href') || '';
        if (href.charAt(0) !== '#') return;
        var id = href.slice(1);
        var slug = id === 'homepage' ? '' : id;
        if (slug && SLUGS.indexOf(slug) === -1) return;
        e.preventDefault();
        history.pushState(null, '', pathForSlug(slug));
        scrollToSlug(id, true);
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', onNavClick);
    });

    window.addEventListener('popstate', function () {
        scrollToSlug(slugFromPath(), true);
    });

    var initialSlug = slugFromPath();
    if (initialSlug) scrollToSlug(initialSlug, false);
})();
