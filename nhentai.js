// ==UserScript==
// @name         NHentai
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Apply styles for hiding elements
// @author       LeonAM
// @match        https://nhentai.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nhentai.net
// @require      file://<PATH>/nhentai.js
// @grant        GM_addStyle
// @grant        GM_info
// ==/UserScript==

(function () {
    'use strict';

    console.log(`Running UserScript "${GM_info.script.name}"`);

    GM_addStyle('.blacklisted { display: none !important }');
})();
