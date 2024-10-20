// ==UserScript==
// @name         Gitlab
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Utilities for Gitlab
// @author       LeonAM
// @match        https://gitlab.com/*
// @match        https://gitlab.unlu.edu.ar/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Gets the current issue's title  and number with link, formatted for Markdown
     */
    function GetIssueTitle() {
        let breadcrumbs = document.querySelector(".breadcrumb").children;
        let project = breadcrumbs[0].textContent;
        let repository = breadcrumbs[1].textContent;
        let issueId = breadcrumbs[3].textContent;
        let title = document.querySelector(".title").textContent;
        let output = `**Issue**: [${title} (${project}/${repository} ${issueId})](${window.location.href})`;
        console.debug(output);
        alert(output);
    }

    GM_registerMenuCommand("Get Issue Title", GetIssueTitle);
})();