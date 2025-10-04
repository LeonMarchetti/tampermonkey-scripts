// ==UserScript==
// @name         Reddit Search
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Trigger search dialog
// @author       LeonAM
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.info(`Running UserScript "Reddit Search"`);

    /** Flag if dialog was closed by "Apply" button */
    var submitted = false;

    /** Available posts sort options */
    const SORT_OPTIONS = [
        {"label": "Mejores", "value": "best"},
        {"label": "Destacando", "value": "hot"},
        {"label": "Más Nuevos", "value": "new"},
        {"label": "En Alza", "value": "rising"},
        {"label": "Más Votados", "value": "top"},
        {"label": "Default", "value": ""}
    ];

    /** Available types of searches */
    const TYPE_OPTIONS = [
        {"label": "Publicaciones", "value": "posts"},
        {"label": "Comentarios", "value": "comments"},
        {"label": "Multimedia", "value": "media"},
    ];

    /**
     * Dialog form for building the post's title
     *
     * @type HTMLDialogElement
     */
    var dialog;
    /**
     * Control that shows the preview title
     *
     * @type HTMLTextAreaElement
     */
    var preview;

    /** Parse current's URL */
    function getURL() {
        return new URL(window.location.href);
    }

    /** Builds combobox for search's sort order */
    function buildCombo(name, text, options) {
        // Combobox for selecting the search's sort order
        let combo = document.createElement("select");
        combo.name = name;
        combo.style.border = "1px solid #FFFFFF33";
        combo.style.borderRadius = "1.25rem";
        combo.style.flex = "1";
        combo.addEventListener("input", () => {
            const values = Object.fromEntries(new FormData(combo.form).entries());
            updatePreview(values);
        });

        options.forEach(sortOption => {
            let option = document.createElement("option");
            option.value = sortOption.value;
            option.append(sortOption.label);
            combo.append(option);
        });

        let label = document.createElement("label");
        label.append(text);
        label.for = name;
        label.style.marginRight = "10px";
        label.style.width = "100px";

        let comboContainer = document.createElement("div");
        comboContainer.append(label, combo);
        comboContainer.style.display = "flex";
        comboContainer.style.marginBottom = "10px";
        return comboContainer;
    }

    /** Build final URL from parameters */
    function buildResult(values) {
        let subredditPath = values.subreddit ? "r/" + values.subreddit : "";
        // values.text determines if target page is a search or a feed
        if (values.text) {
            let queryStringParams = [
                values.text ? "q=" + values.text : "",
                values.sort ? "sort=" + values.sort : "",
                values.type ? "type=" + values.type : ""
            ]
                .filter(p => p)
                .join("&");
            return `https://www.reddit.com/${subredditPath}/search/?` + queryStringParams;
        } else {
            return `https://www.reddit.com/${subredditPath}/${values.sort ?? ""}`;
        }
    }

    /** On dialog submit  */
    function onFormSubmit(event) {
        event.preventDefault();
        const values = Object.fromEntries(new FormData(this).entries());
        submitted = true;
        dialog.close(buildResult(values));
    }

    /** Update preview live */
    function updatePreview(values) {
        preview.value = buildResult(values);
    }

    /**
     * Builds the form's buttons for cancel and submit
     *
     * @returns {HTMLDivElement}
     */
    function buildFormButtons() {
        let closeButton = document.createElement("button");
        closeButton.append("Cancelar");
        closeButton.classList.add("button-medium", "button-secondary");
        closeButton.style.flex = "1";
        closeButton.style.marginInline = "50px";
        closeButton.addEventListener("click", event => {
            event.preventDefault();
            dialog.requestClose();
        });

        let submitButton = document.createElement("button");
        submitButton.append("Aplicar");
        submitButton.type = "submit";
        submitButton.classList.add("button-medium", "button-primary");
        submitButton.style.flex = "1";
        submitButton.style.marginInline = "50px";

        let buttonRow = document.createElement("div");
        buttonRow.style.display = "flex";
        buttonRow.style.justifyContent = "space-around";
        buttonRow.style.marginTop = "1rem";
        buttonRow.append(closeButton, submitButton);

        return buttonRow;
    }

    /**
     * Return form for building the post's title
     *
     * @returns {HTMLFormElement}
     */
    function buildForm() {
        function buildInput(name, text) {
            let input = document.createElement("input");
            input.name = name;
            input.style.border = "1px solid #FFFFFF33";
            input.style.borderRadius = "1.25rem";
            input.style.flex = "1";
            input.addEventListener("input", () => {
                const values = Object.fromEntries(new FormData(input.form).entries());
                updatePreview(values);
            });

            let label = document.createElement("label");
            label.append(text);
            label.for = name;
            label.style.marginRight = "10px";
            label.style.width = "100px";

            let inputContainer = document.createElement("div");
            inputContainer.append(label, input);
            inputContainer.style.display = "flex";
            inputContainer.style.marginBottom = "10px";
            return inputContainer;
        }

        // Preview area
        preview = document.createElement("textarea");
        preview.disabled = true;
        preview.style.border = "1px solid #FFFFFF33";
        preview.style.borderRadius = "1.25rem";
        preview.style.margin = "5px";
        preview.style.width = "100%";

        let form = document.createElement("form");
        form.method = "dialog";
        form.append(
            buildInput("text", "Texto"),
            buildCombo("sort", "Orden", SORT_OPTIONS),
            buildInput("subreddit", "Subreddit"),
            buildCombo("type", "Tipo", TYPE_OPTIONS),
            document.createElement("hr"),
            preview,
            document.createElement("hr"),
            buildFormButtons()
        );

        form.addEventListener("submit", onFormSubmit);
        form.addEventListener("keydown", event => {
            // Trigger submit event on pressing the "Enter" key
            if (event.key === "Enter") {
                event.preventDefault();
                form.dispatchEvent(new Event("submit"));
            }
        });
        return form;
    }

    /** Get result value from dialog and edit title */
    function onDialogClose(event) {
        if (dialog.returnValue && submitted && !(window.location.href == dialog.returnValue)) {
            window.location.href = dialog.returnValue;
        }
        submitted = false;
    }

    /** Add dialog to DOM to make it available */
    function addDialog() {
        let header = document.createElement("h1");
        header.className = "mb-md text-24 text-neutral-content font-bold ml-md";
        header.append("Search");

        dialog = document.createElement("dialog");
        dialog.closedBy = "any";
        dialog.style.padding = "1em";
        dialog.style.width = "25%";
        dialog.append(header, buildForm());
        dialog.addEventListener("close", onDialogClose);
        document.body.append(dialog);
    }

    /**
     * Open dialog, set default values of controls via the `params` object if defined, otherwise
     * from URL
     *
     * Sets the preview element's contents
     *
     * `params.focus` forces focus on determined input after opening the dialog, if defined
     *
     * `params.title` changes the header's text if defined
     */
    function openDialog(params) {
        function getParam(name, qs = name) {
            return params[name] ?? getURL().searchParams.get(qs) ?? "";
        }
        const form = dialog.querySelector("form");
        form.type.value = getParam("type");

        let textParam = getParam("text", "q");
        if (textParam) {
            form.sort.value = getParam("sort");
            form.text.value = textParam;
        } else {
            form.sort.value = getParam("sort") ?? getURL().pathname.split("/")[3];
        }

        let subredditMatch = getURL().pathname.match(/\/r\/(\w+)\//);
        if (subredditMatch) {
            form.subreddit.value = subredditMatch[1] ?? "";
        }

        preview.value = window.location.href;

        if (params.title) {
            dialog.querySelector("h1").innerText = params.title;
        }

        dialog.showModal();
        if (params.focus) {
            form[params.focus].focus();
        }
    }

    addDialog();

    document.addEventListener("keyup", e => {
        // Alt + <key>
        if (e.altKey && !e.ctrlKey && !e.shiftKey) {
            switch (e.code) {
                case "KeyR":
                    openDialog({
                        "focus": "subreddit",
                        "title": "Switch Subreddit"
                    });
                    break;
                case "KeyS":
                    openDialog({
                        "sort": "new",
                        "type": "media",
                        "focus": "text",
                        "title": "Search Multimedia"
                    });
                    break;
            }
        }
    });
})();