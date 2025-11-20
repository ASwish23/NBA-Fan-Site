document.addEventListener('DOMContentLoaded', function () {
    const placeholder = document.querySelector('.video-placeholder');
    if (!placeholder) return;

    const wrapper = placeholder.closest('.video-wrapper');
    const videoId = placeholder.dataset.videoId;
    const youtubeWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;

    function createIframe(id) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=1`;
        iframe.title = 'NBA History Documentary';
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen = true;
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = '0';
        iframe.style.borderRadius = getComputedStyle(wrapper).borderRadius || '16px';
        return iframe;
    }

    function showFallback() {
        const fallback = wrapper.querySelector('.video-fallback');
        if (fallback) {
            fallback.hidden = false;
            fallback.setAttribute('aria-hidden', 'false');
        }
    }

    function loadVideo() {
        if (wrapper.querySelector('iframe')) return; // already loaded

        const iframe = createIframe(videoId);

        // Replace placeholder with iframe
        try {
            placeholder.replaceWith(iframe);
        } catch (e) {
            // Fallback: remove placeholder and append iframe
            placeholder.remove();
            wrapper.appendChild(iframe);
        }

        // If the iframe doesn't visibly load within timeout, show fallback link
        let loaded = false;
        const timeout = setTimeout(function () {
            if (!loaded) showFallback();
        }, 3000);

        iframe.addEventListener('load', function () {
            loaded = true;
            clearTimeout(timeout);
            const fallback = wrapper.querySelector('.video-fallback');
            if (fallback) {
                fallback.hidden = true;
                fallback.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // Attach click + keyboard handlers
    placeholder.addEventListener('click', loadVideo);
    placeholder.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            loadVideo();
        }
    });

    // Accessibility: if JavaScript is enabled, ensure noscript fallback is hidden
    const noscriptNodes = wrapper.querySelectorAll('noscript');
    noscriptNodes.forEach(function (n) { n.style.display = 'none'; });
});
