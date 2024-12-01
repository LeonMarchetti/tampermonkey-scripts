// @name        pageChangeInterval.js
// @version     1.0.0
// @description Interval function that detects page change and runs code accordingly
// @author      LeonAM

/**
 * Detects URL change and runs code accordingly
 *
 * @param {(url: URLSearchParams) => void} callback Function that handles the URL change
 * @param {number} timeout Interval timeout
 */
function setPageChangeInterval(callback, timeout = 500) {
    var currentPage = "";
    setInterval(() => {
        if (currentPage != location.href) {
            console.debug(`[pageChangeInterval] old: "${currentPage}"`);
            console.debug(`[pageChangeInterval] new: "${location.href}"`);

            currentPage = location.href;
            callback(new URL(currentPage));
        }
    }, timeout);
}