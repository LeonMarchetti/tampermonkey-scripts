// ==UserScript==
// @name         Gitlab
// @namespace    http://tampermonkey.net/
// @version      1.1.0
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
        let issueTitle = document.querySelector(`[data-testid="work-item-title"]`).innerText;
        let issueId;
        let issueLink;

        if (document.querySelector(`aside.gl-drawer`)) {
            // Drawer issue view
            let drawerLink = document.querySelector(`a[data-testid="work-item-drawer-ref-link"]`);
            issueId = drawerLink.innerText.match("#\\d+")[0];
            issueLink = drawerLink.href;
        } else {
            // Single issue view
            issueId = breadcrumbs[3].textContent;
            issueLink = window.location.href;
        }

        let output = `**Issue**: [${issueTitle} (${project}/${repository} ${issueId})](${issueLink})`;
        console.debug(output);
        alert(output);
    }

    GM_registerMenuCommand("Get Issue Title", GetIssueTitle);
})();