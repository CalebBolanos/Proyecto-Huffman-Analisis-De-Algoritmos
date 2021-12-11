class info extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <div id="info-box">
            <div id="page">
                <div class="titulo"><h1>¿Qué es el algoritmo de Huffman?</h1></div>

                <div class="box1">
                    El algoritmo de codificación de Huffman es un método para compresión de archivos desarrollado por
                    David A. Huffman en 1952 que toma un alfabeto de n símbolos,junto con sus frecuencias de aparición asociadas
                    y produce un código de Huffman para esas frecuencias y alfabeto.
                </div>

                <div class="img1">
                    El algoritmo consiste en la creación de un árbol binario que tiene cada uno de los
                    símbolos por hoja, y construido de tal forma que siguiéndolo desde la raíz a cada una de
                    sus hojas se obtiene el código Huffman asociado.
                </div>

                <div class="box2-text">El procedimiento es:</div>
                <div class="box2">
                    <ol>
                        <li>Generar un árbol sin hijos por cada símbolo del alfabeto.</li>
                        <li>Tomamos dos árboles de menor frecuencia y creamos con ellos un nuevo árbol
                        cuya raíz será la suma de sus frecuencias.</li>
                        <li>Etiquetamos las ramas con un 0 a la izquierda y un 1 a la derecha.</li>
                        <li>Repetir el proceso hasta tener un solo árbol.</li>
                    </ol>
                </div>
            </div>
        </di>
        `;
    }
}

window.customElements.define("v-info", info);