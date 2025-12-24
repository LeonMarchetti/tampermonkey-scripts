// ==UserScript==
// @name         Google Calendar
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Utilities for Google Calendar
// @author       LeonAM
// @match        https://calendar.google.com/calendar/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.info(`Running UserScript "Google Calendar"`);

    const CALENDAR_SELECTOR = ".kbf0gd";
    const CELL_SELECTOR = ".MGaLHf";
    const WEEK_SELECTOR = ".FLFkR";
    const EVENT_SELECTOR = ".qLWd9c";
    const CALENDAR_TITLE = "";
    const NEW_COLOR = "dimgray";

    /** 
     * Apply background color to days' cells if they have an event of the `CALENDAR_TITLE`
     * calendar
     */
    function changeBackground() {
        const weeks = [...document.querySelectorAll(WEEK_SELECTOR)];
        for (let i = 0; i < weeks.length; i++) {
            let weekCells = weeks[i].querySelectorAll(CELL_SELECTOR);
            let weekEvents = weeks[i].querySelectorAll(EVENT_SELECTOR);
            for (let j = 0; j < 5; j++) {
                // Iterate only on business days
                weekCells[j].style.backgroundColor = (weekEvents[j].innerText.includes(CALENDAR_TITLE))
                    ? NEW_COLOR : "";
            }
        }
    }

    /** Starts the observer to detect changes in the calendar */
    function startCalendarObserver() {
        const container = document.querySelector(CALENDAR_SELECTOR);
        if (container) {
            console.debug("Container: ", container);
            new MutationObserver(changeBackground)
                .observe(container, { childList: true, subtree: true });
        }
    }

    // Wait until calendar appears
    new MutationObserver(startCalendarObserver)
        .observe(document.body, { childList: true, subtree: true });
})();