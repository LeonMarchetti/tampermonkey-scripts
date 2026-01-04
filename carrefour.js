// ==UserScript==
// @name         Carrefour
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Utilities for Carrefour Argentina
// @author       LeonAM
// @match        https://www.carrefour.com.ar/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=carrefour.com.ar
// @grant        none
// @noframes
// ==/UserScript==

(function () {
    'use strict';

    console.info(`Running UserScript "Carrefour"`);

    /** Percentage discount to apply */
    const DISCOUNT = "15";
    const PRICE_SELECTOR = ".valtech-carrefourar-product-price-0-x-currencyContainer";
    const CONTAINER_SELECTOR = ".vtex-flex-layout-0-x-flexColChild--product-view-prices-container:nth-child(1)";
    const CLASS_DISCOUNT_ELEMENT = "valtech-carrefourar-product-price-0-x-sellingPrice--hasListPrice";
    const CLASS_DISCOUNT_LABEL = "valtech-carrefourar-rates-0-x-summaryScore";

    /**
     * Adds the price after applying all discounts below the original price
     */
    function addDiscountPrice() {
        const interval = setInterval(() => {
            const priceContainer = document.querySelector(CONTAINER_SELECTOR);
            if (!priceContainer) {
                console.error("Price container not found");
                return;
            }

            clearInterval(interval);

            const priceElement = priceContainer.querySelector(PRICE_SELECTOR);
            if (!priceElement) {
                console.error("Price element not found");
                return;
            }

            const priceText = priceElement.textContent.trim();
            const match = priceText.match(/[\d,.]+/);
            if (!match) return;

            const priceValue = parseFloat(match[0].replace(/\./g, '').replace(',', '.'));
            if (isNaN(priceValue)) return;

            const discountedPrice = priceValue * (1 - DISCOUNT / 100);
            const discountValue = discountedPrice.toLocaleString('es-AR');
            const discountElement = document.createElement('div');
            discountElement.classList.add(CLASS_DISCOUNT_ELEMENT)
            discountElement.textContent = `$ ${discountValue}`;

            const discountLabel = document.createElement("p");
            discountLabel.classList.add(CLASS_DISCOUNT_LABEL);
            discountLabel.textContent = `MP ${DISCOUNT}% off`;

            priceContainer.appendChild(discountLabel);
            priceContainer.appendChild(discountElement);
            console.debug("discountElement: ", discountElement);
        }, 100);
    }

    addDiscountPrice()
})();