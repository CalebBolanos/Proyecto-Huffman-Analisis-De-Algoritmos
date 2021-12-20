/**
 * Visualizador de algoritmo de Huffman
 * 
 * PROYECTO FINAL: Codificación de Huffman
 * EQUIPO: Equipo Chipocludo.
 * AUTORES: Aguirre Alvarez Omar, Álvarez Méndez Laura, Bello Muñoz Edgar Alejandro, Bolaños Ramos Caleb Salomón
 * VERSION: 1.x
 * FECHA: 2/12/2021
 * 
 * Este archivo representa un componente que contiene la funcionalidad del visualizador 
 * de Huffman, el cual consiste de animar la construccion de arbol de codificación de 
 * Huffman en función a un string escrito por el usuario.
 * 
 * La estructura del código es igual al de un componente, no obstante, debido a que se 
 * esta utilizando Vue sin hacer uso de webpack, la funcionalidad esta contenida dentro 
 * de un archivo .js, pero manteniendo la funcionalidad de un componente de un solo 
 * archivo (.vue).
 * 
 * Dentro de este archivo también se hace uso de Cytoscape.js y de Ace.js para llevar a 
 * cabo la animación y representacion del codigo.
 */


/**
 * Clase NodoHuffman
 * 
 * Clase que representa un nodo del árbol de codificación de huffman, el cual se 
 * utiliza tanto para generar el árbol de codificacion de huffman como para la animación
 * usando Cytoscape.
 * 
 * Ademas de las propiedades frecuencia, caracter, izquierda y derecha, la propiedad idCy 
 * se encarga de guardar el id que representara al nodo en la animación.
 * 
 * Esta clase se utiliza en: generarNodos(), algoritmoHuffman()  
 *
 * @class NodoHuffman
 */
class NodoHuffman {
    constructor() {
        this.frecuencia = 0;
        this.caracter = "";
        this.izquierda = this.derecha = null;
        this.idCy = "";
    }
}

/** 
 * Componente que representa el visualizador de huffman, el cual contiene en su plantilla 
 * (template) un cuadro de texto, la animación del código y la visualización de la construcción 
 * del arbol de Huffman. 
 * 
 * VisualizadorHuffman hace uso del sistema de reactividad y funcionalidades que proporciona Vue 
 * (data, props, methods, etc.) para facilitar la codificacion de la animación, la cual se hizo 
 * a través de la libreria Cytoscape.js
 * 
 * Este componente se utiliza en: index.html
 * 
 * @type {Object} */
const VisualizadorHuffman = {
    //plantilla con el codigo html que representa al componente
    template: `
    <v-row>
    <v-col cols="12" sm="12">
      <v-card rounded="lg" elevation="0">
        <v-card-title class="align-start">
          <span>Visualizar árbol de codificación óptimo</span>
          <v-spacer></v-spacer>
        </v-card-title>
    
        <v-card-text>
          <v-textarea
            outlined
            label="Escribe el mensaje que deseas codificar"
            v-model="cadena"
          ></v-textarea>
          <v-btn block color="" class="btn-personal-primary" @click="generarNodos()"> Construir árbol </v-btn>
          
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="6" lg="6">
      <v-card rounded="lg" elevation="0" min-height="80vh">
        <v-card-title class="align-start">
          <span>Algoritmo de Huffman (JavaScript)</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
            <div id="editor" ref="editor" style="width: 100%; height: 60vh; display: block">
while (colaPrioridad.length > 1) {
  let nodoUno = colaPrioridad.shift();
  let nodoDos = colaPrioridad.shift();

  let nuevoArbol = new NodoHuffman();
  nuevoArbol.frecuencia = nodoUno.frecuencia + nodoDos.frecuencia;
  nuevoArbol.caracter = undefined;
   
  nuevoArbol.izquierda = nodoUno;
  nuevoArbol.derecha = nodoDos;

  colaPrioridad.push(nuevoArbol);
}
            </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="6" lg="6">
      <v-card rounded="lg" elevation="0" min-height="80vh">
        <div id="cy" ref="cy" style="width: 100%; height: 80vh; display: block"></div>
      </v-card>
    </v-col>
    </v-row>
    `,

    /**
     * Objeto data, el cual contiene los datos que se utilizaran para llevar a cabo el 
     * algoritmo de Huffman y su representacion animada. Dentro de el encontramos:
     * 
     * -cadena: string a codificar que ingresa el usuario.
     * -n: number que representa el numero de caracteres en la cadena.
     * -charArray y charFreq: arrays que guardan el caracter y las frecuencias contenidas 
     * de la cadena escrita por el usuario, respectivamente.
     * -colaPrioridad: array que guarda objetos del tipo NodoHuffman para llevar a cabo la 
     * codificacion. Este arreglo se comporta como una cola de prioridad. 
     * -cy: objeto que guarda la instancia de Cytoscape.js. Se utiliza para llevar a cabo la 
     * animacion del arbol de codificacion de Huffman.
     * -editor: objeto que guarda la instancia de Ace.js. Se utiliza para llevar a cabo la 
     * animacion del codigo.
     * 
     * 
     * @returns un objeto con las propiedades que el componente usará dentro del sistema 
     * de reactividad de Vue
     */
    data: () => ({
        cadena: "ACCCAABABAABABACBCBBACADDDDDFDCACAEEEEECBCAFFCACAAAAAEEEEDADADADDAAABDAAFFDADBDBDAAABAABAAAAAAAAAAAA",
        n: 0,
        charArray: [],
        charFreq: [],
        colaPrioridad: [],
        codigosSimbolos: {},
        cy: undefined,
        editor: undefined,
    }),

    /**
     * Hook de ciclo de vida del componente mounted()
     * 
     * Cuando se monta la instancia del componente, se inicializa la instancia de 
     * Cytoscape y de Ace y se le asignan a cy y editor respectivamente para 
     * poder usarlas a lo largo del componente,
     */
    mounted() {
        let cytoscape = window.cytoscape({
            container: this.$refs.cy,
            elements: [

            ],

            style: [{
                    selector: "node",
                    style: {
                        "background-color": "#11479e",
                        "text-wrap": "wrap",
                        "text-halign": "center",
                        "text-valign": "center",
                        color: "#fff",
                        width: "50",
                        height: "50",
                    },
                },
                {
                    selector: "edge",
                    style: {
                        width: 3,
                        "line-color": "#ccc",
                        "target-arrow-color": "#ccc",
                        "target-arrow-shape": "triangle",
                        "curve-style": "bezier",
                    },
                },
            ],
            layout: {
                name: "dagre",
            },
        });
        this.cy = cytoscape;

        let aceEditor = window.ace.edit(this.$refs.editor, {
            mode: "ace/mode/javascript",
            selectionStyle: "text"
        });

        this.editor = aceEditor;
        this.editor.setOptions({
            readOnly: true,
            cursorStyle: "slim",
            theme: "ace/theme/dracula",
            //hScrollBarAlwaysVisible: false,
            fontSize: 11.7
        })
    },

    /**
     * Hook de ciclo de vida del componente created()
     * por si lo llegamos a usar xd
     */
    created() {

    },

    /**
     * Metodos para ser mezclados dentro de la instancia, los cuales contienen todas las funciones 
     * que se utilizaron para llevar a cabo la animacion del arbol de codificacion de Huffman. 
     */
    methods: {

        /**
         * sleep()
         * 
         * funcion para "dormir" la ejecucion del codigo
         *
         * @param {number} ms son los milisegundos en el que el codigo estara en espera
         * @return {Promise} promesa vacia la cual estara disponible despues de que se 
         * acabe el tiempo de espera
         * 
         * usado en: AlgoritmoHuffman()
         */
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },


        /**
         * obtenerFrecuencias()
         * 
         * funcion que se encarga de obtener los caracteres y las frecuencias 
         * que aparecen de una cadena dada. Dichos datos se guardan en los Arrays
         * charArray y charFreq, ademas del calcular el valor de n.
         *
         * @param {string} texto es la cadena de donde se obtienen las frecuencias
         * 
         * usado en: generarNodos()
         */
        obtenerFrecuencias(texto) {
            let freq = {};

            for (let i = 0; i < texto.length; i++) {
                if (freq[texto[i]]) {
                    freq[texto[i]].frequency++;
                } else {
                    freq[texto[i]] = {};
                    freq[texto[i]].symbol = texto[i];
                    freq[texto[i]].frequency = 1;
                }
            }
            //console.log(Object.keys(freq))

            for (const [key, value] of Object.entries(freq)) {
                this.charArray.push(value.symbol);
                this.charFreq.push(value.frequency);
            }
            this.n = this.charArray.length

        },

        /**
         * generarNodos()
         * 
         * genera los nodos para llevar a cabo la codificación de huffman, tanto para el algoritmo 
         * en si como para la representacion de la animacion en cytoscape. Seguido de esto, se ejecuta
         * el algoritmo de huffman con su respectiva animacion
         * 
         * usado en: onClick
         */
        generarNodos() {
            //removemos los nodos en la instancia de cy y vaciamos los arreglos ocupados para la codificacion
            this.cy.elements().remove()
            this.charArray = []
            this.charFreq = []
            this.colaPrioridad = []

            this.obtenerFrecuencias(this.cadena)

            //se crean los nodos de huffman y se insertan en la cola de prioridad
            for (let i = 0; i < this.n; i++) {
                let hn = new NodoHuffman();

                hn.caracter = this.charArray[i];
                hn.frecuencia = this.charFreq[i];

                /**
                 * TODO:
                 * arreglar un bug, ya que, aunque funciona, en esta parte se puede 
                 * agregar como parte del nombre caracteres que no son validos para 
                 * un selector de CSS
                 */
                hn.idCy = hn.caracter == ' ' ? `esp-${hn.frecuencia}` : `${hn.caracter}-${hn.frecuencia}`;

                hn.izquierda = null;
                hn.derecha = null;

                this.colaPrioridad.push(hn);
            }
            //se ordena la cola de prioridad de forma ascendente
            this.colaPrioridad.sort(function(a, b) {
                return a.frecuencia - b.frecuencia;
            });

            /* 
              en esta parte se crea la representacion de cada uno 
              de los nodos de huffman en cytoscape, añadiendo cada 
              uno de los nodos de la cola de prioridad con su 
              respectivo id, informacion y coordenadas
             */
            let i = 1;
            this.colaPrioridad.forEach((nodoHuffman) => {
                this.cy.add({
                    data: {
                        id: nodoHuffman.idCy,
                    },
                    position: {
                        x: 100 * i,
                        y: 200,
                    },
                }).css({
                    label: `${nodoHuffman.caracter} (${nodoHuffman.frecuencia})`,
                }); // ;)
                i++;
            });
            //reseteamos la posicion del viewport
            this.cy.reset();


            this.AlgoritmoHuffman(this.colaPrioridad);
        },

        /**
         * funcion AlgoritmoHuffman()
         * 
         * funcion principal que se encarga de calcular el arbol de codificacion de Huffman, el cual,
         * va generando de forma asincrona, por cada iteracion, los resultados necesarios para llevar 
         * a cabo la animación de lo que esta sucediendo dentro del algoritmo.
         * 
         *
         * @param {Array} colaPrioridad es la cola de prioridad con la que opera el algoritmo de 
         * Huffman para crear el arbol de codificacion
         * 
         * usado en: generarNodos()
         */
        async AlgoritmoHuffman(colaPrioridad) {
            let iteraciones = 0;

            //si solo existe un elemento ya se tiene el arbol de codificacion optima
            while (colaPrioridad.length > 1) {
                //se toman los primeros dos arboles de menor frecuencia
                let nodoUno = colaPrioridad.shift();
                let nodoDos = colaPrioridad.shift();

                //se crea el nuevo arbol, con la suma de frecuencia de los dos nodos anteriores
                let nuevoArbol = new NodoHuffman();
                nuevoArbol.frecuencia = nodoUno.frecuencia + nodoDos.frecuencia;
                nuevoArbol.caracter = undefined;

                //el primer arbol extraido se asigna como un hijo a la izquierda y el segundo a la derecha
                nuevoArbol.izquierda = nodoUno;
                nuevoArbol.derecha = nodoDos;

                //se asigna un id para poder identificar la raiz en Cytoscape
                nuevoArbol.idCy = `it-${iteraciones}-${nodoUno.frecuencia}-${nodoDos.frecuencia}`

                //finalmente se inserta el nuevo arbol a la cola de prioridad    
                colaPrioridad.push(nuevoArbol);

                //posteriormente se ejecuta la animacion representando todo lo que sucedio hasta este punto
                this.animarHuffman(nodoUno.idCy, nodoDos.idCy, nuevoArbol.idCy, nuevoArbol.frecuencia, this.cy, this.editor);
                //se hace un sleep de 8 segundos (duracion de la animacion)
                await this.sleep(8000);

                //se ordenan los nodos de forma ascendente en la cola de prioridad y dentro de la animacion
                colaPrioridad.sort(function(a, b) {
                    return a.frecuencia - b.frecuencia;
                });
                this.acomodarNodos(this.cy);

                iteraciones++;
            }
            this.editor.gotoLine(2); //indica en que linea de codigo esta actualmente la animacion
            await this.sleep(1000);
            this.imprimirCodigosEnNodos(colaPrioridad[0], "");
            console.log(this.codigosSimbolos);



            //finalmente ajustamos la instancia de cy para mostrar el arbol de forma que ocupe todo el espacio
            this.acomodarNodos(this.cy);
            this.cy.center();
            this.cy.fit();
        },

        /**
         * funcion acomodarNodos()
         * 
         * cambia de layout de la instancia de cytoscape a dagre, para que se muestren los arboles de forma correcta
         *
         * @param {Object} cy es la instancia de Cytoscape
         * 
         * usado en: AlgoritmoHuffman()
         */
        acomodarNodos(cy) {
            cy.layout({ name: 'dagre' }).run();
        },

        /**
         * animarHuffman()
         * 
         * funcion que se encarga de llevar a cabo la animacion que representa paso por paso lo que sucede en una iteracion 
         * del while del algoritmo de Huffman. También se encarga de indicar de forma sincronizada en que linea 
         * de codigo del algoritmo de Huffman se encuentra la animacion.
         * 
         * Para llevar a cabo lo anteriormente mencionado se utilizan los parametros:
         *  
         * @param {string} idNodoUno para obtener el NodoUno dentro de Cytoscape y animarlo
         * @param {string} idNodoDos para obtener el NodoDos dentro de Cytoscape y animarlo
         * @param {string} idNuevoArbol el cual es el id que se le asignara al nuevo nodo creado en la animacion
         * @param {number} sumaFrecuencia el valor que se mosrara en forma de texto del nuevo nodo, el cual es la suma de frecuencias de los primeros dos nodos
         * @param {Object} cy la instancia de Cytoscape
         * @param {Object} editor la instancia de Ace
         */
        animarHuffman(idNodoUno, idNodoDos, idNuevoArbol, sumaFrecuencia, cy, editor) {

            //indica en que linea de codigo esta actualmente la animacion 
            editor.gotoLine(2);

            //============= animacion de primer nodo ===========================

            //obtiene el primer nodo
            let nodo1 = cy.getElementById(idNodoUno);

            //determina si un nodo es raiz si la clase asignada que tiene no esta en mas de un elemento
            let esRaiz = cy.$(`.${idNodoUno}`).length == 0;
            setTimeout(function() {
                editor.gotoLine(3);
                if (esRaiz) { //si el nodo es raiz, se ejecuta la animacion de raiz
                    nodo1.addClass(idNuevoArbol);
                    nodo1.animate({
                        position: {
                            x: nodo1.position('x'),
                            y: nodo1.position('y') + 200
                        }
                    }, {
                        duration: 1000,
                    });

                } else { //en caso contrario, se ejecuta la animacion de arbol
                    let arbol = cy.$(`.${idNodoUno}`);

                    //agregamos la nueva clase a cada uno de los nodos del arbol para que podamos manipularlos posteriormente
                    arbol.forEach((nodo) => nodo.addClass(idNuevoArbol));

                    //se ejecuta un layout de tipo preset para animar la transicion del arbol hacia abajo (desencolar)
                    arbol.layout({
                        name: 'preset',
                        animate: true,
                        fit: false,
                        transform: (nodo) => {
                            let position = {};
                            position.x = nodo.position('x');
                            position.y = nodo.position('y') + 200;
                            return position;
                        }
                    }).run();

                }
            }, 1000);


            //============= animacion de segundo nodo ===========================

            //obtiene el segundo nodo
            let nodo2 = cy.getElementById(idNodoDos);

            setTimeout(function() {
                editor.gotoLine(4);
                if (cy.$(`.${idNodoDos}`).length == 0) { //si el nodo es raiz, se ejecuta la animacion de raiz
                    nodo2.addClass(idNuevoArbol);
                    nodo2.animate({
                        position: {
                            x: nodo1.position('x') + 100,
                            y: nodo2.position('y') + 200
                        },
                    }, {
                        duration: 1000,
                    });

                } else { //en caso contrario, se ejecuta la animacion de arbol
                    let arbol = cy.$(`.${idNodoDos}`);
                    //agregamos la nueva clase a cada uno de los nodos del arbol para que podamos manipularlos posteriormente
                    arbol.forEach((nodo) => nodo.addClass(idNuevoArbol));

                    //se ejecuta un layout de tipo preset para animar la transicion del arbol hacia abajo (desencolar)
                    arbol.layout({
                        name: 'preset',
                        animate: true,
                        fit: false,
                        transform: (nodo) => {
                            let position = {};
                            position.x = nodo.position('x') + nodo1.position('x');
                            position.y = nodo.position('y') + 200;
                            return position;
                        }
                    }).run();

                }
            }, 2000);


            //============= animacion de nuevo nodo de huffman ===========================

            //agregamos nodo de huffman
            setTimeout(function() {
                editor.gotoLine(6);
                cy.add({
                    data: {
                        id: idNuevoArbol,
                    },
                    position: {
                        x: (nodo1.position('x') + nodo2.position('x')) / 2,
                        y: nodo1.position('y') - 100
                    }
                }).addClass(idNuevoArbol).css({
                    'label': `(${sumaFrecuencia})`
                });
            }, 3000);

            /**
             * TODO:
             * agregar los 0 y 1 a las flechas(edges) izquierda y derecha repectivamente
             */

            //agregamos izquierda
            setTimeout(function() {
                editor.gotoLine(10);
                cy.add({
                    data: {
                        id: `.${idNuevoArbol}-izq`,
                        source: idNuevoArbol,
                        target: idNodoUno
                    }
                    // }); //psss!! para poner los numeros (0 y 1) chequen las lineas 320-322
                }).css({
                    label: `0`,
                    'text-halign': 'left',
                    'text-valign': 'center',
                    'text-margin-x': '-15px',
                    'text-outline-color': '#FF5733',
                    'text-background-color': '#FF5733',
                });
            }, 4000);


            //agregamos derecha
            setTimeout(function() {
                editor.gotoLine(11);
                cy.add({
                    data: {
                        id: `.${idNuevoArbol}-der`,
                        source: idNuevoArbol,
                        target: idNodoDos,
                    }
                    // }); //psss!! para poner los numeros (0 y 1) chequen las lineas 320-322
                }).css({
                    label: `1`,
                    'text-halign': 'left',
                    'text-valign': 'center',
                    'text-margin-x': '15px',
                    'text-outline-color': '#FF5733',
                    'text-background-color': '#FF5733',
                });
            }, 5000);


            //============= animacion de insercion del nuevo arbol a la cola de prioridad  ===========================
            setTimeout(function() {
                editor.gotoLine(13);
                let arbol = cy.$(`.${idNuevoArbol}`);
                let raiz = cy.getElementById(idNuevoArbol);

                //con automove el usuario pude mover los nodos y automaticamente sus hijos se moveran con ellos
                cy.automove({
                    nodesMatching: arbol,
                    reposition: 'drag',
                    dragWith: raiz
                })

                //se ejecuta un layout de tipo preset para animar la transicion del arbol hacia arriba (encolar)
                arbol.layout({
                    name: 'preset',
                    animate: true,
                    fit: false,
                    transform: (nodo) => {
                        let position = {};
                        position.x = nodo.position('x');
                        position.y = nodo.position('y') - 100;
                        return position;
                    }
                }).run();
            }, 6000);
        },

        imprimirCodigosEnNodos(raiz, cadenaCodificacion) {
            if (raiz.izquierda == null && raiz.derecha == null) {
                console.log(raiz.caracter + ": " + cadenaCodificacion);
                this.codigosSimbolos[raiz.idCy] = cadenaCodificacion;
                this.crearPopper(this.cy.getElementById(raiz.idCy), cadenaCodificacion);
                return;
            }

            this.imprimirCodigosEnNodos(raiz.izquierda, cadenaCodificacion + "0");
            this.imprimirCodigosEnNodos(raiz.derecha, cadenaCodificacion + "1");
        },

        crearPopper(nodo, codigo) {
            let ref = nodo.popperRef();

            nodo.tippy = tippy(ref, {
                content: () => {
                    let content = document.createElement("div");

                    content.innerHTML = codigo;

                    return content;
                },
                trigger: "manual",
                placement: 'bottom',
            });

            nodo.unbind("mouseover");
            nodo.bind("mouseover", event => event.target.tippy.show());

            nodo.unbind("mouseout");
            nodo.bind("mouseout", event => event.target.tippy.hide());
        }

    },

}