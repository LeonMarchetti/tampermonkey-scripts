// ==UserScript==
// @name         Web Sudoku
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Script for Web Sudoku
// @author       LeonAM
// @match        *://*.websudoku.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=websudoku.com
// @grant        GM_info
// ==/UserScript==

(function() {
    'use strict';

    // The site loads a frame, with this line I show the current URL of the frame it's running on.
    console.info(`Running UserScript "${GM_info.script.name} at "${window.location.href}"`);

    /** Pauses or resumes the game by simulating a click on the "Pause" or "Resume puzzle" button */
    function togglePauseGame() {
        var pauseButton = document.querySelector("input[name=pause]");
        if (pauseButton) {
            pauseButton.click();
            console.log(`[${GM_info.script.name}] PAUSED`);
            return;
        }

        var resumeButton = document.querySelector("input[name=resume]");
        if (resumeButton) {
            resumeButton.click();
            console.log(`[${GM_info.script.name}] RESUMED`);
            return;
        }

        console.error(`[${GM_info.script.name}] Buttons not found`);
    }

    document.addEventListener("keyup", e => {
        if (e.code == "KeyP") {
            togglePauseGame();
        }
    });
})();
