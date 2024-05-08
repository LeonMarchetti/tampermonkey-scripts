// ==UserScript==
// @name         Reddit
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Utilities for Reddit.com
// @author       LeonAM
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    /** TODO Put community name to crosspost post to */
    const COMMUNITY = "";

    /**
     * Switches the community posts' sort order.
     *
     * @param {string} order Post's order criteria
     */
    function switchCommunitySortOrder(order) {
        let locationMatch = window.location.href.match(/reddit\.com\/r\/\w+\/(?:\w+\/)?$/);
        if (!locationMatch) {
            console.error("Not in a Reddit community");
            return;
        }

        window.location.href = window.location.href + order + "/";
    }

    /**
     * Redirects from a post page to the crosspost to a community
     */
    function StartCrosspost() {
        let locationMatch = window.location.href.match(/reddit\.com\/r\/\w+\/comments\/(\w*)/);
        if (! locationMatch) {
            console.error("Not in Reddit post");
            return;
        }

        let postId = locationMatch[1];
        let newLocation = `https://www.reddit.com/r/${COMMUNITY}/submit?source_id=t3_${postId}`;
        window.location.href = newLocation;
    }

    GM_registerMenuCommand("Start Crosspost", StartCrosspost);
    GM_registerMenuCommand("Sort by New", () => switchCommunitySortOrder("new"));

    document.addEventListener("keyup", e => {
        if (e.altKey && !e.ctrlKey && !e.shiftKey) {
            switch(e.code) {
                case "KeyC": StartCrosspost(); break;
                case "KeyN": switchCommunitySortOrder("new"); break;
            }
        }
    });
})();