// ==UserScript==
// @name         Chan Sankaku Complex
// @namespace    http://tampermonkey.net/
// @version      2021.09.28
// @description  Script for chan.sankakucomplex.com
// @author       LeonAM
// @match        https://chan.sankakucomplex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankakucomplex.com
// @require      file://<PATH>/sankaku-complex.js
// @grant        GM_info
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    console.info(`Running UserScript "${GM_info.script.name}"`);

    const url = new URL(document.location.href);

    /** If current page is a pool of posts page */
    const isPool = url.href.includes("pool/show");
    if (isPool) return;

    /** If current page is a post page */
    const isPost = url.href.includes("post/show");
    var postId = null;
    if (isPost) {
        postId = url.pathname.split("/").last();
    }

    /** If current page is a posts search result page */
    const isSearch = !isPost && !isPool;

    /** Input for tags to search */
    const input = document.getElementById("tags");

    // Hide blacklisted posts and ads
    GM_addStyle(".blacklisted,.scad-i,.scad-i,.scad { display: none !important; }");

    if (isSearch) {
        // Make the post fill the width
        GM_addStyle("div.content { width: auto; padding-left: 243px; }");
        // Make the thumbnails align by its left border
        GM_addStyle("span.thumb { text-align: inherit; }");
    }

    /**
     * Activates the post search, as if the Enter key was pressed at the search
     * bar
     */
    function triggerSearch() {
        document.forms[0].submit();
    }

    /**
     * Creates a button, to add or remove the tags from the search bar, with or
     * without modifiers
     *
     * @param {string} symbol Button symbol
     */
    function getTagButton(symbol) {
        let button = document.createElement("button");
        button.textContent = symbol;
        button.addClassName("tag-btn");
        return button;
    }

    /**
     * Agrega un tag con un s??mbolo como modificador, o lo quita.
     *
     * @param {string} symbol S??mbolo modificador del tag
     * @param {string} tag Tag a modificar o quitar
     */
    function addTagWithSymbol(symbol, tag) {
        if (input.value.includes(tag)) {
            if (input.value.includes(symbol + tag)) {
                input.value = input.value.replace(symbol + tag, tag);
            } else {
                tag = tag
                    .replace("(", "\\(")
                    .replace(")", "\\)");
                let pattern = `\\S?${tag}`;
                let re = new RegExp(pattern, "g");
                input.value = input.value.replace(re, "");
            }
        } else {
            input.value += " " + symbol + tag;
        }
        input.value = input.value.trim();
    }

    document
        .querySelectorAll("a.editable")
        .forEach(a => {
            let plus = getTagButton("+");
            let minus = getTagButton("-");
            let tilde = getTagButton("~");

            let tag = a.textContent.replaceAll(" ", "_");

            plus.addEventListener("click", e => {
                if (!input.value.includes(tag)) {
                    input.value += " " + tag;
                }
                input.value = input.value.trim();
                if (e.shiftKey) {
                    triggerSearch();
                }
            });

            minus.addEventListener("click", e => {
                addTagWithSymbol("-", tag);
                if (e.shiftKey) {
                    triggerSearch();
                }
            });

            tilde.addEventListener("click", e => {
                addTagWithSymbol("~", tag);
                if (e.shiftKey) {
                    triggerSearch();
                }
            });

            let li = a.parentElement;
            li.insertBefore(tilde, li.firstChild);
            li.insertBefore(minus, li.firstChild);
            li.insertBefore(plus, li.firstChild);
        });
    GM_addStyle('.tag-btn { margin: 0; cursor: pointer; }');


    // Agrego unos botones para agregar un filtro para posts seg??n su rating.
    const searchForm = document.getElementById("search-form");

    var lastElementAppended = searchForm;
    /**
     * Agrega un div con una fila de elementos al espacio debajo de la barra de
     * b??squeda.
     *
     * @param row Elemento div.
     */
    function appendSidebarRow(row) {
        lastElementAppended.after(row);
        lastElementAppended = row;
    }

    /**
     * Agrega un bot??n que agrega un operador para modificar el rating de la
     * b??squeda.
     *
     * @param rating Rating a modificar. Puede ser "s", "q" o "e", o sus
     * formas completas.
     * @param container Elemento contenedor donde insertar el bot??n.
     * @param negated Si al presionar el bot??n el rating se niega o no
     * (se agrega el modificador "-").
     */
    function addRatingButton(rating, container, negated = false) {
        var modifier = ((negated) ? "-" : "");
        var ratingTag = modifier + `rating:${rating}`;

        var button = document.createElement("button");
        button.textContent = modifier + rating.toUpperCase();
        button.addEventListener("click", e => {
            if (input.value.includes("rating")) {
                input.value = input.value.replace(/\S?rating:\w/, ratingTag);
            } else {
                input.value += " " + ratingTag;
            }
            if (e.shiftKey) {
                triggerSearch();
            }
        });
        button.addClassName("rating-button");

        container.appendChild(button);
    }

    const sidebarRowRating = document.createElement("div");
    sidebarRowRating.addClassName("sidebar-row");
    appendSidebarRow(sidebarRowRating);

    for (let rating of "sqe") {
        addRatingButton(rating, sidebarRowRating);
        addRatingButton(rating, sidebarRowRating, true);
    }

    var buttonClearRating = document.createElement("button");
    buttonClearRating.textContent = "Clear rating";
    buttonClearRating.addEventListener("click", () => {
        input.value = input.value.replace(/\S?rating:\w/, "").trim();
    });
    buttonClearRating.addClassName("rating-button");

    const sidebarRowClearRating = document.createElement("div");
    sidebarRowClearRating.addClassName("sidebar-row");
    sidebarRowClearRating.appendChild(buttonClearRating);
    appendSidebarRow(sidebarRowClearRating);

    /**
     * Agrega una fila con un bot??n que ocupa todo el ancho para agregar uno o
     * m??s tags a la b??squeda.
     */
    function addQueryRowButton(queryTags, text) {
        var button = document.createElement("button");
        button.addClassName("rating-button");
        button.textContent = text;
        button.addEventListener("click", () => {
            input.value += " " + queryTags;
            triggerSearch();
        });

        var div = document.createElement("div");
        div.addClassName("sidebar-row");
        div.appendChild(button);
        appendSidebarRow(div);
    }

    addQueryRowButton("-doujinshi -cg_art", "Remove doujinshi cg_art");
    addQueryRowButton("-cg_art", "Remove cg_art");
    addQueryRowButton("-doujinshi", "Remove doujinshi");

    GM_addStyle(".rating-button { width: 100%; cursor: pointer; }");
    GM_addStyle(".sidebar-row { display: flex; }");

    if (isPost) {
        // Agrego un bot??n para mostrar la imagen en pantalla completa.
        let showImageButton = document.createElement("button");
        showImageButton.textContent = "Mostrar Imagen";
        showImageButton.addClassName("rating-button");
        showImageButton.addEventListener("click", () => {
            document.location.href = document.getElementById("image").src;
        });

        let sidebarRow3 = document.createElement("div");
        sidebarRow3.addClassName("sidebar-row");
        sidebarRow3.appendChild(showImageButton);

        searchForm.after(sidebarRow3);

        if (document.querySelector("video#image") !== null) {
            GM_addStyle("video#image { height: 100vh }");
            document.querySelector("video#image").removeAttribute("width");
        }

        // Cambio el enlace al pool (si el post pertenece a uno) por una b??squeda
        let poolDiv = document.querySelector("[id^=pool]");
        if (poolDiv) {
            let poolId = poolDiv.id.match("[0-9]+")[0];
            poolDiv.children[1].href = `https://chan.sankakucomplex.com/?tags=pool%3A${poolId}`;
        }
    }

    document.addEventListener("keyup", e => {
        if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
            return;
        }

        var ctrl = e.ctrlKey;
        var alt = e.altKey;
        var shift = e.shiftKey;

        if (ctrl && alt && !shift) {
            switch (e.which) {
                case 72:
                    if (isPost) {
                        let image = document.querySelector("#image")
                        if (image.style.height) {
                            image.style.height = "";
                            image.style.width = "";
                        } else {
                            image.style.height = "100vh";
                            image.style.width = "auto";
                        }
                        window.location = "#image";
                    }
                    break;
            }
        }
    });
})();

/*
[23/04/2021] Primera versi??n.
* En p??gina de b??squeda de posts En p??gina de b??squeda de posts:
    * Oculta los <div> de las publicidades que separan las p??ginas de 20 posts, haciendo que aparezca todo de corrido.
    * Rellena el ancho total disponible de la secci??n de los posts, haciendo que aparezcan en filas de 6 posts.
* En p??gina de post:
    * Oculta los <div> de las publicidades que aparecen arriba y abajo de la imagen.
[29/04/21] Hacer Ctrl+clic en un tag, en la barra lateral de la izquierda, hace que se agregue a la barra de b??squeda de tags.
* Si el tag ya est?? se lo quita.
* Presionando Shift+Ctrl hace que se alterne con la negaci??n del tag.
[30/04/21]
* Modifiqu?? el evento de hacer Ctrl+clic en un tag.
    * Ahora se puede alternar la negaci??n de un tag.
    * Ahora se puede hacer que aparezca un tag negado autom??ticamente.
    * Al usar Ctrl+clic, al finalizar se pone el foco en el input, sin tener que desplazarse a su ubicaci??n.
* Agregu?? unos enlaces al lado de cada tag para usar la funcionalidad de arriba.
[09/05/21]
* Hice que aparezca el cursor de enlace en los botones de los tags.
* Pas?? las funciones afuera del iterador de los tags.
* Hice la funci??n `getTagButton` para no repetir el c??digo de la creaci??n de los botones.
* Oculto los posts de la lista negra.
* Cambi?? el c??digo para ocultar publicidades y posts para usar los HTMLCollection en vivo, creando la lista de
    posts primero y en los intervalos solamente itero las listas, ya que en estos aparecen los posts nuevos
    autom??ticamente.
* Cambi?? `hide` por `remove`, para quitar del DOM en lugar de solo ocultarlos.
* Puse el c??digo para eliminar los elementos en la clase `ElementRemover`.
* Agregu?? unos botones para agregar el filtro por rating.
* Agregu?? un bot??n abajo de la barra de tags para mostrar la imagen.
[10/05/21]
* Convert?? los enlaces para agregar tags en botones.
* Agregu?? "cursor: pointer" en los estilos de los botones.
* Ahora uso la funci??n "GM_addStyle" para agregar estilos.
* Agregu?? un span con el n??mero de la ??ltima p??gina mostrada de posts y con el n??mero total de p??ginas.
[15/05/21]
* Si accedo a una b??squeda desde una p??gina despu??s de la primera, pongo el mensaje "Primera p??gina: $n", donde
    a $n lo saco de la URL.
[16/05/21]
* Ahora si apreto Shift cuando apreto un bot??n de rating entonces empieza la b??squeda autom??ticamente.
[18/05/21]
* Ahora si apreto Shift cuando apreto uno de los botones de los tags entonces empieza la b??squeda
    autom??ticamente.
* Si el post es un video, cambio su altura a "100vh".
[19/05/21]
* En un post de un pool, apretar las teclas para la izquierda y la derecha te hacen navegar entre los posts del
    pool.
[22/05/21]
* En un post de video, al video le saco el ancho definido como atributo para que no se muestre el espacio entre
    la barra lateral y el video.
[05/06/21]
* Arregl?? el reemplazo de tags con s??mbolos, antes si se trataba de reemplazar un s??mbolo por otro se
    desaparec??a el tag pero no el s??mbolo.
* Arregl?? mensaje de error cuando document.querySelector("video#image") es null.
[07/06/21]
* Agregu?? el bot??n para agregar los tags -doujinshi y -cg_art.
[11/06/21]
* Al tratar de manejar un tag con par??ntesis me hab??a olvidado de escaparlos antes de usarlos como patr??n de
    RegEx.
[13/06/21]
* Agrego unos ??conos sobre los posts para indicar que el post tiene un determinado tag.
  * Uso los ??conos de Font Awesome.
[14/06/21]
* Cambi?? la forma de determinar el color del ??cono.
  * Ahora aplico el estilo en linea "background-color" en lugar de asignarles un estilo "icon-btn-<color>".
[21/06/21]
* Modifiqu?? la estructura de la lista de ??conos.
* Reemplac?? el ciclo para determinar los botones a agregar por el uso de Array.filter().
[24/06/21]
* Cre?? un nuevo script "Chan Sankaku Complex Mutation" para reunir todo el c??digo que necesite esperar la
    creaci??n de nuevos elementos para aplicarles cambios.
* Borr?? el c??digo correspondiente de ac??.
[26/06/21]
* Modifiqu?? la estructura de los elementos agregados a la barra lateral para usar filas div con "display: flex"
    para que los elementos llenen el ancho de la fila.
* Modifiqu?? el bot??n de "Mostrar Imagen" para que sea un bot??n en lugar de enlace y agarre la direcci??n del
    `src` de la imagen al momento del click.
[20/08/21]
* Agregu?? un evento de presi??n de tecla para que en un post una imagen de tama??o original se ajusta a la altura
    de la pantalla y viceversa, poniendo height = "100vh" y width = "auto".
[25/08/21]
* Ahora corto el evento de presi??n de tecla para que se ignore si escribo en un input.
[26/08/21]
* Modifiqu?? los estilos en la p??gina de b??squeda de post:
  * Mejor?? el ancho de la parte del contenido.
  * Cambi?? la alineaci??n de las miniaturas para que est??n alineadas por su borde izquierdo.
[13/09/21]
* Se modifica el enlace del pool de un post por la p??gina de b??squeda del pool.
[14/09/21]
* Hice una funci??n para agregar botones en filas en la barra lateral que modifican la b??squeda y que ocupan todo el ancho.
[28/09/2021]
* Agregu?? una modificaci??n a los estilos para ocultar los posts con tags en la lista negra, para reemplazar el
objeto "ElementRemover" en "Chan Sankaku Complex Observer". Ahora se ocultan en lugar de ser borrados.
*/