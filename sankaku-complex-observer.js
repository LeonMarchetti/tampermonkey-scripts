// ==UserScript==
// @name         Chan Sankaku Complex Observer
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  Runs code as new elements appear on the page
// @author       LeonAM
// @match        https://chan.sankakucomplex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankakucomplex.com
// @require      file://<PATH>/lib/mutationHandler.js
// @require      file://<PATH>/sankaku-complex-observer.js
// @grant        GM_addStyle
// @grant        GM_info
// ==/UserScript==

(function () {
    'use strict';

    console.log(`Running UserScript "${GM_info.script.name}"`);

    const url = document.location.href;
    const esPost = url.includes("post/show");
    const esPool = url.includes("pool/show");
    const esBusq = !esPost && !esPool;

    /**
     * MutationHandler implementation adds one or more icons over the posts'
     * preview to indicate if the post has a certain tag
     */
    class IconAdder extends MutationHandler {
        constructor(targetClassList) {
            super(targetClassList);

            /**
             * Object array that represent the icons of each tag.
             *
             * To determine the icon uses the attribute `"icon"` if it use one
             * of Fonts Awesome, or `"svg"` if it uses a SVG image defined in
             * `this.svgList`.
             *
             * - `tag`: Tag name
             * - `icon`: Class name `.fa-<icon>` of a Fonts Awesome icon
             * - `svg`: If it uses a SVG image
             * - `color`: Background color
             * - `except`: Tags list to not use this icon
             */
            this.iconList = [
                { tag: "animated", icon: "fire", color: "DodgerBlue", except: ["animated_gif", "video "] },
                { tag: "animated_gif", icon: "film", color: "DodgerBlue" },
                { tag: "cg_art", icon: "bolt", color: "red" },
                { tag: "english", svg: true, color: "DodgerBlue" },
                { tag: "large_filesize", icon: "file", color: "orange", except: ["extremely_large_filesize"] },
                { tag: "extremely_large_filesize", icon: "file", color: "red" },
                { tag: "screen_capture", icon: "desktop", color: "DodgerBlue" },
                { tag: "spanish_language", svg: true, color: "DodgerBlue" },
                { tag: "third-party_edit", icon: "edit", color: "red" },
                { tag: "video ", icon: "play", color: "DodgerBlue" },
            ];

            this.svgList = {
                "spanish_language": `<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 0h512v512H0z" fill="#ffffff" fill-opacity="0"></path><g class="" style="" transform="translate(0,0)"><path d="M105.596 82.69c-35.235-.159-63.219 3.749-79.754 13.432l22.717 61.192 72.273 16c-30.57 62.613-31.05 127.647-40.273 192l64 64c42.477-17.102 81.95-22.872 128-23.945 10.226-18.087 18.296-38.667 46.611-44.924-1.617-30.208 15.277-36.212 32.686-52.81-4.287-31.292-.694-49.583 20.918-88.274l84.212-58.535-9.13-25.68c-114.8-25.068-252.215-52.047-342.26-52.455zm369.408 156.983c-9.503-.388-11.76 5.157-10.271 11.533 6.318 5.616 13.497 7.355 21.136 7.024 1.07-6.96-.788-13.039-6.338-18.012-1.663-.312-3.17-.49-4.527-.545zm-33.486 11.07c-9.603.076-18.698 8.776-27.637 20.13 2.107 1.053 28.094 18.962 28.094 18.962l15.1-31.254c-5.36-5.55-10.528-7.877-15.557-7.837zm-47.625 38.303c-8.017.003-15.008 1.902-15.83 15.188l10.183 7.373 9.131-22.475a82.611 82.611 0 0 0-3.484-.086z" fill="#fff" fill-opacity="1"></path></g></svg>`,
                "english": `<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 0h512v512H0z" fill="#ffffff" fill-opacity="0"></path><g class="" style="" transform="translate(0,0)"><path d="M21.584 18L171.02 167.436v3.584h-44.69L18 61.836v25.557l82.975 83.627H18v32h185.02V18h-32v85.436L85.584 18zm286.057 0v185.02H494v-32h-86.775L494 84.244v-64L343.225 171.02h-3.584v-44.69L448.825 18h-25.556l-83.627 82.975V18zM18 309.293v32h85.436L18 426.73v64l149.436-149.437h3.584v44.69L62.152 494h25.555l83.313-82.662V494h32V309.293zm289.64 0V494h32v-85.123L424.765 494h64L339.64 344.877v-3.584h44.69L494 451.826V426.27l-84.314-84.977H494v-32z" fill="#fff" fill-opacity="1"></path></g></svg>`,
            };

            // Button icons styles
            GM_addStyle(".icon-btn-div { position: absolute; }");
            GM_addStyle(".icon-btn { border: none; font-size: 16px; padding: 5px; color: white; vertical-align: bottom; }");
            GM_addStyle(".svg-icon { height: 16px; }");
        }

        /**
         * Parses the post's tag list and adds a icon for each tag in the icons
         * list.
         */
        work(span) {
            let buttons = this.iconList.filter(icon => {
                let title = span.firstChild.firstChild.title;

                let exceptions = false;
                if (icon.except) {
                    exceptions = icon.except.some(tag => title.includes(tag));
                }
                return title.includes(icon.tag) && !exceptions;
            });

            if (buttons.length > 0) {
                let iconButtonDiv = document.createElement("iconButtonDiv");
                iconButtonDiv.className = "icon-btn-div";

                for (let buttonInfo of buttons) {
                    let iconButton = document.createElement("button");
                    iconButton.className = "icon-btn";
                    iconButton.title = buttonInfo.tag;
                    iconButton.style.backgroundColor = buttonInfo.color;

                    let icon = document.createElement("i");

                    if (buttonInfo.icon) {
                        icon.className = `fa fa-${buttonInfo.icon}`;
                    }
                    if (buttonInfo.svg) {
                        icon.innerHTML = this.svgList[buttonInfo.tag];
                    }

                    iconButton.appendChild(icon);
                    iconButtonDiv.appendChild(iconButton);
                }

                span.firstChild.before(iconButtonDiv);
            }
        }
    }

    /** MutationHandler implementation that removes the selected nodes */
    class ElementRemover extends MutationHandler {
        work(e) {
            e.remove();
        }
    }

    /**
     * MutationHandler implementation that updates the `PageInfoElement` with
     * the number of the current last page
     */
    class PageNumberCheck extends MutationHandler {
        handle(node) {
            if (node.nodeType == Node.TEXT_NODE) return; // Text node

            if (node.classList.contains("content-page")) {
                pageInfoElement.setPage(node.id.match(/\d+/));
            }
        }
    }

    /**
     * Manages en element that shows the number of the current last page of
     * posts of the search result, and the total amount of posts of the search,
     * if available
     */
    class PageInfoElement {
        constructor() {
            this.spanPages = document.createElement("p");
            this.spanPages.addClassName("page-info");

            GM_addStyle(".page-info { border: 2px solid #FF761C; margin: 0.1em; color: white; }");

            this.pageCount = null;
            if (document.getElementsByClassName("tag-type-none").length > 0) {
                let tagTotalCount = document.getElementsByClassName("tag-type-none")[0]
                    .textContent.replace(",", "");
                this.pageCount = Math.ceil(tagTotalCount / 20);
            }
            else {
                if (document.getElementsByClassName("tag-count").length == 1) {
                    let tagTotalCount = document.getElementsByClassName("tag-count")[0]
                        .textContent.replace(",", "");
                    this.pageCount = Math.ceil(tagTotalCount / 20);
                }
            }

            this.spanPages.textContent =
                !this.pageCount ? "Primera página" :
                this.pageCount === 1 ? "Única página" :
                    `Primera página de ${this.pageCount}`;

            /* if (!this.pageCount) {
                this.spanPages.textContent = "Primera página";
            } else if (this.pageCount == 1) {
                this.spanPages.textContent = "Única página";
            } else {
                this.spanPages.textContent = `Primera página de ${this.pageCount}`;
            } */

            document
                .getElementById("search-form")
                .after(this.spanPages);
        }

        /** Sets the last page's number in this element */
        setPage(pageNumber) {
            /* if (this.pageCount) {
                this.spanPages.textContent = `Última página: ${pageNumber} de ${this.pageCount}`;
            } else {
                this.spanPages.textContent = `Última página: ${pageNumber}`;
            } */
            this.spanPages.textContent = this.pageCount ?
                `Última página: ${pageNumber} de ${this.pageCount}` :
                `Última página: ${pageNumber}`;
        }
    }

    const mutationHandlerList = new MutationHandlerContainer();
    mutationHandlerList.addHandler(new IconAdder("span.thumb"));
    // mutationHandlerList.addHandler(new ElementRemover(".blacklisted,.scad-i,.scad-i,.scad"));
    if (esBusq) {
        var pageInfoElement = new PageInfoElement();
        mutationHandlerList.addHandler(new PageNumberCheck(".content-page"));
    }

    var targetId = "post-list";
    if (esPost) targetId = "post-view";
    if (esPool) targetId = "pool-show";

    mutationObserve(targetId, mutationHandlerList);
})();
