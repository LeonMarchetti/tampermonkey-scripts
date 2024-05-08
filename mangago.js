// ==UserScript==
// @name         Mangago
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over the world!
// @author       You
// @match        https://www.mangago.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangago.me
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==
/* globals $ */

(function() {
    'use strict';

    console.info(`Running UserScript "${GM_info.script.name}"`);

    const NEW_CLASS = "new_page_class";
    const PAGE_SELECTOR = "[id^=page]:not(#page-mainer,#pagenavigation)";

    /**
     * Checks if currently on a manga chapter's page
     *
     * @throws Exception
     */
    function checkMangaChapterPage() {
        if (!window.location.href.match(/mangago\.me\/read-manga\//)) {
            throw "Not at a manga chapter";
        }
    }

    /** Sets the pages' height to the window's height */
    function setPageHeight() {
        checkMangaChapterPage();

        GM_addStyle(
            `${PAGE_SELECTOR} { height: 100em; min-width: auto; }\n` +
            `.${NEW_CLASS} { height: auto !important; }`
        );
    }

    /** Resets the height of the manga pages */
    function resetHeight() {
        checkMangaChapterPage();

        let active = GM_getValue("active", true);
        if (active) {
            document.querySelectorAll(PAGE_SELECTOR).forEach(p => {
                p.className += ' ' + NEW_CLASS;
            });
        } else {
            let regexp = new RegExp("\\s?" + NEW_CLASS, "g");
            document.querySelectorAll(PAGE_SELECTOR).forEach(p => {
                p.className = p.className.replace(regexp, '').trim();
            });
        }
        GM_setValue("active", !active);
    }

    GM_registerMenuCommand("Set full height", setPageHeight);
    GM_registerMenuCommand("Reset height", resetHeight);
})();