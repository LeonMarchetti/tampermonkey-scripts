// ==UserScript==
// @name         Carrefour
// @namespace    http://tampermonkey.net/
// @version      1.1.0
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

    var cache = {
        priceText: null,
        discountElement: null
    };

    /**
     * Adds the price after applying all discounts below the original price
     */
    function addDiscountPrice() {
        setInterval(() => {
            const priceContainer = document.querySelector(CONTAINER_SELECTOR);
            if (!priceContainer) {
                return;
            }

            const priceElement = priceContainer.querySelector(PRICE_SELECTOR);
            if (!priceElement) {
                console.error("Price element not found");
                return;
            }

            const priceText = priceElement.textContent.trim();
            if (priceText === cache.priceText) {
                return;
            }
            cache.priceText = priceText;
            const match = priceText.match(/[\d,.]+/);
            if (!match) return;

            const priceValue = parseFloat(match[0].replace(/\./g, '').replace(',', '.'));
            if (isNaN(priceValue)) return;

            const discountedPrice = priceValue * (1 - DISCOUNT / 100);
            const discountValue = discountedPrice.toLocaleString('es-AR');

            var discountElement;
            if (cache.discountElement && cache.discountElement.isConnected) {
                discountElement = cache.discountElement;
            } else {
                discountElement = document.createElement('div');
                discountElement.classList.add(CLASS_DISCOUNT_ELEMENT)

                const discountLabel = document.createElement("p");
                discountLabel.classList.add(CLASS_DISCOUNT_LABEL);
                discountLabel.textContent = `MP ${DISCOUNT}% off`;

                priceContainer.appendChild(discountLabel);
                priceContainer.appendChild(discountElement);

                cache.discountElement = discountElement;
            }

            discountElement.textContent = `$ ${discountValue}`;

            // Debug Output
            console.debug("discountElement: ", discountElement);
            console.debug(`Price: ${priceValue} => ${discountedPrice}`);
        }, 100);
    }

    addDiscountPrice()
})();