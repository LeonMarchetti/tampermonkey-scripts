// ==UserScript==
// @name         Image Zoom
// @namespace    http://tampermonkey.net/
// @version      1.7.0
// @description  Scripts for manipulating images in their own tabs
// @author       LeonAM
// @match        *://*/*
// @require      file://<PATH>/image-zoom.js
// @grant        GM_info
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // Script should only run if there is only one <img> element as a child of <body>
    if (document.body.childElementCount !== 1
        || document.body.childNodes[0].tagName !== "IMG") {
        return;
    }

    console.log(`Running UserScript "${GM_info.script.name}"`);

    /** Current browser, for editing styles */
    const browser =
        window.navigator.userAgent.includes("Chrome") ? "chrome" :
        window.navigator.userAgent.includes("Firefox") ? "firefox" : "";

    /** Image element of the page. Supposed to be the only image */
    const img = document.body.childNodes[0];

    // Custom styles, browser-independent
    GM_addStyle(`
        .imageZoom-body {
            height: fit-content !important;
        }
        .imageZoom-body-imgIncreased {
            width: fit-content;
        }
        .imageZoom-img-imgIncreased {
            position: absolute;
        }
        .imageZoom-fillHeight {
            height: 100vh;
        }
        .imageZoom-fillWidth {
            width: 100vw;
        }
    `.trim());

    document.body.classList.add("imageZoom-body");
    img.classList.add("imageZoom-img");

    /** True if the image originally has a height and/or width higher than the browser's */
    var isZoomable;
    switch (browser) {
        case "chrome":
            isZoomable = ["zoom-in", "zoom-out"].includes(img.style.cursor);
            break;
        case "firefox":
            isZoomable = img.classList.contains("shrinkToFit") || img.classList.contains("overflowingVertical");
            break;
    }

    /** Zoom level of the image */
    var scale = 1;

    /**
     * Applies a scale transformation to the image
     *
     * If the image is increased, it modifies the body's style to allow the
     * image to be scrolled horizontally
     *
     * @param {number} scale Zoom (100% => 1.0)
     */
    function transform(scale) {
        if (isZoomable) {
            document.body.style.transform = `scale(${scale})`;
        } else {
            img.style.transform = `scale(${scale})`;
        }

        if (scale > 1) {
            document.body.classList.add("imageZoom-body-imgIncreased");
            img.classList.add("imageZoom-img-imgIncreased");
        } else {
            document.body.classList.remove("imageZoom-body-imgIncreased");
            img.classList.remove("imageZoom-img-imgIncreased");
        }
    }

    /** Removes the transform CSS rule */
    function removeTransform() {
        scale = 1;
        if (isZoomable) {
            document.body.style.transform = "";
        } else {
            img.style.transform = "";
        }
    }

    /** Makes the image to fill the browser's height */
    function fillHeight(img) {
        if (!isZoomable) {
            img.classList.remove("imageZoom-fillWidth");
            img.classList.add("imageZoom-fillHeight");
        }
        removeTransform();
    }

    /** Changes the image's zoom by `delta` units */
    function cambiarTamaño(delta) {
        scale += delta;
        transform(scale);
    }

    /** Makes the image fill the browser's width */
    function fillWidth(img) {
        img.classList.remove("imageZoom-fillHeight");
        img.classList.add("imageZoom-fillWidth");
        removeTransform();
    }

    if (!isZoomable) {
        fillHeight(img);
    }

    document.addEventListener("keyup", e => {
        if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
            switch (e.code) {
                case "NumpadSubtract": cambiarTamaño(-0.1); break;
                case "KeyH": fillHeight(img); break;
                case "NumpadAdd": cambiarTamaño(0.1); break;
                case "KeyW": fillWidth(img); break;

                // case "KeyP": test(); break;
            }
        }
    });
})();
