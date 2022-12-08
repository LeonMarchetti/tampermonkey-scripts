// ==UserScript==
// @name         Videos
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  Modify playback speed of videos + other functionalities
// @author       LeonAM
// @match        *://*/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://raw.githubusercontent.com/kamranahmedse/jquery-toast-plugin/master/dist/jquery.toast.min.js
// @require      file://<PATH>/videos.js
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_info
// ==/UserScript==
/* globals $ */

(function () {
    'use strict';

    console.log(`Running UserScript "${GM_info.script.name}"`);

    // Constants
    /** Checks if current browser is Mozilla Firefox */
    const isFirefox = window.navigator.userAgent.includes("Firefox");

    /** Combobox that controls the video's playback rate */
    const comboSpeed = `
        <select id="comboVelocidad">
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="2">2x</option>
            <option value="3">3x</option>
            <option value="4">4x</option>
        </select>`;
    /** Checkbox that controls the video's loop state */
    const checkLoop = `<input id="checkBucle" type="checkbox" />`;
    /** Button for capturing a screenshot of the video */
    const btnScreenshot = `<i id="btnCaptura" class="fa fa-camera"/>`;
    /** Toast content with controls */
    const toastContent = `
        <div id="toastContent" style="display: flex; align-items: center;">
            <i class="fa fa-tachometer"/>${comboSpeed}<i class="fa fa-repeat"/>${checkLoop}${btnScreenshot}
        </div>`;

    // Globals
    var toast = null;

    /** File name of screenshot for download */
    var screenshotName = "captura";

    /** Current playback speed of video */
    var currentPlaybackRate = 1;

    /** Gets the video/s of the current page to work on */
    function getVideo() {
        const videos = getVideos();

        if (videos.length == 0) return null;

        for (let video of videos) {
            if (video.style.length > 0) {
                return video;
            }
        }
        return videos[0];
    }

    /** Gets an array of all `<video>` elements in the page */
    function getVideos() {
        return Array.from(document.getElementsByTagName("video"));
    }

    /** Returns the loop state of all `<video>` elements */
    function getLoop() {
        return getVideo().loop;
    }

    /** Toggles the loop state of all `<video>` elements */
    function setLoop() {
        const videos = getVideos();
        const newLoopState = !videos[0].loop;
        for (let video of videos) {
            video.loop = newLoopState;
        }
    }

    /**
     * Sets the playback rate of all `<video>` elements
     *
     * @param {number} newRate
     */
    function setPlaybackRate(newRate) {
        for (let video of getVideos()) {
            video.playbackRate = newRate;
        }
    }

    /**
     * Injects a CSS style sheet to the page
     *
     * @param {string} url URL of the CSS file
     */
    function injectStylesheet(url) {
        document.head.innerHTML += `<link rel="stylesheet" href="${url}" type="text/css" />`;
    }

    // Inject toast styles:
    injectStylesheet("https://cdn.rawgit.com/kamranahmedse/jquery-toast-plugin/bd761d335919369ed5a27d1899e306df81de44b8/dist/jquery.toast.min.css");
    // Inject Font Awesome icons:
    injectStylesheet("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");

    /**
     * Checks if an element is visible in the viewport
     *
     * Source: https://www.javascripttutorial.net/dom/css/check-if-an-element-is-visible-in-the-viewport/
     *
     * @param {Element} element DOM element
     */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Shows the toast. Updates the toast if created already.
     *
     * @param {number} playbackRate Video playback speed
     * @param {boolean} isLooping If the video is looping
     */
    function showToast(playbackRate, isLooping) {
        if (!toast) {
            toast = $.toast({
                text: toastContent,
                showHideTransition: 'slide',
                allowToastClose: true,
                hideAfter: false,
                stack: false,
                position: 'bottom-left',
                bgColor: '#444444',
                textColor: '#eeeeee',
            });

            // Add styles for toast elements
            GM_addStyle(`
                .jq-toast-single {
                    font-size: medium;
                }
                #btnCaptura {
                    cursor: pointer;
                }
                #toastContent > i {
                    margin-left: 5px;
                    margin-right: 1px;
                }
                #comboVelocidad {
                    color: #444444;
                }
            `.trim());

            document.getElementById("comboVelocidad").addEventListener("change", comboSpeedChange);
            document.getElementById("checkBucle").addEventListener("change", toggleLoop);
            document.getElementById("btnCaptura").addEventListener("change", takeScreenshot);
        }

        document.getElementById("comboVelocidad").value = playbackRate;
        document.getElementById("checkBucle").checked = isLooping;
    }

    /** Speed combobox handler */
    function comboSpeedChange(e) {
        changeVideoPlaybackSpeed(e.target.value);
    }

    /**
     * Gets the video's current time, in "mmss" format.
     *
     * The semicolon ":" appears as a dash "-" in `GM_download`.
     */
    function getYoutubeTimestamp() {
        const time = getVideo().currentTime;
        const mins = String(Math.floor(time / 60)).padStart(2, "0");
        const secs = String(Math.floor(time - mins * 60)).padStart(2, "0");

        return mins + secs;
    }

    /** Captures the current frame and downloads it as a image */
    function takeScreenshot() {
        const video = getVideo();
        const width = video.videoWidth;
        const height = video.videoHeight;
        /** Canvas element to store the snapshot */
        const canvas = document.createElement("canvas");

        // Wait until the video's metadata load to get the video's size
        if (width && height) {
            canvas.width = width;
            canvas.height = height;

            canvas
                .getContext("2d")
                .drawImage(video, 0, 0, canvas.width, canvas.height);

            GM_download({
                url: canvas.toDataURL("image/png"),
                name: `${screenshotName}-${getYoutubeTimestamp()}.png`,
            });
        } else {
            let msg = "Videos: tomarCaptura: El ancho y la altura del video todavía no están cargados";
            alert(msg);
            throw msg;
        }
    }

    /** Changes the default name of the filenames of the screenshots */
    function changeScreenshotName() {
        screenshotName = prompt("Insert new filename for screenshots");
    }

    /**
     * Controls the appearance of the toast and modifies the video playbackRate
     * if it is not equal from the script's playbackRate variable
     */
    function controlToast() {
        const video = getVideo();
        if (video != null && isInViewport(video)) {
            setPlaybackRate(currentPlaybackRate);
            showToast(currentPlaybackRate, getLoop());
        } else {
            $.toast().reset("all");
            toast = null;
        }
    }

    setInterval(controlToast, 500);

    /**
     * Forward or backward the video by `delta_t` seconds
     *
     * @param {number} delta_t
     */
    function forwardVideo(delta_t) {
        const video = getVideo();

        const action = (delta_t > 0) ? `Forward ${delta_t} seconds`
            : `Backward ${delta_t * -1} seconds`;

        video.currentTime += delta_t;
        console.log(`${action} - currentTime = ${video.currentTime}`);
    }

    /**
     * Changes the playback speed or `playbackRate` of the video. Updates the
     * combobox with the new value.
     *
     * @param {number} newRate
     */
    function changeVideoPlaybackSpeed(newRate) {
        currentPlaybackRate = newRate;
        setPlaybackRate(currentPlaybackRate);
    }

    /** Toggles the loop state of the video */
    function toggleLoop() {
        setLoop();
    }

    document.addEventListener("keyup", e => {
        if (getVideo() && e.target.tagName !== "INPUT") {
            const ctrl = e.ctrlKey;
            const alt = e.altKey;
            const shift = e.shiftKey;

            if (!ctrl && !alt && !shift) {
                switch (e.which) {
                    case 71: forwardVideo(-0.05); break;
                    case 72: forwardVideo(0.05); break;
                    // case 80: test(); break;
                }
            }
            // CTRL + SHIFT
            // Chrome no permite sobreescribir los atajos Ctrl+n
            const videoPlaybackCondition = isFirefox ? (ctrl & !alt & !shift) : (ctrl && !alt && shift);
            if (videoPlaybackCondition) {
                switch (e.which) {
                    case 49: changeVideoPlaybackSpeed(1); break;
                    case 50: changeVideoPlaybackSpeed(2); break;
                    case 51: changeVideoPlaybackSpeed(3); break;
                    case 52: changeVideoPlaybackSpeed(4); break;
                    case 53: toggleLoop(); break;
                }
            }

            // ALT
            if (!ctrl && alt && !shift) {
                switch (e.which) {
                    case 67: takeScreenshot(); break; // Alt+C
                }
            }
            // ALT+SHIFT
            if (!ctrl && alt && shift) {
                switch (e.which) {
                    case 67: changeScreenshotName(); break; // Alt+Shift+C
                }
            }
        }
    });
})();
