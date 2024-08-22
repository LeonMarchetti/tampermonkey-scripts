// ==UserScript==
// @name         Instagram
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Utilities for Instagram
// @author       LeonAM
// @match        https://www.instagram.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

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