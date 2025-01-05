// ==UserScript==
// @name         Wikipedia
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over the world!
// @author       LeonAM
// @match        https://es.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    /** Highlight CSS class name for highlighting */
    const HIGHLIGHT_THEME = "tm_highlight";
    GM_addStyle(`.${HIGHLIGHT_THEME} {
        background-color: lightyellow;
        border-radius: 10px;
        padding-left: 10px;
    }
    .${HIGHLIGHT_THEME}::marker { color: white; }`);

    const HIGHLIGHT_WORDS = ["futbolista", "argentin"];

    /**
     * Highlights elements with certain words
     */
    function highlightWords() {
        let root = document.getElementById("main-cur");
        if (!root)
            throw new Error("Root element not found (id=\"main-cur\")");

        Array.from(root.querySelectorAll("li")).forEach(li => {
            if (HIGHLIGHT_WORDS.some(word => li.innerText.includes(word))) {
                li.classList.add(HIGHLIGHT_THEME, "notheme");
            }
        });
    }

    highlightWords();
})();