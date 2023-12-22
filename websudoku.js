// ==UserScript==
// @name         Web Sudoku
// @namespace    http://tampermonkey.net/
// @version      1.8.0
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
     * Returns the Sudoku table element, with id `puzzle_grid`. Raises exception if not found.
     *
     * @returns {HTMLTableElement} Table HTML element
     */
    function getTable() {
        let table = document.getElementById("puzzle_grid");
        if (!table) {
            throw new DOMException("No table#puzzle_grid element");
        }
        return table;
    }

    /**
     * Prints message in console preppending the script's name
     *
     * @param {string} text Message content
     * @param {boolean} loglevel Log level
     */
    function log(text, logLevel = "debug") {
        var logFunction = console.log;
        switch (logLevel) {
            case "debug":
            case "D":
                logFunction = console.debug;
                break;

            case "error":
            case "E":
                logFunction = console.error;
                break;
        }
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
     * Get object with row, column and box's index of a selected cell
     *
     * @param {HTMLInputElement} cell Selected cell
     * @returns {{"row": number, "column": number, "box": number}}
     */
    function getCellLocation(cell) {
        let row = cell.parentElement.parentElement.rowIndex;
        let column = cell.parentElement.cellIndex;
        return {
            row: row,
            column: column,
            box: getBoxIndex(row, column)
        }
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
        let table = getTable();

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

        throw new DOMException("Buttons not found");
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
            let inputLocation = getCellLocation(input);
            let deletedNumbers = [];

            // Traverse row, column and box
            store.getCells(inputLocation.row, inputLocation.column).forEach(cell => {
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
                log(`Cell [${inputLocation.row + 1},${inputLocation.column + 1}] deleted: ${deletedNumbers.join(", ")}`);
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
            let inputLocation = getCellLocation(input);

            store.getCells(inputLocation.row, inputLocation.column).forEach(cell => {
                if (cell
                    && cell != input
                    && cell.value.length >= 1
                    && cell.value.includes(currValue)
                ) {
                    cell.value = cell.value.replaceAll(currValue, "");
                    let cellLocation = getCellLocation(cell);
                    log(`Cell [${cellLocation.row}, ${cellLocation.column}] deleted clue: ${currValue}`);
                    if (cell.value.length == 1 && cell.className != "s0") {
                        cell.className = "d0";
                        clearClues(cell);
                    }
                }
            });
        }
    }

    /** Class that handles the undo/redo behavior */
    class Undoer {
        /**
         * Saved states of the board
         *
         * @type {{value: string, location: {row: number, column: number, box: number}}[][]}
         */
        state;

        constructor() {
            this.state = [];
        }

        /**
         * Saves the current state of the board for undoing. Receives the location and previous
         * value of the edited cell
         *
         * @param {string} prevValue Edited cell's last value
         * @param {object} location Edited cell's location
         */
        save(prevValue, location) {
            let table = getTable();
            let currentState = [];

            let rows = table.firstChild.childNodes;
            rows.forEach(row => {
                let rowNo = row.rowIndex;
                Array
                    .from(rows[rowNo].childNodes)
                    .forEach(td => {
                        let cell = td.firstChild;
                        if (cell.className != "s0") {
                            currentState.push({
                                value: cell.value,
                                location: getCellLocation(cell)
                            });
                        }
                    });
            });
            /* Push the previous value of the edited cell to be processed last (overwrites state
             * from last step)
             * Otherwise the "keyup" event grabs the cell's value after editing
             */
            currentState.push({
                value: prevValue,
                location: location
            });
            this.state.push(currentState);
        }

        /**
         * Loads a saved state and updates the board with the old values
         *
         * Throws and exception if the state is empty
         */
        load() {
            if (this.state.length == 0) {
                throw new Error("There is no saved state");
            }

            try {
                var loadedState = this.state.pop();
                for (let cellState of loadedState) {
                    let rowNo = cellState.location.row;
                    let colNo = cellState.location.column;
                    let cell = store.rows[rowNo][colNo]
                    cell.value = cellState.value;
                }
            } catch (error) {
                // On error catch error's message and push popped state back to list
                log(error.message, "error");
                this.state.push(loadedState);
            }
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
        /* log("TEST");
        log("cell");
        console.log(cell);
        log("store");
        console.log(store);

        let cellLocation = getCellLocation(cell);

        let storeCells = store.getCells(cellLocation.row, cellLocation.column);
        log(`store.getCells(${cellLocation.row}, ${cellLocation.column})`);
        console.log(storeCells);

        let box = store.boxes[cellLocation.box];
        log("box");
        console.log(box);

        let values = [];
        storeCells.forEach(cell => {
            if (cell.value.length == 1) {
                values.push(cell.value);
            }
        });

        console.table({
            "rowNo": cellLocation.row,
            "colNo": cellLocation.column,
            "boxNo": cellLocation.box,
            "values": values.join(", "),
            "values (unique)": [...new Set(values)].sort().join(", "),
        }); */

        if (undoer.state.length) {
            log(`undoer.state.length = ${undoer.state.length}`);
            console.debug(undoer.state);
            console.debug(undoer.state.map(
                s => s.filter(
                    z => z.value != "")));
        } else {
            log("Empty state");
        }
    }

    try {
        var store = makeCellsListStore();
        var undoer = new Undoer();
    } catch (error) {
        // Do nothing
    }

    document.addEventListener("keypress", e => {
        switch (e.code) {
            case "KeyP": // Pause
                togglePauseGame();
                e.preventDefault();
                break;

            case "KeyT": // Test
                test(e.target);
                e.preventDefault();
                break;

            case "KeyZ": // Undo
                try {
                    undoer.load();
                } catch (error) {
                    log(error.message, "error");
                }
                e.preventDefault();
                break;
        }
    });

    var cellInputKeypressTimeoutId = 0;
    document.querySelectorAll("input.d0").forEach(input => {
        input.addEventListener("keydown", e => {
            e.target.dataset.prev = e.target.value;
            e.target.dataset.location = JSON.stringify(getCellLocation(e.target));
        });
        input.addEventListener("keyup", e => {
            if (e.key >= 0 && e.key <= 9) {
                let cell = e.target;
                clearRepeatedNumber(e.target);
                if (cell.value) {
                    clearTimeout(cellInputKeypressTimeoutId);
                    cellInputKeypressTimeoutId = setTimeout(() => {
                        undoer.save(cell.dataset.prev, JSON.parse(cell.dataset.location));
                        clearClues(cell);
                    }, 500);
                }
            }
        });
    });
})();
