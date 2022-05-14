// ==UserScript==
// @name         DeviantArt
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  Funcionalidades para deviantart.com
// @author       LeonAM
// @match        https://www.deviantart.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deviantart.com
// @require      file://<PATH>/deviantart.js
// @grant        GM_addStyle
// @grant        GM_info
// ==/UserScript==

(function () {
    'use strict';

    console.info(`Running UserScript "${GM_info.script.name}"`);

    /** If the current page is a DeviantArt post. Otherwise, a collection or search results page. */
    const isPost = window.location.href.includes("/art/");

    /** Store last search name. */
    var searchCache = "";

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

    /**
     * Prompts the user to input the collection name to search. Stores text for
     * next search
     */
    function inputText() {
        var text = prompt("Input collection name", searchCache);
        if (!text) {
            text = "";
            console.error("Text missing");
        }
        searchCache = text;
        return text;
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

    /** Test */
    function test() {
        console.log("test()");
    }

    document.addEventListener("keyup", e => {
        var ctrl = e.ctrlKey;
        var alt = e.altKey;
        var shift = e.shiftKey;

        if (ctrl && !alt && shift) {
            switch (e.code) {
                case "KeyF": clickCollection(); break;
                // case "KeyF": test(); break;
            }
        }
    });
})();
