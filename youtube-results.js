// ==UserScript==
// @name         YouTube Results
// @namespace    http://tampermonkey.net/
// @version      1.8.0
// @description  Utilities to use in YouTube
// @author       LeonAM
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_info
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
    'use strict';

    console.info(`Running UserScript "${GM_info.script.name}"`);

    /*
     * Since now Youtube won't show recommendations without history enabled, the script will
     * automatically change to the Subscritions' feed
     */
    if (window.location.href == "https://www.youtube.com/") {
        window.location.href = "https://www.youtube.com/feed/subscriptions";
        return;
    }

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
     * Downloads text into a file
     *
     * @param {string} content Text to download
     * @param {string} filename Filename
     */
    function download(content, filename) {
        let a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob(["\ufeff", content]));
        a.download = filename;
        a.click();
    }

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

    /**
     * Changes the sort order criteria of the search to their upload dates,
     * setting the parameter in the URL and redirecting automatically.
     */
    function changeSortOrder_fecsub() {
        changeSortOrder("FECSUB");
    }

    /**
     * Changes the sort order criteria of the search to their views numbers,
     * setting the parameter in the URL and redirecting automatically.
     */
    function changeSortOrder_numvis() {
        changeSortOrder("NUMVIS");
    }

    /**
     * Gets a list of videos from a playlist page
     *
     * @returns {{Canal: string, ID: string, Nombre: string}[]}
     */
    function getVideosList() {
        return Array.from(document.querySelectorAll("ytd-playlist-video-renderer.ytd-playlist-video-list-renderer"))
            .map(video => ({
                Canal: video.querySelector(".yt-simple-endpoint.yt-formatted-string").text,
                ID: (new URLSearchParams(
                    new URL(
                        video.querySelector("#video-title").href
                    ).search
                )).get("v"),
                Nombre: video.querySelector("#video-title").title,
            }));
    }

    /**
     * Compiles a list of the videos of the current playlist into a CSV dataset
     * and downloads it as a file
     *
     * Video row format: `<Channel name>;<Video ID>;<Video title>`. Uses
     * semicolons `;` in the case video titles have commas `,`.
     *
     * @returns {string} Video list in CSV format
     */
    function downloadPlaylistVideoList() {
        const videoList = getVideosList();
        if (videoList.length <= 0) {
            alert("No videos found");
            throw "No videos found";
        }

        console.log(`${videoList.length} videos found`);

        let csvOutput = "Canal;ID;Nombre\n";
        videoList.forEach(object => {
            csvOutput += `${object.Canal};${object.ID};${object.Nombre}\n`;
        });

        download(csvOutput, "playlists.csv");
        return csvOutput;
    }

    /**
     * Gets a summary of the current video for storing
     *
     * Result format: `<channel name>,<video id>,<video title>`
     */
    function getVideoSummary() {
        const channelName = document
            .querySelector("#upload-info.ytd-video-owner-renderer .yt-formatted-string")
            .textContent;
        const videoId = window.location.href
            .match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
            [1];
        const videoTitle = document
            .querySelector("h1.ytd-video-primary-info-renderer")
            .textContent;

        const result = `${channelName},${videoId},${videoTitle}`;
        console.log(result);
        alert(result);
    }

    /**
     * If currently on a Shorts video, it changes the page to its normal version.
     *
     * Ej.: https://www.youtube.com/shorts/{ID} to https://www.youtube.com/watch?v={ID}
     */
    function changeToVideo() {
        if (! window.location.href.match("/shorts/")) {
            console.error("Not a Shorts page");
            alert("Not a Shorts page");
            return;
        }

        var videoId = window.location.href.match("[^/]*$");
        window.location.href = `https://www.youtube.com/watch?v=${videoId}`;
    }

    /**
     * Adds current video under cursor to queue
     */
    function AddToQueue() {
        let hoverVideo = document.querySelector("ytd-rich-item-renderer:hover")
        if (hoverVideo) {
            hoverVideo.querySelector("#button").click();

            setTimeout(() => {
                document.querySelector("ytd-menu-service-item-renderer").click();
            }, 100);
        }
    }

    // Tampermonkey popup menu commands
    GM_registerMenuCommand("Change sort order (upload date)", changeSortOrder_fecsub);
    GM_registerMenuCommand("Change sort order (views number)", changeSortOrder_numvis);
    GM_registerMenuCommand("Get video list", downloadPlaylistVideoList);
    GM_registerMenuCommand("Video summary", getVideoSummary);
    GM_registerMenuCommand("Change to video", changeToVideo);

    document.addEventListener("keyup", e => {
        if (e.target.tagName === "INPUT") return;

        let url = new URL(window.location.href);

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
                        changeSortOrder_fecsub(); break; // Upload date
                    case "Numpad2":
                    case "Digit2":
                        changeSortOrder_numvis(); break; // Amount of visits
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
                        downloadPlaylistVideoList(); break;
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

        // Hotkeys for subscription feed
        if (url.pathname === "/feed/subscriptions") {
            if (!ctrl && !alt && !shift) {
                switch (e.code) {
                    case "KeyQ": AddToQueue(); break;
                }
            }
        }
    });
})();
