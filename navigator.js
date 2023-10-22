// ==UserScript==
// @name         Navigator
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Navigates in paginated sites
// @author       LeonAM
// @match        *://*/*
// @grant        GM_info
// ==/UserScript==

(function () {
    'use strict';

    console.info(`Running UserScript "${GM_info.script.name}"`);

    /**
     * Class that provides the methods for navigating left and right of a paginated site.
     *
     * Should be extended for the different sites.
     */
    class Navigator {
        constructor() {
            this.label = "";
            this.match = "";
        }

        /**
         * Gets the navigation bar object which contains the paginated links
         *
         * @returns {HTMLElement} Navigation bar
         */
        getNavigatorBar() {
            return document.getElementsByTagName("nav")[0];
        }

        /** Navigates to the next page */
        navigateNext() {
            throw "Not implemented";
        }

        /** Navigates to the last page */
        navigateLast() {
            throw "Not implemented";
        }
    }

    /**
     * Array of classes that extends `Navigator`
     *
     * NOTE Should be able to automatically detect all classes which extend `Navigator` but didn't find how.
     *
     * @type {typeof Navigator[]}
     */
    const navigatorClasses = [];

    /** List of navigators for each site */
    const navigators = navigatorClasses.map(n => new n());

    let navigator = navigators.filter(n => window.location.href.match(n.match))[0];
    if (navigator) {
        console.debug(`Matched ${navigator.label}`, navigator);
        document.addEventListener("keydown", e => {
            switch (e.code) {
                case "ArrowLeft":
                    navigator.navigateLast();
                    break;

                case "ArrowRight":
                    navigator.navigateNext();
                    break;
            }
        });
    }
})();