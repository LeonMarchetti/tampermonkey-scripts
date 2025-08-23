// ==UserScript==
// @name         Instagram
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  Utilities for Instagram
// @author       LeonAM
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    console.info(`Running UserScript "${GM_info.script.name}"`);

    /**
     * Builds the account summary in CSV format with:
     *
     * - Account id
     * - Name
     * - Category (with default value)
     * - Notes
     * - Address
     * - Whatsapp number
     * - Website address
     * - Today's date in "DD/MM/YYYY" format
     *
     * Queries DOM elements to obtain the values
     *
     * @returns {string} Account summary in CSV format
     */
    function getAccountSummary() {
        let id = document.querySelector("h2")?.innerText;
        let name = document.querySelector("header :nth-child(4) > div > div > span")?.innerText;
        let notes = document.querySelector("header :nth-child(4) > div > div:nth-child(3)")?.innerText || "";
        let address = document.querySelector("h1")?.innerText.replace(/,.*/, "") || "";
        let whatsapp = "";
        let website = "";
        let date = (new Date()).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

        // Search link element and determine either account's website or whatsapp number
        let link = document.querySelector(".x3nfvp2.x193iq5w")?.innerText || "";
        if (link) {
            if (link.startsWith("wa.me")) {
                // WhatsApp number
                whatsapp = link.replace("wa.me/", "").replace(/^(?:549)?(2323|11)/, "$1 ");
            } else {
                website = link.replace(" y 1 más", "");
            }
        }

        return `${id},${name},,"${notes}","${address}",${whatsapp},"${website}",${date}`;
    }

    function GetSummary() {
        let accountSummary = getAccountSummary();
        alert(accountSummary);
        console.debug(accountSummary);
    }

    /** Returns acccount's id in custom format */
    function GetIDNote() {
        let idNote = "IG: " + document.querySelector("h2")?.innerText;
        alert(idNote);
        console.debug(idNote);
    }

    GM_registerMenuCommand("Get Summary", GetSummary);
    GM_registerMenuCommand("Get ID Note", GetIDNote);
})();