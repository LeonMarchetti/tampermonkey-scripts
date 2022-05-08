// ==UserScript==
// @name         Beta Sankaku complex
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Beta Sankaku Complex
// @author       LeonAM
// @match        *://beta.sankakucomplex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankakucomplex.com
// @require      file://<PATH>/beta-sankaku-complex.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_info
// ==/UserScript==
/* globals $ */

(function () {
    'use strict';

    console.log(`Running UserScript "${GM_info.script.name}"`);

    // Constants
    const RE_URL_TAGS = /\?tags=(.*)/;

    var currentSrc = "";

    /**
     * Interval to detect the current post's image and add a link to show only
     * the image on the browser
     */
    setInterval(() => {
        document
            .querySelectorAll(".swiper-zoom-container img")
            .forEach(img => {
                if (img.parentElement.tagName !== "A") {
                    var a = document.createElement("a")
                    currentSrc = a.href = img.src
                    img.parentElement.appendChild(a)
                    a.appendChild(img)

                } else {
                    if (currentSrc !== img.src) {
                        currentSrc = img.parentElement.href = img.src
                    }
                }
            });
    });

    /**
     * Interval for detecting the presence of an ad dialog and close it
     * automatically
     */
    const interval2 = setInterval(() => {
        let dialogList = document.querySelectorAll("MuiDialog-paper")
        if (dialogList.length > 0) {
            dialogList.forEach(dialog => {
                dialog.querySelectorAll("button")
                    .forEach(button => { button.click() })
            })
            clearInterval(interval2)
            console.log("Diálogo cancelado")
        }
    }, 500);

    /** Chars to replace in the URL to show as the post's window title */
    const REPLACE = {
        "%20": " ",
        "%21": "!",
        "%28": "(",
        "%29": ")",
        "%3A": ":"
    };

    /**
     * Interval for changing the window title of a page for the tags list to
     * identify the search or the post
     */
    setInterval(() => {
        let currURL = document.location.href

        // If on a book page, the title is left unchanged
        if (currURL.includes("/books/")) return

        let titleFirstPart = ""

        if (currURL.includes("post/show")) {
            let tag = document.querySelector("a[class*='MuiChip-root-'] > span")
            titleFirstPart = tag ? tag.textContent : "Post"

        } else {
            titleFirstPart = "Browse"
            let reMatch = RE_URL_TAGS.exec(currURL)
            if (reMatch) {
                titleFirstPart = reMatch[1]
                for (let key in REPLACE) {
                    titleFirstPart = titleFirstPart
                        .replaceAll(key, REPLACE[key])
                }
            }
        }
        document.title = `${titleFirstPart} | Sankaku Complex`
    }, 500)

    /**
     * Gets the tags from the URL's queryparams
     *
     * @return {string[]} Tags list
     */
    function getTags(url) {
        var reMatch = /.*:\/\/beta\.sankakucomplex\.com(?:\/\?tags=(.*))?/
            .exec(url)

        if (!reMatch) return null
        if (!reMatch[1]) return []

        var tags = reMatch[1]
        for (let key in REPLACE) {
            tags = tags.replaceAll(key, REPLACE[key])
        }
        return tags.split(" ")
    }

    /**
     * Tags to filter in a posts search, to be added to the URL with the `-`
     * symbol to the head
     */
    const TAGS_FILTRO = ["3d", "cg_art", "doujinshi"]

    /** Filters the tags in a posts search and redirects */
    function filterTags() {
        var tags = getTags(document.location.href)
        var changes = 0
        for (let tag of TAGS_FILTRO) {
            if (tags.includes(tag)) {
                tags.remove(tag)
            }
            let notTag = `-${tag}`
            if (!tags.includes(notTag)) {
                tags.push(notTag)
                changes++
            }
        }
        if (changes) {
            document.location.href = "https://beta.sankakucomplex.com/?tags=" + tags.join(" ")
        }
    }

    const TAGS_DOUJINSHI = ["doujinshi", "english"]
    function doujinshi() {
        var tags = getTags(document.location.href)
        var changes = 0
        for (let tag of TAGS_DOUJINSHI) {
            if (!tags.includes(tag)) {
                let notTag = `-${tag}`
                if (tags.includes(notTag)) {
                    tags.remove(notTag)
                }
                tags.push(tag)
                changes++
            }
        }
        if (changes) {
            document.location.href = "https://beta.sankakucomplex.com/?tags=" + tags.join(" ")
        }
    }

    GM_registerMenuCommand("Filtrar", filterTags)
    GM_registerMenuCommand("Doujinshi", doujinshi)
})()
