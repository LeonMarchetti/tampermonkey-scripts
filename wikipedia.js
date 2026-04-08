// ==UserScript==
// @name         Wikipedia
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  try to take over the world!
// @author       LeonAM
// @match        https://es.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    console.info(`Running script "Wikipedia"`);

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

    /** Adds the random page link to the header bar */
    function addRandomLink() {
        const span = document.createElement("span");
        span.textContent = "Random";
        const link = document.createElement("a");
        link.href = "https://es.wikipedia.org/wiki/Especial:Aleatoria";
        const item = document.createElement("li");
        item.className = "user-links-collapsible-item mw-list-item user-links-collapsible-item";
        const container = document.querySelector("#p-vector-user-menu-overflow .vector-menu-content-list");

        link.appendChild(span);
        item.appendChild(link);
        container.insertBefore(item, container.firstChild);
    }

    addRandomLink();
    highlightWords();
})();