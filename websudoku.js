// ==UserScript==
// @name         Web Sudoku
// @namespace    http://tampermonkey.net/
// @version      1.2
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

    function log(text) {
        console.log(`[${GM_info.script.name}] ${text}`);
    }

    /** Pauses or resumes the game by simulating a click on the "Pause" or "Resume puzzle" button */
    function togglePauseGame() {
        var pauseButton = document.querySelector("input[name=pause]");
        if (pauseButton) {
            pauseButton.click();
            log("PAUSED");
            return;
        }

        var resumeButton = document.querySelector("input[name=resume]");
        if (resumeButton) {
            resumeButton.click();
            log("RESUMED");
            return;
        }

        console.error(`[${GM_info.script.name}] Buttons not found`);
    }

    /** Automatically removes a number which conflicts on the cell's row, column or box. */
    function clearRepeatedNumber(input) {
        let currValue = input.value;

        if (currValue.length > 0) {
            let row = input.parentElement.parentElement; // <tr>
            let values = currValue.split("");
            let rowNo = row.rowIndex;
            let colNo = input.parentElement.cellIndex;
            let deletedNumbers = [];

            // Traverse row
            row.childNodes.forEach(td => {
                let cell = td.firstChild;
                if (cell != input && cell.value.length == 1) {
                    if (values.includes(cell.value)) {
                        values.splice(values.indexOf(cell.value), 1);
                        deletedNumbers.push(cell.value);
                    }
                }
            });

            // Traverse column
            let rows = input.parentElement.offsetParent.firstChild.childNodes;
            rows.forEach(row => {
                let cell = row.childNodes[colNo].firstChild;
                if (cell != input && cell.value.length == 1) {
                    if (values.includes(cell.value)) {
                        values.splice(values.indexOf(cell.value), 1);
                        deletedNumbers.push(cell.value);
                    }
                }
            });

            // TODO Traverse box

            // Set content
            input.value = values.join("");
            if (deletedNumbers.length > 0) {
                log(`Cell [${rowNo + 1},${colNo + 1}] deleted: ${deletedNumbers.join(", ")}`);
            }
        }
    }

    document.addEventListener("keypress", e => {
        if (e.code == "KeyP") {
            togglePauseGame();
            e.preventDefault();
        }
    });

    document.querySelectorAll("input.d0").forEach(input => {
        input.addEventListener("keyup", e => {
            if (e.key >= 0 && e.key <= 9) {
                clearRepeatedNumber(e.target);
            }
        });
    });
})();
