// ==UserScript==
// @name         Image Zoom
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Zoom controls with smooth transitions for single <img> pages
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.info(`Running UserScript "Image Zoom"`);

    function init() {
        const images = Array.from(document.body.querySelectorAll(':scope > img'));
        if (images.length !== 1) return;

        const img = images[0];

        let scale = 1;

        img.style.display = 'block';
        img.style.margin = '0 auto';
        img.style.height = 'auto';
        img.style.maxWidth = 'none';
        img.style.transition = 'width 0.2s ease'; // ✨ smooth zoom

        function applyScale() {
            img.style.width = (img.naturalWidth * scale) + 'px';
        }

        function zoomIn() {
            scale += 0.1;
            applyScale();
        }

        function zoomOut() {
            scale = Math.max(0.1, scale - 0.1);
            applyScale();
        }

        function fitWidth() {
            scale = window.innerWidth / img.naturalWidth;
            applyScale();
        }

        function fitHeight() {
            scale = window.innerHeight / img.naturalHeight;
            applyScale();
        }

        window.addEventListener('keydown', (e) => {
            if (e.key === '+') {
                zoomIn();
            } else if (e.key === '-') {
                zoomOut();
            } else if (e.key.toLowerCase() === 'w') {
                fitWidth();
            } else if (e.key.toLowerCase() === 'h') {
                fitHeight();
            }
        });

        applyScale();
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
