// ==UserScript==
// @name         Image Opener
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Opens a image with a hotkey and a click
// @author       LeonAM
// @match        *://*/*
// @require      file://<PATH>/image-opener.js
// @grant        GM_info
// @grant        GM_openInTab
// ==/UserScript==

(function () {
    'use strict';

    console.log(`Running UserScript "${GM_info.script.name}"`);

    document.addEventListener("click", e => {
        if (e.target.tagName !== "IMG") return;

        var ctrl = e.ctrlKey;
        var alt = e.altKey;
        var shift = e.shiftKey;

        // CTRL + ALT
        if (ctrl && alt && !shift && e.which === 1) {
            e.preventDefault();
            e.stopPropagation();
            GM_openInTab(e.target.src, { active: false });
        }

        // CTRL + SHIFT
        if (ctrl && !alt && shift && e.which === 1) {
            e.stopPropagation();
            window.open(e.target.src, "_self");
        }
    });
})();
