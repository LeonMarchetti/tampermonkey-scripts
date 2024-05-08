// ==UserScript==
// @name         Reddit
// @namespace    http://tampermonkey.net/
// @version      1.0.0
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

    document.addEventListener("keyup", e => {
        if (e.code == "KeyC" && e.altKey && !e.ctrlKey && !e.shiftKey) {
            StartCrosspost();
        }
    });
})();