// ==UserScript==
// @name         GMail
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Styles for GMail
// @author       LeonAM
// @match        https://mail.google.com/mail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_info
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    console.info(`Running UserScript "${GM_info.script.name}"`);

    // Highlight "starred" messages
    GM_addStyle(`
        [role="row"]:has([aria-label="Destacados"])
        {
            background-color: gold;
            color: black;
        }

        [role="row"]:has([aria-label="Destacados"]) [role="checkbox"]
        {
            border: 1px solid;
        }
    `.trim());
})();