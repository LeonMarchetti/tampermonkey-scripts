// ==UserScript==
// @name         Mangago
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Utilities for Mangago
// @author       LeonAM
// @match        https://www.mangago.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangago.me
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    console.info(`Running UserScript "${GM_info.script.name}"`);

    const PAGE_SELECTOR = "[id^=page]:not(#page-mainer,#pagenavigation)";
    const FULL_PAGE_HEIGHT_KEY = "fullPageHeight";
    var fullPageHeightStyle = null;

    /**
     * Checks if currently on a manga chapter's page
     *
     * @throws Exception
     */
    function checkMangaChapterPage(throwException = true) {
        if (!window.location.href.match(/mangago\.me\/read-manga\//)) {
            if (throwException)
                throw "Not at a manga chapter";
            return false;
        }
        return true;
    }

    /** Sets the pages' height to the window's height */
    function togglePageHeight() {
        let active = !GM_getValue(FULL_PAGE_HEIGHT_KEY, false);
        setFullPageHeight(active);
        GM_setValue(FULL_PAGE_HEIGHT_KEY, active);
    }

    /**
     * Sets or unsets the chapter's pages' height to full screen
     *
     * @param {boolean} active
     */
    function setFullPageHeight(active) {
        checkMangaChapterPage();

        if (active) {
            fullPageHeightStyle = GM_addStyle(`${PAGE_SELECTOR} {
                height: 100em;
                min-width: auto;
            }\n`);
        } else if (fullPageHeightStyle) {
            fullPageHeightStyle.remove();
            fullPageHeightStyle = null;
        }
    }

    if (checkMangaChapterPage(false)) {
        setFullPageHeight(GM_getValue(FULL_PAGE_HEIGHT_KEY, false));
    }

    GM_registerMenuCommand("Toggle full height", togglePageHeight);

    document.addEventListener("keyup", e => {
        if (e.altKey && e.ctrlKey && !e.shiftKey) {
            switch (e.code) {
                case "KeyT": togglePageHeight(); break;
            }
        }
    });
})();