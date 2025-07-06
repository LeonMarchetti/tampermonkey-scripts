// ==UserScript==
// @name         Reddit
// @namespace    http://tampermonkey.net/
// @version      2.8.2
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
            return match ? match[1] : null;
        },

        getUser() {
            let match = this.getPath(/\/user\/(\w+)\//).match()
            return match ? match[1] : null;
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
        if (locator.isMediaPage()) {
            CleanMediaPage();
        }

        dismissPostBlur();
    });

    GM_addStyle(`
        .thumbnail-blur {
            filter: none !important;
        }

        article shreddit-post[recommendation-source] { filter: blur(5px) }

        /* Hide right sidebar in posts search */
        shreddit-app[pagetype="search_results"] main { display: contents }
        shreddit-app[pagetype="search_results"] #right-sidebar-container { display: none }

        /* Hide picture in right sidebar */
        #right-sidebar-container img.h-auto
        {
            display: none;
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
     * If current page is a post then it opens the crosspost page on the same tab. If it is a
     * search with a image open then it opens a new tab
     *
     * @param {string} postId Id of post to be crossposted
     */
    function StartCrosspost(postId) {
        if (!postId) {
            showError("Not in Reddit post");
        }

        if (document.querySelector(`shreddit-post`).postType === "video") {
            showError("Video post can't be crossposted to private subreddit");
        }

        let crosspostTarget = GM_getValue("crosspostTarget", null);
        if (!crosspostTarget) {
            crosspostTarget = selectCrosspostTarget();
        }

        let crosspostURL = `https://www.reddit.com/r/${crosspostTarget}/submit?source_id=t3_${postId}`;

        // Determines where to open the crosspost page, same page if on post or new tab if on search
        switch (document.querySelector(`shreddit-app`).pageType) {
            case "community":
                window.open(crosspostURL, "_blank");
                break;
            case "post_detail":
                window.location.href = crosspostURL;
        }
    }

    /**
     * Switches current post search page's subreddit, keeping current search's parameters
     *
     * @param {string?} name Target subreddit's name
     */
    function switchSubreddit(name) {
        let location = new URL(window.location.href);
        let subredditPath = location.pathname.replace(/(?:\/r\/\w+)?/, (name ? `/r/${name}` : "/"));
        window.location.href = "https://reddit.com" + subredditPath + location.search;
    }

    /**
     * Prompts for a subreddit name to switch to
     *
     * @param {string} currentSubreddit Current subreddit's name
     */
    function StartSwitchSubreddit(currentSubreddit) {
        if (!(locator.isSearch() || locator.isRoot() || locator.isSubredditHome())) {
            showError("Not at a subreddit's post search page");
        }

        let subreddit = prompt("Input target subreddit's name", currentSubreddit ?? "");
        switchSubreddit(subreddit);
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
        let subreddit = locator.getSubreddit();
        let searchQuery = prompt(subreddit ? `Search at r/${subreddit}` : "Search",
            locator.getLocation().searchParams.get("q") ?? "");
        if (!searchQuery) {
            return;
        }

        let subPath = "";

        // In subreddit or user, global search by default
        if (subreddit) {
            subPath = "r/" + subreddit;
        } else {
            let user = locator.getUser();
            if (user) {
                subPath = "user/" + user;
            }
        }

        window.location.href = `https://reddit.com/${subPath}/search/?q=${searchQuery}&type=media&sort=new`;
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
     * @param {string | null} postId If on correct page to run this function on the post's carousel
     * gallery, otherwise on carousel under mouse cursor
     * @param {boolean} prev If wanting to browse to the previous image, to the next if false
     */
    function browseGallery(postId, prev = true) {
        let carousel = postId ? document.querySelector(`gallery-carousel[post-id="t3_${postId}"]`)
            : document.querySelector(`gallery-carousel:hover`);

        let slot = prev ? "prev" : "next";
        carousel
            ?.shadowRoot
            .querySelector(`[slot="${slot}Button"]`)
            .click();
    }

    /** Higlight today's and yesterday's dates of posts */
    function highlightDates() {
        /** Get today's date. Accounts for local timezone */
        let todayDate = (new Date);
        todayDate.setHours(todayDate.getHours() - 3);
        /** Today's date string for CSS rule's selector */
        let todayTimestamp = todayDate.toISOString().split("T")[0];
        console.debug(`todayTimestamp = "${todayTimestamp}"`);

        /** Get yesterday's date */
        let yesterdayDate = (new Date);
        yesterdayDate.setHours(yesterdayDate.getHours() - 3);
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        /** Yesterday's date string for CSS rule's selector */
        let yesterdayTimestamp = yesterdayDate.toISOString().split("T")[0];
        console.debug(`yesterdayTimestamp = "${yesterdayTimestamp}"`);

        GM_addStyle(`
            /* Highlight dates from today */
            time[datetime^="${todayTimestamp}"]
            {
                background-color: yellow;
                border: 1px solid;
                border-radius: 5px;
                color: black;
                font-weight: 700;
            }

            /* Highlight dates from yesterday */
            time[datetime^="${yesterdayTimestamp}"]
            {
                background-color: orange;
                border: 1px solid;
                border-radius: 5px;
                color: black;
                font-weight: 700;
            }
        `);
    }

    /**
     * Dismiss blurring of posts in searches by clicking the button in the post
     *
     * Checks for page type and starts an interval in community and search pages. Uses the session
     * storage to store the interval index and use it to clear it when unused.
     */
    function dismissPostBlur() {
        if (!locator.isMediaSearch() && (locator.isSearch() || locator.isSubredditHome())) {
            let blurInterval = setInterval(() => {
                Array.from(document.querySelectorAll(`shreddit-blurred-container`))
                    .forEach(container => {
                        if (container.shadowRoot.querySelector(".blurred")) {
                            container.shadowRoot.children[0].click();
                        }
                    });
            }, 500);
            sessionStorage.setItem("BLUR_INTERVAL", blurInterval);
        } else {
            clearInterval(sessionStorage.getItem("BLUR_INTERVAL"));
        }
    }

    /**
     * Opens the original image of the current post
     *
     * Currently doesn't work on videos
     *
     * @param {boolean} newTab Open image in a new tab, default false
     */
    function OpenImage(newTab = false) {
        let lightbox = ["community", "home"].includes(document.querySelector("shreddit-app").pageType) ? "#shreddit-media-lightbox " : "";
        let imgElement = document.querySelector(`${lightbox}li[style*="visibility: visible"] img`) ??
            document.querySelector(`${lightbox}zoomable-img img`) ??
            document.querySelector(`${lightbox}source`);

        if (!imgElement) {
            showError("No image to open found");
        }

        if (newTab) {
            window.open(imgElement.src, "_blank");
        } else {
            window.location.href = imgElement.src;
        }
    }


    highlightDates();

    GM_registerMenuCommand("Start Crosspost", () => StartCrosspost(locator.getPostId()));
    GM_registerMenuCommand("Sort by New", () => switchSortOrder(locator.isSubredditHome(), locator.isSearch(), "new"));
    GM_registerMenuCommand("Switch Subreddit", () => StartSwitchSubreddit(locator.getSubreddit()));
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
                case "KeyI": OpenImage(); break;
                case "KeyN": switchSortOrder(locator.isSubredditHome(), locator.isSearch(), "new"); break;
                case "KeyR": StartSwitchSubreddit(locator.getSubreddit()); break;
                case "KeyS": searchNew(); break;
            }
        }

        // ALT + SHIFT
        if (e.altKey && !e.ctrlKey && e.shiftKey) {
            switch (e.code) {
                case "KeyI": OpenImage(true); break;
            }
        }
    });
})();