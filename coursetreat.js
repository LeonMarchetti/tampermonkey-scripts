// ==UserScript==
// @name         Coursetreat - Udemy Courses
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Open Udemy course link with coupon without ads
// @author       LeonAM
// @match        https://coursetreat.com/udemycourse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coursetreat.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    Array.from(document.getElementsByClassName("btn-couponbtn")).forEach(btn => {
        btn.addEventListener("contextmenu", e => {
            e.preventDefault();
            window.location.href = e.target.href.match(/murl=(.*)/)[1];
        });
    })
})();