// ==UserScript==
// @name         Mercado Libre Cars
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  To use in searches of cars in Mercado Libre
// @author       LeonAM
// @match        https://autos.mercadolibre.com.ar/*
// @match        https://listado.mercadolibre.com.ar/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mercadolibre.com.ar
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    console.info(`Running UserScript "${GM_info.script.name}"`);

    const CLASS_NAME_MATCH = "andes-money-amount";
    const CURRENCY_DOLLAR_SYMBOL = "U$S";
    const CURRENCY_PESO_SYMBOL = "$";
    const DOLLAR_VALUE_URL = "https://mercados.ambito.com//dolar/informal/variacion";
    const MODIFIED_CLASS_NAME = "mlc_modifiedValue";

    GM_addStyle(`
        .${MODIFIED_CLASS_NAME} {
            color: green !important;
        }
    `);

    /**
     * Obtains the rate of exchange between Dollar (U$S) and Argentine Pesos ($) and executes a
     * function when said value is ready
     *
     * @param {(dollarValue: number) => void} callback Function to execute with the dollar value as argument
     */
    function getDollarValue(callback) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                let response = JSON.parse(xmlHttp.responseText);
                console.debug(response);
                let dollarValue = Number(response.venta.replace(",", "."));
                callback(dollarValue);
            }
		};
		xmlHttp.open("GET", DOLLAR_VALUE_URL, true);
		xmlHttp.send(null);
    }

    /**
     * Modifies the content of the span element to convert a monetary value in pesos to dollars
     *
     * @param {HTMLSpanElement} span
     * @param {number} dollarValue
     */
    function swapCurrency(span, dollarValue) {
        let currencySpan = span.childNodes[0];
		if (currencySpan.textContent == CURRENCY_PESO_SYMBOL) {
            let amountSpan = span.childNodes[1];
            let amount = Number(amountSpan.textContent.replaceAll(".", ""));
            let dollarAmount = Math.round(amount / dollarValue);

            currencySpan.textContent = CURRENCY_DOLLAR_SYMBOL;
            amountSpan.textContent = dollarAmount.toLocaleString();

            currencySpan.classList.add(MODIFIED_CLASS_NAME);
            amountSpan.classList.add(MODIFIED_CLASS_NAME);
        }
    }

    /**
     * Applies the `swapCurrency()` function to all span elements which correspond to the monetary
     * value of the products of the search
     *
     * @param {number} dollarValue
     */
    function startSwapCurrency(dollarValue) {
        document.querySelectorAll(`span.${CLASS_NAME_MATCH}`)
            .forEach(span => swapCurrency(span, dollarValue));
    }

    getDollarValue(startSwapCurrency);

    document.addEventListener("keyup", e => {
        if (e.ctrlKey && e.key == "e") {
            getDollarValue(startSwapCurrency);
        }
    });

    GM_registerMenuCommand("Swap currency", () => getDollarValue(startSwapCurrency));
})();