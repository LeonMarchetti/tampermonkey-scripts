// ==UserScript==
// @name         Manganato
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Manganato
// @author       LeonAM
// @match        https://readmanganato.com/manga-*/chapter-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=readmanganato.com
// @require      file://<PATH>/manganato.js
// @grant        GM_info
// ==/UserScript==

(function () {
    'use strict';

    console.log(`Running UserScript "${GM_info.script.name}"`);

    /* Agrego un enlace para cada página del capítulo del manga para abrir la
     * imagen en una pestaña nueva. */
    document
        .querySelectorAll("div.container-chapter-reader img")
        .forEach(img => {
            let a = document.createElement("a")
            a.href = img.src
            a.target = "_blank"
            img.parentElement.appendChild(a)
            a.appendChild(img)
        })
})();
