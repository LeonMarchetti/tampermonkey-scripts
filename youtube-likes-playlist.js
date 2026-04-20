// ==UserScript==
// @name         Youtube Likes Playlist
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Utilities for the video likes playlist for Youtube
// @author       LeonAM
// @match        https://www.youtube.com/playlist?list=LL
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
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

    GM_addStyle(`
        /* The Modal (background) */
        #ypl_modal {
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 2202; /* Sit on top */
            left: 50%;
            top: 50%;
            overflow: auto; /* Enable scroll if needed */
            transform: translate(-50%, -50%);
        }

        /* Modal Content/Box */
        #ypl_modal_content {
            background-color: #fefefe;
            margin: 15% auto; /* 15% from the top and centered */
            padding: 1em;
        }

        /* The Close Button */
        #ypl_modal_close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        #ypl_modal_close:hover, #ypl_modal_close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }

        #ypl_modal table, 
        #ypl_modal th, 
        #ypl_modal td {
            border-collapse: collapse;
            font-family: Ubuntu;
            padding: 5px;
            text-align: left;
            font-size: 18px;
        }

        #ypl_modal table,
        #ypl_modal th,
        #ypl_modal td:nth-child(1) {
            border: 1px solid;
        }

        #ypl_modal th,
        #ypl_modal td:nth-child(1) {
            background-color: lightgray;
            font-weight: bold;
        }
    `);

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

    /**
     * List of videos to insert in the table
     * @type {{i: number, name: string}[]}
     */
    var videos = [];
    /**
     * Table content for adding rows 
     * @type {HTMLTableSectionElement}
     */
    var tbody;

    console.info(`Running Userscript "Youtube Likes Playlist"`);

    /**
     * Gets the videos information: index in playlist and video's name
     * 
     * Shows videos at 100s index and the last one
     * 
     * @returns {{i: number, name: string}[]}
     */
    function getList() {
        videos = getVideosList();
        if (videos.length === 0) {
            throw new Error("Empty video list");
        }

        videos = videos.map((v, i) => ({ i: i + 1, name: v["Name"] }));
        return videos
            .filter(o => (o.i % 100 === 0 || o.i === videos.length));
    }

    function buildRow(videoInfo) {
        const row = document.createElement("tr");
        const numberCell = document.createElement("td");
        const videoCell = document.createElement("td");
        const buttonCell = document.createElement("td");

        numberCell.textContent = videoInfo.i;
        videoCell.textContent = videoInfo.name;

        const button = document.createElement("button");
        button.textContent = "Action";
        button.dataset.index = videoInfo.i;
        button.addEventListener("click", e => {
            const currRow = e.target.parentNode.parentNode;
            const prevRow = currRow.previousSibling;
            const prevIndex = (prevRow === null) ? 0
                : Number(prevRow.children[2].children[0].dataset.index);
            const newIndex = Math.round((e.target.dataset.index - prevIndex)/2) + prevIndex - 1;
            tbody.insertBefore(buildRow(videos[newIndex]), currRow);
        });

        buttonCell.appendChild(button);

        row.appendChild(numberCell);
        row.appendChild(videoCell);
        row.appendChild(buttonCell);

        return row;
    }

    /**
     * Builds the HTML table for the videos list
     * @param {{i: number, name: string}[]} list Videos list
     * @returns {HTMLTableElement} Table HTML element
     */
    function buildTable(list) {
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        tbody = document.createElement("tbody");

        const headerRow = document.createElement("tr");
        const numberCell = document.createElement("th");
        const videoCell = document.createElement("th");
        const buttonCell = document.createElement("th");

        numberCell.textContent = "N°";
        videoCell.textContent = "Video";

        headerRow.appendChild(numberCell);
        headerRow.appendChild(videoCell);
        headerRow.appendChild(buttonCell);

        thead.appendChild(headerRow);

        list.forEach(video => tbody.appendChild(buildRow(video)));

        table.appendChild(thead);
        table.appendChild(tbody);

        return table;
    }

    /** Shows the videos list in a dialog */
    function showList() {
        const list = getList();
        const table = buildTable(list);

        const modalContent = document.getElementById("ypl_modal_content");
        const oldTable = modalContent.querySelector("table");
        if (oldTable) {
            modalContent.replaceChild(table, oldTable);
        } else {
            modalContent.append(table);
        }
        
        document.getElementById("ypl_modal").style.display = "block";
    }


    /**
     * Builds a modal dialog to show the table
     * @returns {HTMLDivElement} Modal HTML element
     */
    function buildModal() {
        const close = document.createElement("span");
        close.id = "ypl_modal_close";
        close.textContent = "X";

        const header = document.createElement("h1");
        header.innerText = title;

        const content = document.createElement("div");
        content.id = "ypl_modal_content";
        content.append(close, header);

        const modal = document.createElement("div");
        modal.id = "ypl_modal";
        modal.append(content);

        return modal;
    }

    // Add modal to DOM
    document.querySelector("ytd-app").append(buildModal());

    document.getElementById("ypl_modal_close").onclick = function () {
        document.getElementById("ypl_modal").style.display = "none";
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