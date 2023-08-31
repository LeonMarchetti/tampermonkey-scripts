// ==UserScript==
// @name         Web Sudoku
// @namespace    http://tampermonkey.net/
// @version      1.6.1
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

    /**
     * Returns the box number of the selected cell, given its row and column number
     *
     * @param {number} rowNo
     * @param {number} colNo
     * @returns {number} Box index
     */
    function getBoxIndex(rowNo, colNo) {
        return ~~(rowNo / 3) * 3 + ~~(colNo / 3);
    }

    /**
     * Creates an object with all the rows, columns and boxes as lists of cells, in order to be
     * accessed when a cell is selected
     *
     * #### Object use:
     *
     * ```js
     * cells = store.rows[rowNo]
     *     .concat(store.columns[colNo])
     *     .concat(store.boxes[rowNo][colNo])
     * ```
     *
     * @returns {{rows: HTMLInputElement[][], columns: HTMLInputElement[][], boxes: HTMLInputElement[][]}}
     */
    function makeCellsListStore() {
        let table = document.getElementById("puzzle_grid");
        if (!table) {
            log("No table#puzzle_grid element", true);
            return null;
        }

        let rows = table.firstChild.childNodes;
        let boxes = Array.from(Array(9)).map(_ => []);
        rows.forEach(row => {
            let rowNo = row.rowIndex;
            Array
                .from(rows[rowNo].childNodes)
                .forEach(td => {
                    let colNo = td.cellIndex;
                    let boxIndex = getBoxIndex(rowNo, colNo);
                    boxes[boxIndex].push(td.firstChild);
                });
        });

        return {
            rows: Array.from(rows)
                .map(row => Array.from(row.childNodes)
                    .map(td => td.firstChild)),
            columns: Array.from(Array(9).keys())
                .map(colNo => Array.from(rows)
                    .map(row => row.childNodes[colNo].firstChild)),
            boxes: boxes,
            /**
             * Returns the restriction cells of a cell given its row and column number
             *
             * @param {number} rowNo
             * @param {number} colNo
             */
            getCells: function (rowNo, colNo) {
                return this.rows[rowNo]
                    .concat(this.columns[colNo])
                    .concat(this.boxes[getBoxIndex(rowNo, colNo)]);
            },
        };
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
            store.getCells(rowNo, colNo).forEach(cell => {
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

    /**
     * Removes the clues from the related cells which match the selected cell's value
     *
     * @param {HTMLInputElement} input
     */
    function clearClues(input) {
        let currValue = input.value;
        if (currValue.length == 1) {
            let row = input.parentElement.parentElement;
            let rowNo = row.rowIndex;
            let colNo = input.parentElement.cellIndex;

            store.getCells(rowNo, colNo).forEach(cell => {
                if (cell
                    && cell != input
                    && cell.value.length >= 1
                    && cell.value.includes(currValue)
                ) {
                    cell.value = cell.value.replaceAll(currValue, "");
                    let cellRowNo = row.rowIndex;
                    let cellColNo = input.parentElement.cellIndex;
                    log(`Cell [${cellRowNo}, ${cellColNo}] deleted clue: ${currValue}`);
                    if (cell.value.length == 1 && cell.className != "s0") {
                        cell.className = "d0";
                        clearClues(cell);
                    }
                }
            });
        }
    }

    /**
     * Test function
     *
     * Usage:
     *
     * ```js
     * test(e.target);
     * ```
     *
     * @param {HTMLInputElement?} cell Selected cell, if any
     */
    function test(cell = null) {
        // TODO
        log("TEST");
        log("cell");
        console.log(cell);
        log("store");
        console.log(store);
        let row = cell.parentElement.parentElement;
        let rowNo = row.rowIndex;
        let colNo = cell.parentElement.cellIndex;
        let boxNo = getBoxIndex(rowNo, colNo);

        let storeCells = store.getCells(rowNo, colNo);
        log(`store.getCells(${rowNo}, ${colNo})`);
        console.log(storeCells);

        let box = store.boxes[boxNo];
        log("box");
        console.log(box);

        let values = [];
        storeCells.forEach(cell => {
            if (cell.value.length == 1) {
                values.push(cell.value);
            }
        });

        console.table({
            "rowNo": rowNo,
            "colNo": colNo,
            "boxNo": boxNo,
            "values": values.join(", "),
            "values (unique)": [...new Set(values)].sort().join(", "),
        });
    }

    var store = makeCellsListStore();

    document.addEventListener("keypress", e => {
        if (e.code == "KeyP") {
            togglePauseGame();
            e.preventDefault();
        }

        if (e.code == "KeyT") {
            test(e.target);
            e.preventDefault();
        }
    });

    var cellInputKeypressTimeoutId = 0;
    document.querySelectorAll("input.d0").forEach(input => {
        input.addEventListener("keyup", e => {
            if (e.key >= 0 && e.key <= 9) {
                clearRepeatedNumber(e.target);
                clearTimeout(cellInputKeypressTimeoutId);
                cellInputKeypressTimeoutId = setTimeout(clearClues(e.target), 500);
            }
        });
    });
})();
