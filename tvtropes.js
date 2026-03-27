// ==UserScript==
// @name         TV Tropes
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  TV Tropes utilities
// @author       LeonAM
// @match        https://tvtropes.org/pmwiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tvtropes.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const HEADER_BAR_ID = "main-header-bar-right";
    /** Selector for actions bar */
    const ACTIONS_BAR_ID = ".actions-wrapper #top_main_list";
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

    /**
     * Add toggle control with listener and append to target element
     *
     * @param {string} title
     * @param {Function} clickListener
     * @param {Element} targetContainer
     */
    function makeToggleButton(title, clickListener, targetContainer) {
        let checkbox = document.createElement("div");
        checkbox.title = title;
        checkbox.classList.add("display-toggle");
        checkbox.addEventListener("click", clickListener);
        targetContainer.appendChild(checkbox);
        return checkbox;
    }

    /** Add toggle control to the header bar to toggle images visibility */
    function addImageToggle() {
        let checkbox = makeToggleButton("Toggle images visibility",
            function() {
                this.classList.toggle("active");
                toggleImagesVisibility(checkbox.classList.contains("active"));
            },
            document.getElementById(HEADER_BAR_ID));
        if (DEFAULT_VISIBILITY) {
            checkbox.classList.add("active");
        }
    }

    /** Adds link for "Followed Pages" to the actions bar */
    function addFollowedPagesLink() {
        // Exit if the link already exists
        if (document.querySelector('.link-watchList a[href="/pmwiki/awl.php"]')) {
            return;
        }

        const icon = document.createElement("i");
        icon.classList.add("fa", "fa-thumb-tack");
        const link = document.createElement("a");
        link.href = "/pmwiki/awl.php";
        link.appendChild(icon);
        link.appendChild(document.createTextNode(" Followed Pages"));
        const item = document.createElement("li");
        item.classList.add("link-watchList");
        item.appendChild(link);

        [...document.querySelectorAll(ACTIONS_BAR_ID)].forEach(actionsList => {
            /* In "New Edits", the new item appears hidden below the action bar unless I remove the
             * "margin-right"
             */
            actionsList.style.marginRight = 0;
            console.debug("Actions bar", actionsList);
            console.debug("New action item", item);
            actionsList.appendChild(item);
        });
    }

    toggleImagesVisibility(DEFAULT_VISIBILITY);
    addImageToggle();
    addFollowedPagesLink();
})();