// ==UserScript==
// @name         Reddit
// @namespace    http://tampermonkey.net/
// @version      1.4.0
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
     * Shows an alert and throws an Exception
     *
     * @param {string} message Error message
     * @throws Exception
     */
    function showError(message) {
        alert(message);
        throw message;
    }

    /**
     * Switches the community or search result's posts sort order
     *
     * @param {string} order Post's order criteria
     */
    function switchSortOrder(order) {
        if (window.location.href.match(/reddit\.com\/r\/\w+\/(?:\w+\/)?$/)) {
            window.location.href = window.location.href + order + "/";
            return;
        }

        if (window.location.href.match(/reddit\.com\/r\/\w+\/search\//)) {
            window.location.href = window.location.href + "&sort=" + order;
            return;
        }

        showError("Wrong page for ordering posts");
    }

    /**
     * Redirects from a post page to the crosspost to a community
     */
    function StartCrosspost() {
        let locationMatch = window.location.href.match(/reddit\.com\/r\/\w+\/comments\/(\w*)/);
        if (! locationMatch) {
            showError("Not in Reddit post");
        }

        let postId = locationMatch[1];
        let newLocation = `https://www.reddit.com/r/${COMMUNITY}/submit?source_id=t3_${postId}`;
        window.location.href = newLocation;
    }

    /**
     * Switches current post search page's subreddit, keeping current search's parameters
     *
     * @param {string} name Destiny subreddit's name
     */
    function switchSubreddit(name) {
        let subredditSearchMatch = window.location.href.match(/reddit\.com\/r\/\w+\/search\/(.*)/);
        let searchQuery = subredditSearchMatch[1];
        window.location.href = `https://reddit.com/r/${name}/search/${searchQuery}`;
    }

    /** Prompts for a subreddit name to switch to */
    function StartSwitchSubreddit() {
        if (!window.location.href.match(/reddit\.com\/r\/\w+\/search\//)) {
            showError("Not at a subreddit's post search page");
        }

        let subreddit = prompt("Input destiny subreddit's name", null);

        if (!subreddit) {
            showError("Not valid subreddit name");
        }

        switchSubreddit(subreddit);
    }

    GM_registerMenuCommand("Start Crosspost", StartCrosspost);
    GM_registerMenuCommand("Sort by New", () => switchSortOrder("new"));
    GM_registerMenuCommand("Switch Subreddit", StartSwitchSubreddit);

    document.addEventListener("keyup", e => {
        if (e.altKey && !e.ctrlKey && !e.shiftKey) {
            switch(e.code) {
                case "KeyC": StartCrosspost(); break;
                case "KeyN": switchSortOrder("new"); break;
                case "KeyR": StartSwitchSubreddit(); break;
            }
        }
    });
})();