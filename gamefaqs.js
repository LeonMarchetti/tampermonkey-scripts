// ==UserScript==
// @name         GameFAQs Styles
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Add styles to GameFAQs guides
// @author       LeonAM
// @match        https://gamefaqs.gamespot.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamespot.com
// @require      file://<PATH>/gamefaqs.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_info
// ==/UserScript==
/* globals $ */

(function () {
    'use strict';

    console.log(`Running UserScript "${GM_info.script.name}"`);

    GM_addStyle('.joined-span { font: 20px "Georgia" !important; white-space: pre-wrap; }');

    const preList = $("#faqwrap pre");
    const faqtext = $("#faqtext");

    preList.each(i => {
        const pre = preList[i];
        const split = pre.innerText.split(/-{2,}/gm); // Split text at slash separators, with 2 or more slashs
        const span = $("<span></span>").html(split.join("<hr>"));
        span.addClass("joined-span");

        $(pre).remove();
        faqtext.append(span);
        faqtext.append($("<br>"));
    });
})();
