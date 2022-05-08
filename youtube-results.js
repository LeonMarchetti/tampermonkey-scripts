// ==UserScript==
// @name         YouTube Results
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Utilities to use in YouTube
// @author       LeonAM
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require      file://<PATH>/youtube-results.js
// @grant        GM_info
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
    'use strict';

    console.info(`Running UserScript "${GM_info.script.name}"`);

    /**
     * Results ordering criteria.
     *
     * - FECSUB: Upload date
     * - NUMVIS: Amount of visits
     */
    const SORT_ORDER_CRITERIA = {
        "RELEVA": "CAASAhAB",
        "FECSUB": "CAI%253D",
        "NUMVIS": "CAMSAhAB",
        "PUNTUA": "CAESAhAB",
    };

    /**
     * Changes the sort order criteria of the search, setting the parameter in
     * the URL and redirecting automatically.
     *
     * @param value Sort criteria selected
     */
    function changeSortOrder(value) {
        var params = new URLSearchParams(window.location.href);
        params.set("sp", SORT_ORDER_CRITERIA[value]);
        window.location.href = decodeURIComponent(params);
    }

    /** Logs in console the video list of the current playlist */
    function printVideos() {
        let msg = [];

        document
            .querySelectorAll("ytd-playlist-video-renderer")
            .forEach(video => {
                let videoTitle = video.querySelector("#video-title").title;
                let videoLink = video.querySelector("#video-title").href;
                let channelName = video.querySelector("a.yt-simple-endpoint.style-scope.yt-formatted-string").text;

                msg.push(`${channelName};${videoLink.match(/v=([^&]*)&/)[1]};${videoTitle}`);
            });

        if (msg.length > 0) {
            console.log(msg.join("\n"));
        } else {
            console.log("No videos found");
        }
    }

    /**
     * Gets a summary of the current video for storing
     *
     * Result format: `<channel name>,<video id>,<video title>`
     */
    function getVideoSummary() {
        const channelName = document.querySelector(".ytd-channel-name")
            .children[0].textContent.trim();
        const videoId = window.location.href
            .match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
            [1];
        const videoTitle = document
            .querySelector("h1.ytd-video-primary-info-renderer")
            .textContent;

        alert(`${channelName},${videoId},${videoTitle}`);
    }

    document.addEventListener("keyup", e => {
        if (e.target.tagName === "INPUT") return;

        var ctrl = e.ctrlKey;
        var alt = e.altKey;
        var shift = e.shiftKey;

        // Hotkeys for video search results pages
        if (window.location.href.includes("results")) {
            // CTRL + ALT
            if (ctrl && alt && !shift) {
                switch (e.code) {
                    case "Numpad1":
                    case "Digit1":
                        changeSortOrder("FECSUB"); break; // Upload date
                    case "Numpad2":
                    case "Digit2":
                        changeSortOrder("NUMVIS"); break; // Amount of visits
                }
            }
        }

        // Hotkeys for playlist pages
        if (window.location.href.includes("playlist")) {
            // CTRL + ALT
            if (ctrl && alt && !shift) {
                switch (e.code) {
                    case "Numpad1":
                    case "Digit1":
                        printVideos(); break;
                }
            }
        }

        // Hotkeys for video pages
        if (window.location.href.includes("watch")) {
            // CTRL + ALT
            if (ctrl && alt && !shift) {
                switch (e.code) {
                    case "Numpad1":
                    case "Digit1":
                        getVideoSummary(); break;
                }
            }
        }
    });
})();
