// ==UserScript==
// @name         Reddit
// @namespace    http://tampermonkey.net/
// @version      2.2.3
// @description  Utilities for Reddit.com
// @author       LeonAM
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @require      https://cdn.rawgit.com/LeonMarchetti/tampermonkey-scripts/refs/heads/master/lib/pageChangeInterval.js
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
    'use strict';

    console.info(`Running UserScript "${GM_info.script.name}"`);

    /**
     * Object with methods for site's location
     */
    const locator = {
        getLocation() {
            return new URL(window.location.href);
        },

        getPath() {
            return this.getLocation().pathname;
        },

        getSubreddit() {
            let match = this.getPath().match(/\/r\/(\w+)\//);
            return match[1];
        },

        isRoot() {
            return this.getPath() === "/";
        },

        isSubredditHome() {
            return this.getLocation().href.match(/\/r\/(\w+)\/(?:\w+\/)?$/);
        },

        getPostId() {
            let postMatch = this.getPath().match(/\/(?:r|user)\/\w+\/comments\/(\w*)/);
            return postMatch ? postMatch[1] : null;
        },

        isSearch() {
            return this.getPath().match(/\/search\//);
        },

        isMediaSearch() {
            return this.getLocation().searchParams.get("type") === "media";
        },

        isMediaPage() {
            return this.getPath() === "/media";
        }
    };

    // Page change detector
    setPageChangeInterval((url) => {
        if (locator.isMediaSearch()) {
            let mediaPageInterval = setInterval(() => {
                // Waits until it loads the multimedia tab's contents. Otherwise it tries
                // hiding the bar before it appears
                if (document.getElementById("search-results-page-tab-media").tagName === "BUTTON") {
                    clearInterval(mediaPageInterval);
                    HideMediaSidebar();
                }
            }, 500);
        }

        if (locator.isMediaPage()) {
            CleanMediaPage();
        }
    });

    // Remove blurring from spoiler posts' search
    GM_addStyle(`
        .thumbnail-blur {
            filter: none !important;
        }
    `.trim());

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
     * @param {boolean} isSubreddit If current page has a subreddit
     * @param {boolean} isSearch If current page is a post search
     * @param {string} order Post's order criteria
     */
    function switchSortOrder(isSubreddit, isSearch, order) {
        if (isSubreddit) {
            window.location.href = window.location.href + order + "/";
            return;
        }

        if (isSearch) {
            let url = new URL(window.location.href);
            if (url.searchParams.has("sort", order)) {
                showError("Search is already sorted by new");
            }
            url.searchParams.set("sort", order);
            window.location.href = url.href;
            return;
        }

        showError("Wrong page for ordering posts");
    }

    /**
     * Redirects from a post page to the crosspost to a community
     *
     * @param {string} postId Id of post to be crossposted
     */
    function StartCrosspost(postId) {
        if (!postId) {
            showError("Not in Reddit post");
        }

        let crosspostTarget = GM_getValue("crosspostTarget", null);
        if (!crosspostTarget) {
            crosspostTarget = selectCrosspostTarget();
        }

        window.location.href = `https://www.reddit.com/r/${crosspostTarget}/submit?source_id=t3_${postId}`;
    }

    /**
     * Switches current post search page's subreddit, keeping current search's parameters
     *
     * @param {string} name Target subreddit's name
     */
    function switchSubreddit(name) {
        let subredditSearchMatch = window.location.href.match(/reddit\.com\/r\/\w+\/search\/(.*)/);
        let searchQuery = subredditSearchMatch[1];
        window.location.href = `https://reddit.com/r/${name}/search/${searchQuery}`;
    }

    /**
     * Prompts for a subreddit name to switch to
     *
     * @param {boolean} isSearch If current page is a post search
     * @param {string} currentSubreddit Current subreddit's name
     */
    function StartSwitchSubreddit(isSearch, currentSubreddit) {
        if (!isSearch) {
            showError("Not at a subreddit's post search page");
        }

        let subreddit = prompt("Input target subreddit's name", currentSubreddit);
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
    function hidePostsLikeThis() {
        const SHOW_LESS_LABEL = "Mostrar menos publicaciones como esta";
        const HIDE_LABEL = "Ocultar";

        let menu = document.querySelector("article:hover shreddit-post-overflow-menu");
        let menuItems = Array.from(menu.shadowRoot.querySelectorAll(`li`));
        for (let label of [SHOW_LESS_LABEL, HIDE_LABEL]) {
            let button = menuItems.find(li => li.innerText.includes(label));
            button = button?.children[0].click();
        }
    }

    /**
     * Hides comment thread under mouse cursor
     */
    function hideCommentSubthread() {
        let hoverComments = document.querySelectorAll('shreddit-comment:hover')
        let comment = Array.from(hoverComments).pop();
        let toggleButton = comment.shadowRoot.querySelector('[aria-label^="Toggle"]');
        toggleButton.click();
    }

    /**
     * Implements functions for hiding elements with hotkey
     *
     * @param {boolean} isRoot If current page is the site's root
     * @param {boolean} isPost If current page is a post
     */
    function HideCommand(isRoot, isPost) {
        if (isRoot) {
            hidePostsLikeThis();
        } else if (isPost) {
            hideCommentSubthread();
        }
    }

    /**
     * Hides the right sidebar in a media-type post search
     */
    function HideMediaSidebar() {
        console.debug("Hidden right sidebar");
        document.getElementById("main-content").style.display = "contents";

        let rightSidebar = document.getElementById("right-sidebar-container");
        rightSidebar.style.display = "none";
        console.debug(rightSidebar);
    }

    /**
     * Cleans Reddit's image viewer of unnecessary elements
     */
    function CleanMediaPage() {
        let postBottomBar = document.querySelector(`faceplate-tracker[noun="image"]`).nextElementSibling;
        postBottomBar.style.display = "none";
        console.debug(postBottomBar);

        let img = document.querySelector("zoomable-img");
        img.style.height = "calc(100vh - 4rem)";
        img.style.padding = "0";
    }

    /**
     * Browses a image gallery, with the next and previous buttons
     *
     * @param {boolean} enabled If on correct page to run this function
     * @param {boolean} prev If wanting to browse to the previous image, to the next if false
     */
    function browseGallery(enabled, prev = true) {
        if (!enabled) {
            return;
        }

        let slot = prev ? "prev" : "next";
        document
            .querySelectorAll(`gallery-carousel`)
            .forEach(gallery => {
                gallery?.shadowRoot
                    .querySelector(`[slot="${slot}Button"]`)
                    .click();
            });
    }

    GM_registerMenuCommand("Start Crosspost", () => StartCrosspost(locator.getPostId()));
    GM_registerMenuCommand("Sort by New", () => switchSortOrder(locator.isSubredditHome(), locator.isSearch(), "new"));
    GM_registerMenuCommand("Switch Subreddit", () => StartSwitchSubreddit(locator.isSearch(), locator.getSubreddit()));
    GM_registerMenuCommand("Select crosspost target", selectCrosspostTarget);
    GM_registerMenuCommand("Search by new", searchNew);

    document.addEventListener("keyup", e => {
        if (!e.altKey && !e.ctrlKey && !e.shiftKey && e.originalTarget.tagName !== "INPUT") {
            switch (e.code) {
                case "KeyH": HideCommand(locator.isRoot(), locator.getPostId()); break;
                case "ArrowLeft": browseGallery(locator.getPostId()); break;
                case "ArrowRight": browseGallery(locator.getPostId(), false); break;
            }
        }

        if (e.altKey && !e.ctrlKey && !e.shiftKey) {
            switch (e.code) {
                case "KeyC": StartCrosspost(locator.getPostId()); break;
                case "KeyN": switchSortOrder(locator.isSubredditHome(), locator.isSearch(), "new"); break;
                case "KeyR": StartSwitchSubreddit(locator.isSearch(), locator.getSubreddit()); break;
                case "KeyS": searchNew(); break;
            }
        }
    });
})();