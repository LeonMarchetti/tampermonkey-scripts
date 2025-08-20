// ==UserScript==
// @name         TV Tropes
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  TV Tropes utilities
// @author       LeonAM
// @match        https://tvtropes.org/pmwiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tvtropes.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const HEADER_BAR_ID = "main-header-bar-right";
    /** Default visibility for images */
    const DEFAULT_VISIBILITY = true;

    console.info(`Running UserScript "TV Tropes"`);

    /**
     * Toggle image visibility of all images
     *
     * @param {boolean} visible
     */
    function toggleImagesVisibility(visible) {
        document.querySelectorAll(".embeddedimage, .gs-image")
            .forEach(img => {
            img.style.display = visible ? "block" : "none";
        });
    }

    /** Add toggle control to the header bar to toggle images visibility */
    function addImageToggle() {
        let checkbox = document.createElement("div");
        checkbox.title = "Toggle images visibility";
        checkbox.classList.add("display-toggle");
        if (DEFAULT_VISIBILITY) {
            checkbox.classList.add("active");
        }
        checkbox.addEventListener("click", function() {
            checkbox.classList.toggle("active");
            toggleImagesVisibility(checkbox.classList.contains("active"));
        });

        document.getElementById(HEADER_BAR_ID).appendChild(checkbox);
    }

    toggleImagesVisibility(DEFAULT_VISIBILITY);
    addImageToggle();

})();