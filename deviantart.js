// ==UserScript==
// @name         DeviantArt
// @namespace    http://tampermonkey.net/
// @version      1.10.0
// @description  Funcionalidades para deviantart.com
// @author       LeonAM
// @match        https://www.deviantart.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deviantart.com
// @require      file://<PATH>/lib/mutationHandler.js
// @require      file://<PATH>/deviantart.js
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    console.info(`Running UserScript "${GM_info.script.name}"`);

    /** If the current page is a DeviantArt post. Otherwise, a collection or search results page. */
    const isPost = window.location.href.includes("/art/");

    GM_addStyle(`
        .deviantart-postButtons {
            cursor: pointer;
            color: var(--L8);
            font-weight: 400;
            font-size: 14px;
            letter-spacing: .3px;
            font-family: devioussans02bold,Helvetica Neue,Helvetica,Arial,メイリオ, meiryo,ヒラギノ角ゴ pro w3,hiragino kaku gothic pro,sans-serif;
            line-height: 20px;
            margin: 0 5px 0 5px;
        }
    `.trim());

    /**
     * Searchs for the collection named `name` (case insensitive), searching
     * for a leaf node `<div>` whose text content is `name`.
     *
     * Makes sure the collection node has `ancestor` as an ancestor node.
     */
    function searchCollection(name, ancestor = document) {
        const searchResult = Array.from(document.querySelectorAll("div").values())
            .filter(e => e.children.length === 0 && e.textContent.toLowerCase().includes(name.toLowerCase()) && ancestor.contains(e));

        if (searchResult.length > 0) {
            return searchResult[0].parentElement.parentElement;
        }

        return null;
    }

    /** Prompts the user to input the collection name to search. Stores text for next search. */
    function inputText() {
        const text = prompt("Input collection name", GM_getValue("deviantart-search"));
        if (!text) {
            console.error("Text missing");
        } else {
            GM_setValue("deviantart-search", text);
        }
        return text;
    }

    /**
     * Starts an interval to search for the collection. If not found, it
     * triggers the scroll of the dialog to load more collections and search
     * again
     *
     * It clicks the collection element to add or remove the post to the
     * collection
     *
     * @param {Element} collectionsList Collections' list dialog
     * @param {string} collectionName Name of the searched collection
     */
    function run(collectionsList, collectionName) {
        const interval2 = setInterval(function () {
            /* Checks if the collections list is open by looking for
             * "Featured", otherwise it finishes the interval. */
            if (!searchCollection("Featured")) {
                clearInterval(interval2);
                console.error("Collection list was closed");
                throw "Collection list was closed";
            }

            var collectionDiv = searchCollection(collectionName, collectionsList);
            if (collectionDiv) {
                clearInterval(interval2);

                collectionDiv.scrollIntoView();
                if (isPost) {
                    window.scrollTo(0, 0);
                }

                collectionDiv.click();
            } else {
                collectionsList.scrollTop = collectionsList.scrollHeight;
            }
        }, 500);
    }

    /**
     * Adds the "Choose collection" button to the collections' list dialog
     *
     * @param {Element} element Element to add the button next
     * @param {() => void} clickEventHandler Click handler of the button
     */
    function addChooseCollectionButton(element, clickEventHandler) {
        if (document.getElementById("choose-collection")) {
            console.error("Choose Collection button already created!")
            console.log(document.getElementById("choose-collection"));
            return;
        }

        /** Get the "Done" button to copy its style for the new button */
        const doneButton = [...document.querySelectorAll("button")]
            .filter(button => button.textContent.includes("Done"))[0];

        const chooseCollectionButton = document.createElement("button");
        chooseCollectionButton.classList = doneButton.classList;
        chooseCollectionButton.id = "choose-collection";
        chooseCollectionButton.innerHTML = "Choose collection";
        chooseCollectionButton.addEventListener("click", clickEventHandler);

        const buttonContainer = document.createElement("div");
        buttonContainer.classList = doneButton.parentElement.classList;
        buttonContainer.appendChild(chooseCollectionButton);

        const targetContainer = element.parentElement.parentElement;
        targetContainer.after(buttonContainer);
    }

    /**
     * MutationHandler implementation that adds a "Choose Collection" button to
     * the collections' list dialog as an alternative to the hotkey
     */
    class AddToCollectionHandler extends MutationHandler {
        /**
         * Searches for the header element with the "Add to Collection" text
         * and adds a new button next to it
         *
         * @param {Element} element "Add to Collection" header
         */
        work(element) {
            if (element.textContent.includes("Add to Collection")) {
                addChooseCollectionButton(element, () => {
                    const text = inputText();
                    if (text) {
                        run(searchCollection("Featured").parentElement, text);
                    }
                });
            }
        }
    }

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
         * Checks if `element` is the favorited post dialog and if it has a
         * "Change Collection" button, which it then triggers a click to open
         * the collections list
         *
         * @param {Element} element
         */
        handle(element) {
            if (element.nodeName !== "DIV" || !element.textContent.includes(this.label))
                return;

            const button = Array.from(element.querySelectorAll("button")).reduce(
                (prev, curr) => curr.textContent === this.label ? curr : prev
            );

            if (button) {
                button.click();
            }
        }
    }

    /**
     * Searches the collection with a name input by the user in the user's
     * collections list, and triggers a click to assign the current post to
     * the selected collection. If the collection doesn't exist, it triggers
     * the scrolling of the `<div>` of the list to load a new set of
     * collections and repeat the search.
     *
     * If the collections list is not open, it opens automatically.
     *
     * Not able to detect if the input text doesn't match any collection.
     */
    function clickCollection() {
        var featuredCollection = searchCollection("Featured");

        if (featuredCollection) {
            const text = inputText();
            if (text) {
                run(featuredCollection.parentElement, text);
            }

        } else {
            if (isPost) {
                // Clic en el botón flecha que abre la lista de colecciones
                document.querySelector("[data-hook=fave_button]").nextSibling.click();

                // Intervalo para esperar hasta que aparezca la lista de colecciones
                const interval1 = setInterval(function () {
                    featuredCollection = searchCollection("Featured");
                    if (featuredCollection) {
                        clearInterval(interval1);

                        const text = inputText();
                        if (text) {
                            run(featuredCollection.parentElement, text);
                        }
                    }
                }, 500);

            } else {
                console.error("Collections list is not open");
                throw "Collections list is not open";
            }
        }
    }

    /** Returns the current's post image element */
    function getPostImage() {
        return document.querySelector('div[draggable] img');
    }

    /** Builds a new button for placing along side the post's image */
    function buildPostButtons(label, listener) {
        const button = document.createElement("span");
        button.innerHTML = label;
        button.classList.add("deviantart-postButtons");
        button.addEventListener("click", listener);

        // Container div of the post's image
        document.querySelector("div[draggable]")
            .append(button);
    }

    if (isPost) {
        buildPostButtons("Same Tab", () => { window.location.href = getPostImage().src; });
        buildPostButtons("New Tab", () => { GM_openInTab(getPostImage().src); });
        buildPostButtons("Choose Collection", () => { clickCollection(); });
    }

    const mutationHandlerContainer = new MutationHandlerContainer();
    mutationHandlerContainer.addHandler(new AddToCollectionHandler("h2,h3"));
    mutationHandlerContainer.addHandler(new ChangeCollectionHandler("div"));
    mutationObserve(document.body, mutationHandlerContainer);

    document.addEventListener("keyup", e => {
        var ctrl = e.ctrlKey;
        var alt = e.altKey;
        var shift = e.shiftKey;

        if (ctrl && !alt && shift) {
            switch (e.code) {
                case "KeyF": clickCollection(); break;
            }
        }
    });
})();
