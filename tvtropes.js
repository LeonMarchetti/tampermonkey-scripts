// ==UserScript==
// @name         TvTropes
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Script for TV Tropes
// @author       LeonAM
// @match        https://tvtropes.org/pmwiki/changes.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tvtropes.org
// @grant        GM_registerMenuCommand
// ==/UserScript==
/* globals $ */

/** Hides links on the "New Edits" page of TV Tropes whose title ends with "Actors". */
function hideActorsLinks() {
    var count = 0;
    for (let a of Array.from($(".newgrouplink"))) {
        if (a.innerText.endsWith("Actors")) {
            a.parentElement.parentElement.style.display = "none";
            count++;
        }
    }

    console.log((count > 0) ? `Hidden ${count} links` : "No links hidden");
}

GM_registerMenuCommand("Analysis tropes edits", () => {
    window.location.href = "https://tvtropes.org/pmwiki/changes.php?filter=ymmv";
});

(function() {
    'use strict';

    hideActorsLinks();
})();
