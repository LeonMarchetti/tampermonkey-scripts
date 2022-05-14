// @name        mutationHandler.js
// @version     1.0.0
// @description Definitions file for MutationHandler and associated functions
// @author      LeonAM

/**
 * Starts an observer over the `targetNode`, whose callback adds the nodes
 * to each of the MutationHandler objects in `mutationHandlerContainer`
 *
 * @param {Element} targetNode
 * @param {MutationHandlerContainer} mutationHandlerContainer
 */
function mutationObserve(targetNode, mutationHandlerContainer) {
    mutationHandlerContainer.handle(targetNode);

    const observer = new MutationObserver(function (mutationsList, observer) {
        mutationsList.forEach(m => {
            m.addedNodes.forEach(node => mutationHandlerContainer.handle(node));
        });
    });
    observer.observe(targetNode, { childList: true, subtree: true });
}

/** Class which objects manage a list of MutationHandler objects */
class MutationHandlerContainer {
    constructor() {
        this.handlerList = [];
    }

    /**
     * Adds a MutationHandler object to this container
     *
     * @param {MutationHandler} mutationHandler
     */
    addHandler(mutationHandler) {
        this.handlerList.push(mutationHandler);
    }

    /**
     * Adds the element to the handler of all MutationHandler objects of this
     * container
     *
     * @param {Element} element Element to be observed by all the handlers of
     * this container
     */
    handle(element) {
        this.handlerList.forEach(handler => handler.handle(element));
    }
}

/** Class that defines a task to execute over the observed nodes */
class MutationHandler {
    constructor(targetClassList) {
        if (this.constructor == MutationHandler) {
            throw new Error("This class can't be instantiated");
        }

        this.targetClassList = targetClassList;
    }

    /**
     * Executes the task of this MutationHandler over the child elements of
     * the target node `node`.
     *
     * If you want to work only over the target node, overwrite this method
     * to skip the `forEach` if desired.
     *
     * @param {Element} node
     */
    handle(node) {
        if (node.nodeType == Node.TEXT_NODE) return; // Text node

        node.querySelectorAll(this.targetClassList).forEach(e => this.work(e));
    }

    /** Executes a task over a node affected by this MutationHandler */
    work(e) {
        throw new Error("Missing implementation");
    }
}
