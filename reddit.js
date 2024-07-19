// ==UserScript==
// @name         Reddit
// @namespace    http://tampermonkey.net/
// @version      1.6.0
// @description  Utilities for Reddit.com
// @author       LeonAM
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

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
        let url = new URL(window.location.href);

        if (window.location.href.match(/reddit\.com\/r\/\w+\/(?:\w+\/)?$/)) {
            window.location.href = window.location.href + order + "/";
            return;
        }

        if (url.pathname.match(/\/search\//)) {
            if (url.searchParams.has("sort", order)) {
                throw "Search is already sorted by new";
            }
            url.searchParams.set("sort", order);
            window.location.href = url.href;
            return;
        }

        showError("Wrong page for ordering posts");
    }

    /**
     * Redirects from a post page to the crosspost to a community
     */
    function StartCrosspost() {
        let locationMatch = window.location.href.match(/reddit\.com\/(?:r|user)\/\w+\/comments\/(\w*)/);
        if (!locationMatch) {
            showError("Not in Reddit post");
        }

        let postId = locationMatch[1];
        let crosspostTarget = GM_getValue("crosspostTarget", null);
        if (!crosspostTarget) {
            crosspostTarget = selectCrosspostTarget();
        }

        window.location.href = `https://www.reddit.com/r/${crosspostTarget}/submit?source_id=t3_${postId}`;
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
        let subredditSearchMatch = window.location.href.match(/reddit\.com\/r\/(\w+)\/search\//);
        if (!subredditSearchMatch) {
            showError("Not at a subreddit's post search page");
        }

        let subreddit = prompt("Input destiny subreddit's name", subredditSearchMatch[1]);
        if (subreddit) {
            switchSubreddit(subreddit);
        }
    }

    /**
     * Prompts for a subreddit name
     *
     * @returns Subreddit name
     */
    function selectCrosspostTarget() {
        let crosspostTarget = prompt("Insert subreddit crosspost target", "");
        switch (crosspostTarget) {
            case null:
                return;
            case "":
                showError("Not a valid subreddit name");
        }

        GM_setValue("crosspostTarget", crosspostTarget);
        return crosspostTarget;
    }

    /**
     * Starts a search with the results' order as "New"
     */
    function searchNew() {
        let url = new URL(window.location.href);
        let path = url.pathname.split("/");
        let defaultQuery = url.searchParams.get("q") ?? "";

        // In subreddit or user
        if (["r", "user"].includes(path[1])) {
            let searchQuery = prompt("Search", defaultQuery);
            if (searchQuery) {
                window.location.href = `https://reddit.com/${path[1]}/${path[2]}/search/?q=${searchQuery}&sort=new`;
            }
            return;
        }

        // In global search
        if (path[1] == "search") {
            let searchQuery = prompt("Search", defaultQuery);
            if (searchQuery) {
                window.location.href = `https://reddit.com/search/?q=${searchQuery}&sort=new`;
            }
            return;
        }

        showError("Not in Reddit site");
    }

    /**
     * Triggers the "Hide posts like this" in Reddit's home feed when cursor is hovering a post
     */
    function HidePostsLikeThis() {
        let menu = document.querySelector("article:hover shreddit-post-overflow-menu");
        let hideButton = menu.shadowRoot.querySelector(`li`).children[0];
        if (hideButton.innerText.includes("Mostrar menos publicaciones como esta")) {
            hideButton.click();
        }
    }

    GM_registerMenuCommand("Start Crosspost", StartCrosspost);
    GM_registerMenuCommand("Sort by New", () => switchSortOrder("new"));
    GM_registerMenuCommand("Switch Subreddit", StartSwitchSubreddit);
    GM_registerMenuCommand("Select crosspost target", selectCrosspostTarget);
    GM_registerMenuCommand("Search by new", searchNew);

    document.addEventListener("keyup", e => {
        if (!e.altKey && !e.ctrlKey && !e.shiftKey && e.originalTarget.tagName !== "INPUT") {
            switch (e.code) {
                case "KeyH": HidePostsLikeThis(); break;
            }
        }

        if (e.altKey && !e.ctrlKey && !e.shiftKey) {
            switch(e.code) {
                case "KeyC": StartCrosspost(); break;
                case "KeyN": switchSortOrder("new"); break;
                case "KeyR": StartSwitchSubreddit(); break;
                case "KeyS": searchNew(); break;
            }
        }
    });
})();