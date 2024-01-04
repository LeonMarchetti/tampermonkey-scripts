/**
 * Opens a modal window in the page
 *
 * Usage:
 *
 * ```js
 * var modal = new Modal();
 * modal.create(`<div class="modal-content">
 *     <h1>My Modal</h1>
 *     <p>Some text</p>
 * </div>`);
 * modal.open();
 * ```
 */
class Modal {
    /** @type {string} Modal container identificator */
    id;
    /** @type {HTMLElement} Modal element */
    modal;

    /** @type {string} (Default) id used for the modal container */
    static MODAL_ID = "test-modal";

    /**
     * Creates object, assigning an id to be used when creating the modal.
     */
    constructor(modalId = Modal.MODAL_ID) {
        this.id = modalId;
    }

    /**
     * Creates the modal, with the HTML code and CSS styles
     *
     * @param {string} content Modal content
     */
    create(content = "") {
        var modalContent = `<div id="${this.id}">${content}</div>`;

        let fragment = document.createDocumentFragment();
        let temp = document.createElement("div");
        temp.innerHTML = modalContent;
        while (temp.firstChild) {
            fragment.appendChild(temp.firstChild);
        }

        this.modal = fragment.firstChild;
        document.body.insertBefore(fragment, document.body.childNodes[0]);

        this.modal.style.display = "none";
        this.modal.style.position = "fixed";
        this.modal.style.zIndex = "999";

        var closeButton = document.createElement("span");
        closeButton.className = "close";
        closeButton.innerHTML = "&times;";
        closeButton.onclick = () => this.close();
        this.modal.querySelector(".modal-content").insertAdjacentElement("afterbegin", closeButton);
    }

    open() {
        this.modal.style.display = "block";
    }

    close() {
        this.modal.style.display = "none";
    }

    isOpen() {
        return this.modal.style.display != "none";
    }
}