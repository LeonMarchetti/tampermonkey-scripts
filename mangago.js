// ==UserScript==
// @name         Mangago
// @namespace    http://tampermonkey.net/
// @version      1.2.1
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
     * Checks if currently on a manga chapter
     *
     * @throws Exception
     */
    function checkMangaChapter(throwException = true) {
        if (!window.location.href.match(/mangago\.me\/read-manga\//)) {
            if (throwException)
                throw "Not at a manga chapter";
            return false;
        }
        return true;
    }

    /**
     * Checks if currently on a manga page. Returns a regex match with the page's index extracted
     * from the URL.
     *
     * @throws Exception
     * @returns Regex match
     */
    function checkMangaPage(throwException = true) {
        let locationMatch = window.location.href.match(/mangago\.me\/read-manga\/.*\/(?:pg-)?(\d+)/);
        if (!locationMatch) {
            if (throwException)
                throw "Not at a manga page";
            return null;
        }
        return locationMatch;
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
        checkMangaChapter();

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

    /** Opens the image's source of a manga page */
    function openImage() {
        let pageIndex = checkMangaPage()[1];

        window.location.href = document.querySelector(`img#page${pageIndex}`).src;
    }

    if (checkMangaChapter(false)) {
        setFullPageHeight(GM_getValue(FULL_PAGE_HEIGHT_KEY, false));
    }

    GM_registerMenuCommand("Open Image", openImage);
    GM_registerMenuCommand("Toggle full height", togglePageHeight);

    document.addEventListener("keyup", e => {
        if (e.altKey && e.ctrlKey && !e.shiftKey) {
            switch (e.code) {
                case "KeyI": openImage(); break;
                case "KeyT": togglePageHeight(); break;
            }
        }
    });
})();