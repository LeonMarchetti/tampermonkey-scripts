// ==UserScript==
// @name         Notion
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Utilities for Notion
// @author       LeonAM
// @match        https://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notion.so
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.info(`Running Userscript: "Notion"`);

    /**
     * Sets `DD/MM/YYYY` date format for selected date
     *
     * Requires the user to first select the date by clicking on it
     */
    function setDateFormat() {
        document.querySelector("[role='dialog'] :nth-child(3)>[role='button']:nth-child(1)")
            .click()
        let interval = setInterval(() => {
            let dmyButton = document.querySelector("[role='menuitem']:nth-child(4)");
            if (dmyButton) {
                dmyButton.click();
                setTimeout(() => {
                    document.querySelector("[role='dialog']").remove();
                }, 250);
                clearInterval(interval);
            }
        }, 250);
    }

    document.addEventListener("keyup", e => {
        if (e.ctrlKey && e.altKey && !e.shiftKey) {
            switch (e.code) {
                case "KeyD": setDateFormat(); break;
            }
        }
    });
})();