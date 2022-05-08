// ==UserScript==
// @name         DeviantArt Observer
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Observers for deviantart.com
// @author       LeonAM
// @match        https://www.deviantart.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deviantart.com
// @require      file://<PATH>/deviantart-observer.js
// @grant        GM_info
// ==/UserScript==

(function () {
    'use strict';

    console.log(`Running UserScript "${GM_info.script.name}"`);

    /**
     * Starts an observer over the `targetNode`, whose callback adds the nodes
     * to each of the MutationHandler objects in `mutationHandlerList`.
     */
    function mutationObserve(targetNode, mutationHandlerContainer) {
        mutationHandlerContainer.handle(targetNode);

        const observer = new MutationObserver(function (mutationsList, observer) {
            mutationsList.forEach(m => {
                m.addedNodes.forEach(node => mutationHandlerContainer.handle(node));
            });
        });
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    /** Class which objects manage a list of MutationHandler objects. */
    class MutationHandlerContainer {
        constructor() {
            this.handlerList = [];
        }

        /** Adds a MuttionHandler object to this container. */
        addHandler(mutationHandler) {
            this.handlerList.push(mutationHandler);
        }

        /** Adds the node to the handler of all MutationHandler objects of this container. */
        handle(node) {
            this.handlerList.forEach(handler => handler.handle(node));
        }
    }

    /** Class that defines a task to execute over the observed nodes. */
    class MutationHandler {
        constructor(targetClassList) {
            if (this.constructor == MutationHandler) {
                throw new Error("This class can't be instantiated");
            }

            this.targetClassList = targetClassList;
        }

        /**
         * Executes the task of this MutationHandler over the child elements of
         * the target node `node`.
         *
         * If you want to work only over the target node, overwrite this method
         * to skip the `forEach` if desired.
         */
        handle(node) {
            if (node.nodeType == Node.TEXT_NODE) return; // Text node

            node.querySelectorAll(this.targetClassList).forEach(e => this.work(e));
        }

        /** Executes a task over a node affected by this MutationHandler. */
        work(e) {
            throw new Error("Missing implementation");
        }
    }

    /**
     * MutationHandler implementation that detects the "Added to Featured |
     * Change Collection" dialog and clicks the "Change Collection"
     * link/button.
     */
    class ChangeCollectionHandler extends MutationHandler {
        label = "Change Collection";

        /**
         * Checks if `node` is the favorited post dialog and if it has a
         * "Change Collection" button, which it then triggers a click to show
         * the collections list.
         */
        handle(node) {
            if (node.nodeName !== "DIV" || !node.textContent.includes(this.label)) return;

            const button = Array.from(node.querySelectorAll("button")).reduce(
                (prev, curr) => curr.textContent === this.label ? curr : prev
            );

            if (button) button.click();
        }
    }

    const mutationHandlerContainer = new MutationHandlerContainer();
    mutationHandlerContainer.addHandler(new ChangeCollectionHandler("div"));
    mutationObserve(document.body, mutationHandlerContainer);

})();
