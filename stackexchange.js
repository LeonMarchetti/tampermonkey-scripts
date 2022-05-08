// ==UserScript==
// @name         StackExchange
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Hides the cookies confirmation dialog
// @author       LeonAM
// @match        https://stackoverflow.com/*
// @match        https://*.stackexchange.com/*
// @match        https://askubuntu.com/*
// @match        https://superuser.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackexchange.com
// @require      file://<PATH>/stackexchange.js
// @grant        GM_info
// ==/UserScript==
/* globals $ */

(function () {
    'use strict';

    console.log(`Running UserScript "${GM_info.script.name}"`);

    $(".js-consent-banner").hide();
})();

/*
[06/11/2021] Creación del script.
* Oculto el cartel para aceptar cookies (clase CSS: "js-consent-banner").
[19/11/2021] Agregué "askubuntu.com" a las URLs.
*/