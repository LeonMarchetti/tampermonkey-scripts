// ==UserScript==
// @name         Credicoop
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Hides the account code
// @author       LeonAM
// @match        https://bancainternet.bancocredicoop.coop/bcclbi/imprimirComprobante*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bancocredicoop.coop
// @require      file://<PATH>/credicoop.js
// @grant        GM_info
// ==/UserScript==

(function () {
    'use strict';

    console.log(`Running UserScript "${GM_info.script.name}"`);

    document
        .querySelectorAll(".formLabel")
        .forEach(l => {
            if (l.textContent.includes("CC$")) {
                console.log(l.textContent);
                l.textContent = "";
            }
        });
})();
