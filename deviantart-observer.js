// ==UserScript==
// @name         DeviantArt Observer
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Observers for deviantart.com
// @author       LeonAM
// @match        https://www.deviantart.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deviantart.com
// @require      file://<PATH>/lib/mutationHandler.js
// @require      file://<PATH>/deviantart-observer.js
// @grant        GM_info
// ==/UserScript==

(function () {
    'use strict';

    console.log(`Running UserScript "${GM_info.script.name}"`);

    /**
     * MutationHandler implementation that detects the "Added to Featured |
     * Change Collection" dialog and clicks the "Change Collection"
     * link/button
     */
    class ChangeCollectionHandler extends MutationHandler {
        /**
         * Text to search to identify the button that opens the collections'
         * list
         */
        label = "Change Collection";

        /**
         * Checks if `node` is the favorited post dialog and if it has a
         * "Change Collection" button, which it then triggers a click to open
         * the collections list
         *
         * @param {Node} node
         */
        handle(node) {
            if (node.nodeName !== "DIV" || !node.textContent.includes(this.label))
                return;

            const button = Array.from(node.querySelectorAll("button")).reduce(
                (prev, curr) => curr.textContent === this.label ? curr : prev
            );

            if (button) {
                button.click();
            }
        }
    }

    const mutationHandlerContainer = new MutationHandlerContainer();
    mutationHandlerContainer.addHandler(new ChangeCollectionHandler("div"));
    mutationObserve(document.body, mutationHandlerContainer);

})();
