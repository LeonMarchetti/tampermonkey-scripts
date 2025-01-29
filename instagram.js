// ==UserScript==
// @name         Instagram
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Utilities for Instagram
// @author       LeonAM
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    console.info(`Running UserScript "${GM_info.script.name}"`);

    // Styles
    GM_addStyle(`
        main > div
        {
            max-width: 100% !important;
        }

        main > :nth-child(1) > :nth-child(2) > :nth-child(1) > :nth-child(1)
        {
            flex-direction: row !important;
            flex-wrap: wrap;
        }

        main > :nth-child(1) > :nth-child(2) > :nth-child(1) > :nth-child(1) > div
        {
            width: 33%;
        }
    `);

    /**
     * Mutes all posts sounds
     */
    function ToggleMute() {
        document.querySelector(`[aria-label="Activar o desactivar audio"]`).click();
    }

    document.addEventListener("keyup", e => {
        if (!e.altKey && !e.ctrlKey && !e.shiftKey && e.originalTarget.tagName !== "INPUT") {
            switch (e.code) {
                case "KeyM": ToggleMute(); break;
            }
        }
    });

    GM_registerMenuCommand("Mute", ToggleMute);
})();