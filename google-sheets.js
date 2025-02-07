// ==UserScript==
// @name         Google Sheets
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Userscript for Google Sheets
// @author       LeonAM
// @match        https://docs.google.com/spreadsheets/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_info
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    console.info(`Running UserScript "${GM_info.script.name}"`);

    GM_addStyle(`
        /* Main bar background */
        #docs-chrome,
        .goog-menuitem
        {
            background: green !important;
        }

        /* Menu items */
        .goog-menuitem-label
        {
            color: white;
        }

        /* Menu item separator */
        .goog-menuseparator
        {
            background: green;
            margin-top: 0px !important;
            margin-bottom: 0px !important;
            padding: 6px;
        }

        /* Menu */
        .goog-menu
        {
            background: none;
        }


        /* Share button and user logo container */
        .docs-titlebar-buttons
        {
            background: none;
        }

        /* Menu text */
        #docs-title-input-label-inner,
        .menu-button
        {
            color: white !important;
        }

        /* Menu items on hover */
        .goog-control-hover,
        .goog-control-open
        {
            background: darkgreen !important;
        }
    `);
})();