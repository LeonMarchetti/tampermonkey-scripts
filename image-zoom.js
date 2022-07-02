// ==UserScript==
// @name         Image Zoom
// @namespace    http://tampermonkey.net/
// @version      1.6.1
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

    /** Checks if current browser is Mozilla Firefox */
    const isFirefox = window.navigator.userAgent.includes("Firefox");
    /** Checks if current browser is Google Chrome */
    const isChrome = window.navigator.userAgent.includes("Chrome");

    /** Custom CSS styles for the `<img>` and `<body>` elements */
    GM_addStyle(`
        .imageZoom-body {
            width: fit-content;
            height: fit-content !important;
        }
        .imageZoom-fillHeight {
            height: 100vh;
        }
        .imageZoom-fillWidth {
            width: 100vw;
        }
        .imageZoom-img-chrome {
            position: absolute;
            top: 0;
            left: 0;
        }
        .imageZoom-img-firefox {
        }
    `.trim());

    /** Image element of the page. Supposed to be the only image */
    const img = document.body.childNodes[0];

    /** True if the image originally has a height and/or width higher than the browser's */
    const isZoomable =
        (isChrome) ? ["zoom-in", "zoom-out"].includes(img.style.cursor) :
        (isFirefox) ? img.classList.contains("shrinkToFit") || img.classList.contains("overflowingVertical") :
        null;

    /** Zoom level of the image */
    var scale = 1;

    /**
     * Applies transformation to the image
     *
     * @param scale Zoom (100% => 1.0)
     */
    function transform(scale) {
        if (isZoomable) {
            document.body.style.transform = `scale(${scale})`;
        } else {
            img.style.transform = `scale(${scale})`;
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

    // Custom styles
    document.body.classList.add("imageZoom-body");
    img.classList.add(
        (isChrome) ? "imageZoom-img-chrome" :
        (isFirefox) ? "imageZoom-img-firefox" :
        ""
    );

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
