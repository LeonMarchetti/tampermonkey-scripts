// ==UserScript==
// @name         Youtube Likes Playlist
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Utilities for the video likes playlist for Youtube
// @author       LeonAM
// @match        https://www.youtube.com/playlist?list=LL
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

/**
 * Gets a list of videos from a playlist page
 *
 * @returns {{Channel: string, ID: string, Name: string}[]}
 */
function getVideosList() {
    return Array.from(document.querySelectorAll("ytd-playlist-video-renderer.ytd-playlist-video-list-renderer"))
        .map(video => ({
            Channel: video.querySelector(".yt-simple-endpoint.yt-formatted-string").text,
            ID: (new URLSearchParams(
                new URL(
                    video.querySelector("#video-title").href
                ).search
            )).get("v"),
            Name: video.querySelector("#video-title").title,
        }));
}

(function() {
    'use strict';

    const tableStyles = `
        table, th, td {
            border-collapse: collapse;
            font-family: Ubuntu;
            padding: 5px;
            text-align: left;
        }

        table, th, td:nth-child(1) {
            border: 1px solid;
        }

        th, td:nth-child(1) {
            background-color: lightgray;
            font-weight: bold;
        }
    `;

    const title = "YouTube Likes Playlist";
    const header = `<h1>${title}</h1>`;
    const titleElement = `<title>${title}</title>`;

    console.info(`Running Userscript "Youtube Likes Playlist"`);

    /**
     * Gets the videos information: index in playlist and video's name
     * 
     * Shows videos at 100s index and the last one
     * 
     * @returns {{i: number, name: string}[]}
     */
    function getList() {
        const videos = getVideosList();
        if (videos.length === 0) {
            throw new Error("Empty video list");
        }

        return videos
            .map((v, i) => ({ i: i + 1, name: v["Name"] }))
            .filter(o => (o.i % 100 === 0 || o.i === videos.length));
    }

    /**
     * Builds the HTML table for the videos list
     * @param {{i: number, name: string}[]} list Videos list
     */
    function buildTable(list) {
        const rows = list
            .map(video => `<tr><td>${video.i}</td><td>${video.name}</td></tr>`)
            .reduce((out, text) => out + text);

        const table = `<table>
                <thead><tr><th>N°</th><th>Video</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        `;
        return table;
    }

    /**
     * Shows the output in a new tab
     * @param {string} htmlContent 
     */
    function showBlob(htmlContent) {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const w = window.open(url, '_blank');
        if (!w) {
            // optionally revoke URL if not used
            URL.revokeObjectURL(url);
            return;
        }
        // revoke after a short delay so the browser has loaded the blob
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    }

    /** Shows the videos list in a new tab */
    function showList() {
        const list = getList();
        const table = buildTable(list);
        const body = `<body>${header}${table}</body>`;

        const head = `<head><meta charset="utf-8">${titleElement}<style>${tableStyles}</style></head>`;
        const html = `<!doctype html><html>${head}${body}</html>`;
        showBlob(html);
    }

    document.addEventListener("keyup", e => {
        // CTRL + ALT
        if (e.ctrlKey && e.altKey && !e.shiftKey) {
            switch (e.code) {
                case "Numpad1":
                case "Digit1":
                    showList(); break;
            }
        }
    });
})();