// ==UserScript==
// @name         Image Zoom
// @namespace    http://tampermonkey.net/
// @version      1.6.0
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

    /** Checks if current browser is Mozilla Firefox */
    const isFirefox = window.navigator.userAgent.includes("Firefox");
    /** Checks if current browser is Google Chrome */
    const isChrome = window.navigator.userAgent.includes("Chrome");

    console.log(`Running UserScript "${GM_info.script.name}"`);

    /** Image element of the page. Supposed to be the only image */
    const img = document.body.childNodes[0];

    /** True if the image originally has a height and/or width higher than the browser's */
    const isZoomable =
        (isChrome) ? ["zoom-in", "zoom-out"].includes(img.style.cursor)
        : (isFirefox) ? ["shrinkToFit", "overflowingVertical"].includes(img.className) : null;

    /** Zoom level of the image */
    var scale = 1;

    /**
     * Applies transformation to the image
     *
     * @param scale Zoom (100% => 1.0)
     */
    function transform(scale) {
        img.style.transform = `scale(${scale})`;
    }

    /** Makes the image to fill the browser's height */
    function fillHeight(img) {
        if (!isZoomable) {
            img.style.height = "100vh";
            img.style.width = "auto";
        }
    }

    /** Changes the image's zoom by `delta` units */
    function cambiarTamaño(delta) {
        scale += delta;
        transform(scale);
    }

    /** Makes the image fill the browser's width */
    function fillWidth(img) {
        img.style.height = "auto";
        img.style.width = "100vw";
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
