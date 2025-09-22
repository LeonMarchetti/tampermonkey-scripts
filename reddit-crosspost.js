// ==UserScript==
// @name         Reddit Crosspost
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Utilities for crosspost page
// @author       LeonAM
// @match        https://www.reddit.com/r/community/submit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const DIALOG_TITLE = "Armar Título";
    /** Flag if dialog was closed by "Apply" button */
    var submitted = false;
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

    /** Add button to open dialog */
    function addOpenButton() {
        let openButton = document.createElement("button");
        openButton.append(DIALOG_TITLE);
        openButton.type = "button";
        openButton.classList.add("button-medium", "button-primary");
        openButton.style.left = "65rem";
        openButton.style.position = "absolute";
        openButton.addEventListener("click", openDialog);

        document.querySelector("r-post-composer-form").before(openButton);
    }

    /**
     * Gets the current title's control element to get and update its value
     *
     * @returns {HTMLTextAreaElement}
     */
    function getCurrentTitle() {
        return document.querySelector("faceplate-textarea-input")
            .shadowRoot
            .querySelector("textarea");
    }

    /** Open dialog, update preview with textarea's current value */
    function openDialog() {
        preview.value = getCurrentTitle().value;
        dialog.showModal();
    }

    /** Build final title string from values */
    function buildResult(values) {
        return (
            (values.author ? `(by ${values.author}) ` : "") +
            (values.characters ? `(${values.characters}) ` : "") +
            (values.source ? `[${values.source}]` : "")
        ).trim();
    }

    /** On dialog submit build the new title and edit the textarea */
    function onApplyTitle(event) {
        event.preventDefault();
        const values = Object.fromEntries(new FormData(this).entries());
        let result = buildResult(values);
        submitted = true;
        dialog.close(result.trim());
    }

    /** Update preview live */
    function updatePreview(values) {
        const current = getCurrentTitle()?.value || "";
        preview.value = `${current} ${buildResult(values)}`.trim();
    }

    /**
     * Return form for building the post's title
     *
     * @returns {HTMLFormElement}
     */
    function buildTitleForm() {
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

        // Form buttons
        let closeButton = document.createElement("button");
        closeButton.append("Cancelar");
        closeButton.classList.add("button-medium", "button-secondary");
        closeButton.style.flex = "1";
        closeButton.style.marginInline = "50px";
        closeButton.addEventListener("click", event => {
            event.preventDefault();
            dialog.close();
        });

        let applyButton = document.createElement("button");
        applyButton.append("Aplicar");
        applyButton.type = "submit";
        applyButton.classList.add("button-medium", "button-primary");
        applyButton.style.flex = "1";
        applyButton.style.marginInline = "50px";

        let buttonRow = document.createElement("div");
        buttonRow.style.display = "flex";
        buttonRow.style.justifyContent = "space-around";
        buttonRow.style.marginTop = "1rem";
        buttonRow.append(closeButton, applyButton);

        // Preview area
        preview = document.createElement("textarea");
        preview.disabled = true;
        preview.style.border = "1px solid #FFFFFF33";
        preview.style.borderRadius = "1.25rem";
        preview.style.margin = "5px";
        preview.style.width = "100%";

        // Form
        let form = document.createElement("form");
        form.method = "dialog";
        form.append(
            buildInput("author", "Autores"),
            buildInput("characters", "Personajes"),
            buildInput("source", "Show"),
            document.createElement("hr"),
            preview,
            document.createElement("hr"),
            buttonRow
        );
        form.addEventListener("submit", onApplyTitle);
        return form;
    }

    /** Get result value from dialog and edit title */
    function onDialogClose() {
        if (dialog.returnValue && submitted) {
            let result = getCurrentTitle().value + " " + dialog.returnValue;
            getCurrentTitle().value = result;
            document.querySelector("faceplate-textarea-input").value = result;
        }
        submitted = false;
    }

    /** Add dialog to DOM to make it available */
    function addDialog() {
        let header = document.createElement("h1");
        header.className = "mb-md text-24 text-neutral-content font-bold ml-md";
        header.append(DIALOG_TITLE);

        dialog = document.createElement("dialog");
        dialog.closedBy = "any";
        dialog.style.padding = "1em";
        dialog.style.width = "25%";
        dialog.append(header, buildTitleForm());

        dialog.addEventListener("close", onDialogClose);

        document.body.append(dialog);
    }

    addDialog();
    addOpenButton();
})();