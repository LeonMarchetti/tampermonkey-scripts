// ==UserScript==
// @name         Markdown Viewer and Editor
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over the world!
// @author       LeonAM
// @match        https://thumbsdb.herokuapp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=herokuapp.com
// @require      file://<PATH>/markdown-viewer.js
// @grant        GM_info
// ==/UserScript==

(function () {
    'use strict';

    console.log(`Running UserScript "${GM_info.script.name}"`);

    document.getElementById("adbottom1").style.display = "none";
    document.getElementById("leftmenu").style.display = "none";
})();
