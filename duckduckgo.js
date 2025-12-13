// ==UserScript==
// @name         DuckDuckGo
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Utilities for DuckDuckGo
// @author       LeonAM
// @match        https://duckduckgo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duckduckgo.com
// ==/UserScript==

(function () {
    'use strict';

    const CONTAINER_SELECTOR = ".WRx_xSx51EXkymGmPRNJ";
    const BUTTON_ID = "ddg-open-image-btn";
    const IMAGES_SELECTOR = ".d1fekHMv2WPYZzgPAV7b";

    const SVG_PICTURE = `
<svg viewBox="0 0 24 24" width="18" height="18"
     fill="none" stroke="currentColor" stroke-width="2">
  <rect x="3" y="3" width="18" height="18" rx="2" fill="none"/>
  <circle cx="9" cy="9" r="2"/>
  <path d="M21 15l-5-5L5 21"/>
</svg>
`.trim();

    /** Opens the current preview image in a new tab */
    function openImage() {
        const imagesList = document.querySelectorAll(IMAGES_SELECTOR);
        let image;

        if (imagesList.length >= 2) {
            image = imagesList[imagesList.length === 2 ? 0 : 1];
        } else {
            console.error("Could not detect image", imagesList);
            return;
        }

        unsafeWindow.open(image.src, "_blank");
    }

    /**
     * Adds a button to the container, mimicking the other buttons
     * 
     * @param {HTMLElement} container
     * @param {Function} callback
     */
    function addButton(container, callback) {
        if (!container || container.querySelector(`#${BUTTON_ID}`)) return;

        const btn = document.createElement("button");
        btn.id = BUTTON_ID;
        btn.type = "button";

        btn.classList.add(
            "VxuWnm3couqnzN7fT7SO", "uuIDnYC4qmyFk5dsXOhr",
            "Uz2BykKBXbObF11W1_5T", "ffON2NH02oMAcqyoh2UU",
            "vcOFkrrvuSYp7xsAur2Y", "q7VhSk71XgyB1xYfeChb",
            "kYheVVecSlvJdWHcWzJs", "ACez7bVvgYxZ9w0qR8ne"
        );

        btn.insertAdjacentHTML("afterbegin", SVG_PICTURE);
        btn.addEventListener("click", callback);

        container.prepend(btn);
    }

    /** Tries to create the button by querying the DOM */
    function tryAddButton() {
        const container = document.querySelector(CONTAINER_SELECTOR);
        if (container) addButton(container, openImage);
    }

    // Initial attempt
    tryAddButton();

    // SPA-safe observer
    new MutationObserver(tryAddButton)
        .observe(document.body, { childList: true, subtree: true });
})();
