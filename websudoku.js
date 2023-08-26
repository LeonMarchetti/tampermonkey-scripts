// ==UserScript==
// @name         Web Sudoku
// @namespace    http://tampermonkey.net/
// @version      1.4.2
// @description  Script for Web Sudoku
// @author       LeonAM
// @match        *://*.websudoku.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=websudoku.com
// @grant        GM_info
// ==/UserScript==

(function() {
    'use strict';

    // The site loads a frame, with this line I show the current URL of the frame it's running on
    console.info(`Running UserScript "${GM_info.script.name} at "${window.location.href}"`);

    /**
     * Prints message in console preppending the script's name
     *
     * @param {string} text Message content
     * @param {boolean} error If output to error stream
     */
    function log(text, error = false) {
        let logFunction = error ? console.error : console.log;
        logFunction(`[${GM_info.script.name}] ${text}`);
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

        log("Buttons not found", true);
    }

    /**
     * Returns an array with all the cells which restrict the selected cell's value
     *
     * @param {number} rowNo Cell's row number, 0-based
     * @param {number} colNo Cell's column number, 0-based
     *
     * @returns {ChildNode[]} Value
     */
    function getRestrictionCells(rowNo, colNo) {
        let table = document.getElementById("puzzle_grid");
        if (!table) {
            log("No table#puzzle_grid element");
            return null;
        }

        let rows = table.firstChild.childNodes;

        // Traverse box
        let boxCells = [];
        let boxCornerRow = ~~(rowNo / 3) * 3;
        let boxCornerCol = ~~(colNo / 3) * 3;
        for (let x = boxCornerRow; x < 3 + boxCornerRow; x++) {
            for (let y = boxCornerCol; y < 3 + boxCornerCol; y++) {
                boxCells.push(rows[x]
                    .childNodes[y]
                    .firstChild);
            }
        }

        // Traverse row, column and box
        return Array.from(rows[rowNo].childNodes)
            .map(td => td.firstChild)
            .concat(Array.from(rows)
                .map(row => row.childNodes[colNo].firstChild))
            .concat(boxCells);
    }

    /**
     * Automatically removes a number which conflicts on the cell's row, column or box.
     *
     * @param {HTMLInputElement} input
     */
    function clearRepeatedNumber(input) {
        let currValue = input.value;

        if (currValue.length > 0) {
            let values = currValue.split("");
            let row = input.parentElement.parentElement;
            let rowNo = row.rowIndex;
            let colNo = input.parentElement.cellIndex;
            let deletedNumbers = [];

            // Traverse row, column and box
            getRestrictionCells(rowNo, colNo).forEach(cell => {
                if (cell
                    && cell != input
                    && cell.value.length == 1
                    && values.includes(cell.value))
                {
                    values.splice(values.indexOf(cell.value), 1);
                    deletedNumbers.push(cell.value);
                }
            });

            // Set content
            input.value = values.join("");
            if (deletedNumbers.length > 0) {
                log(`Cell [${rowNo + 1},${colNo + 1}] deleted: ${deletedNumbers.join(", ")}`);
            }
        }
    }

    /** Test function */
    function test() {
        // TODO
    }

    document.addEventListener("keypress", e => {
        if (e.code == "KeyP") {
            togglePauseGame();
            e.preventDefault();
        }

        if (e.code == "KeyT") {
            test();
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
