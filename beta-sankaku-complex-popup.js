// ==UserScript==
// @name         Beta Sankaku Complex Popup
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Beta Sankaku Complex Popup
// @author       LeonAM
// @match        *://beta.sankakucomplex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankakucomplex.com
// @require      file://<PATH>/beta-sankaku-complex-popup.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        GM_info
// @grant        GM_registerMenuCommand
// ==/UserScript==
/* globals $ */

(function () {
    'use strict';

    console.log(`Running UserScript "${GM_info.script.name}"`);

    /** Characters to replace in the URL to show as page title */
    const REPLACE = {
        "%20": " ",
        "%21": "!",
        "%28": "(",
        "%29": ")",
        "%3A": ":"
    }

    /** Gets the tags from the current search from the URL */
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
     * Makes a posts search using the tags from the current search and tags
     * input by the user
     */
    function addTag(tag) {
        var tagsCur = getTags(document.location.href)
        var changes = 0
        if (!tagsCur.includes(tag)) {
            let notTag = `-${tag}`
            if (tagsCur.includes(notTag)) {
                tagsCur.remove(notTag)
            }
            tagsCur.push(tag)
            changes++
        }
        if (changes > 0) {
            document.location.href = "https://beta.sankakucomplex.com/?tags=" + tagsCur.join(" ")
        }
    }

    /**
     * CSS styles to make the popup <div> appear in front of any other page
     * element
     */
    const DIV_STYLES = [
        "position:fixed",
        "top:50%",
        "left:50%",
        "transform:translate(-50%,-50%)",
        "padding:1%",
        "background-color:white",
        "border-color:black",
        "z-index:999",
        "border-style:solid"
    ].join(";")

    /** Tags available to be added to the search */
    const OPTIONS = [
        "Ninguno",
        "fav:deripper",
        "english",
        "screen_capture",
        "-rating:s",
        "order:random",
        "-doujinshi",
        "-cg_art"
    ]

    const DOM_OPTIONS = OPTIONS.map(e => `<option>${e}</option>`).join("")
    const SELECT_ELEMENT = `<select id="popupSelect">${DOM_OPTIONS}</select>`
    const POPUP_DIV = `<div id="popupDiv" style=${DIV_STYLES}>${SELECT_ELEMENT}</div>`

    /** Show or hide the popup. Creates it if it doesn't exist. */
    function togglePopup() {
        if ($("#popupDiv").length == 0) {
            document.body.innerHTML += POPUP_DIV
            $("#popupSelect").change(e => {
                if (e.target.value != "Ninguno") {
                    addTag(e.target.value)
                }
            })
        }
        else {
            if ($("#popupDiv").is(":hidden")) {
                $("#popupDiv").show()
            }
            else {
                $("#popupDiv").hide()
            }
        }
    }

    $(document).keyup(e => {
        // SHIFT+F1
        if (e.shiftKey && e.which == 112) togglePopup()
    })

    GM_registerMenuCommand("Tag Popup", togglePopup)
})();