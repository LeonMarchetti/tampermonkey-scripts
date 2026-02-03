// ==UserScript==
// @name         Reddit
// @namespace    http://tampermonkey.net/
// @version      2.11.1
// @description  Utilities for Reddit.com
// @author       LeonAM
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @require      https://cdn.rawgit.com/LeonMarchetti/tampermonkey-scripts/refs/heads/master/lib/pageChangeInterval.js
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
    'use strict';

    console.info(`Running UserScript "Reddit"`);

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

        isFeed() {
            return ["", "/", "best/", "hot/", "new/", "top/"].includes(
                this.getPath().replace(/^\/r\/\w+\//, ""));
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
            : (document.activeElement && document.activeElement.tagName !== "BODY")
            ? document.activeElement.parentElement.querySelector("gallery-carousel")
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
        if (!locator.isMediaSearch() && (locator.isSearch() || locator.isFeed())) {
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
     * Gets the original image source from a preview URL
     * @param {string} src Image source
     * @returns URL from i.redd.it if source is from preview, return original if not
     */
    function formatPreviewSrc(src) {
        // Remove size modifiers from preview URLs
        const url = new URL(src);
        if (url.host === "preview.redd.it") {
            return "https://i.redd.it/" + url.pathname.match(/\w*\.(gif|png)/) [0];
        }
        return src;
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

        const imgSource = formatPreviewSrc(imgElement.src);

        if (newTab) {
            window.open(imgSource, "_blank");
        } else {
            window.location.href = imgSource;
        }
    }


    highlightDates();

    GM_registerMenuCommand("Start Crosspost", () => StartCrosspost(locator.getPostId()));
    GM_registerMenuCommand("Sort by New", () => switchSortOrder(locator.isFeed(), locator.isSearch(), "new"));
    GM_registerMenuCommand("Select crosspost target", selectCrosspostTarget);

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
                case "KeyN": switchSortOrder(locator.isFeed(), locator.isSearch(), "new"); break;
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