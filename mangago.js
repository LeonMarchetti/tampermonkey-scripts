// ==UserScript==
// @name         Mangago
// @namespace    http://tampermonkey.net/
// @version      1.4.0
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
    GM_addStyle("@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css')");

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

    /**
     * This class observes the DOM for the appearance of a textarea with ID "note"
     * (used on Mangago.me for bookmark descriptions). When the textarea appears,
     * it automatically fills it with the current chapter number (e.g., "Ch.57"),
     * using the global variable `unsafeWindow.current_chapter`.
     *
     * It uses MutationObserver instead of setInterval for better performance and efficiency.
     */
    class AutocompleteBookmarkDescription {
        constructor() {
            /**
             * @property {HTMLElement|null} currentTextarea
             * Keeps track of the last textarea that was auto-filled, to avoid re-writing unnecessarily.
             */
            this.currentTextarea = null;

            /**
             * @property {MutationObserver} observer
             * Watches the DOM for when the bookmark textarea (#note) appears.
             */
            this.observer = new MutationObserver(this.handleMutations.bind(this));

            // Start observing the DOM for dynamic elements
            this.observeDOM();
        }

        /**
         * Starts observing the DOM body for added elements.
         * Uses subtree: true to catch deeply nested elements.
         */
        observeDOM() {
            const config = { childList: true, subtree: true };
            this.observer.observe(document.body, config);
        }

        /**
         * Callback triggered when new nodes are added to the DOM.
         * Looks for a textarea with ID "note" and fills it if not already done.
         *
         * @param {MutationRecord[]} mutationsList - List of detected DOM changes.
         */
        handleMutations(mutationsList) {
            for (let mutation of mutationsList) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // Element node
                        const textarea = node.querySelector?.("#note") ||
                              (node.id === "note" ? node : null);
                        if (textarea) {
                            this.autocomplete(textarea);
                            return; // Only process the first match
                        }
                    }
                }
            }
        }

        /**
         * Writes the chapter number into the textarea, if not already processed.
         *
         * @param {HTMLTextAreaElement} textarea - The bookmark description field.
         */
        autocomplete(textarea) {
            if (this.currentTextarea !== textarea) {
                if (unsafeWindow?.chapter_name) {
                    textarea.value = unsafeWindow.chapter_name;
                }
                this.currentTextarea = textarea;
            }
        }
    }

    /**
     * Fetches the URL of the photo's source in manga
     * 
     * @param {string} url URL of the photo in the album. Should match pattern: `\/home\/photo\/[0-9]+\/`
     * @returns {Promise<string>} Promise of the URL of the source image
     */
    async function fetchAlbumPhotoSource(url) {
        // Validate the URL format for an album photo
        if (!/\/home\/photo\/\d+\//.test(url)) {
            throw new Error("Invalid album photo URL");
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const html = await response.text();
            const page = new DOMParser().parseFromString(html, "text/html");

            // Use the parsed page to find the source link
            const sourceLinkElement = [...page.querySelectorAll(".article .content")]
                .filter(div => div.innerText.includes("Source"))[0]?.children[0];

            if (!sourceLinkElement || !sourceLinkElement.href) {
                throw new Error("Source link not found in the page.");
            }

            return sourceLinkElement.href;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /** Adds manga page sources for photos in albums as links below description */
    function addPageSourceLink() {
        const pages = document.querySelectorAll(".photo_wrap");
        [...pages].forEach(div => {
            fetchAlbumPhotoSource(div.children[0].href)  // Should match `a.photolst_photo`
                .then(result => {
                    const icon = document.createElement("i");
                    icon.classList.add("fas", "fa-image");
                    const link = document.createElement("a");
                    link.href = result;
                    link.append(icon);
                    div.children[1].append(link);  // Should match `div.pl.albumlst_descri`
                });
        });
    }

    // If page is an album
    if (window.location.href.match(/www\.mangago\.me\/home\/(album|mangaphoto)\//)) {
        addPageSourceLink();
    }

    if (checkMangaChapter(false)) {
        setFullPageHeight(GM_getValue(FULL_PAGE_HEIGHT_KEY, false));
    }

    GM_registerMenuCommand("Open Image", openImage);
    GM_registerMenuCommand("Toggle full height", togglePageHeight);

    new AutocompleteBookmarkDescription();

    document.addEventListener("keyup", e => {
        if (e.altKey && e.ctrlKey && !e.shiftKey) {
            switch (e.code) {
                case "KeyI": openImage(); break;
                case "KeyT": togglePageHeight(); break;
            }
        }
    });
})();