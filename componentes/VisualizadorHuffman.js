class NodoHuffman {
    constructor() {
        this.frecuencia = 0;
        this.caracter = "";
        this.izquierda = this.derecha = null;
        this.idCy = "";
    }
}
const VisualizadorHuffman = {
    template: `
    <v-row>
    <v-col cols="12" sm="12">
      <v-card rounded="lg" elevation="0">
        <v-card-title class="align-start">
          <span>Si</span>
          <v-spacer></v-spacer>
          <v-btn icon small class="mt-n2 me-n3">
            <v-icon size="22"> mdi-clipboard-list </v-icon>
          </v-btn>
        </v-card-title>
    
        <v-card-text>
          <v-textarea
            outlined
            label="Escribe el mensaje que deseas codificar"
            v-model="cadena"
          ></v-textarea>
          <v-btn block color="primary" @click="generarNodos()"> Construir árbol </v-btn>
          {{ n }}<br>{{ charArray }}<br>{{ charFreq }}<br>{{ colaPrioridad }}
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="6" lg="4">
      <v-card rounded="lg" elevation="0" min-height="80vh">
        <v-card-title class="align-start">
          <span>Si</span>
          <v-spacer></v-spacer>
        </v-card-title>
    
        <v-card-text> </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="6" lg="8">
      <v-card rounded="lg" elevation="0" min-height="80vh">
        <div id="cy" ref="cy" style="width: 100%; height: 80vh; display: block"></div>
      </v-card>
    </v-col>
    </v-row>
    `,
    data: () => ({
        cadena: "",
        n: 6,
        charArray: ['f', 'e', 'c', 'b', 'd', 'a'],
        charFreq: [5, 9, 12, 13, 16, 45],
        colaPrioridad: [],
        cy: undefined,
    }),

    mounted() {
        let cytoscape = window.cytoscape({
            container: this.$refs.cy, // container to render in
            elements: [

            ],

            style: [
                // the stylesheet for the graph
                {
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
                name: "grid",
                rows: 1,
            },
        });
        this.cy = cytoscape;
        //this.generarNodos()
    },

    created() {

    },

    methods: {
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },

        obtenerFrecuencias(text) {
            /*
                text : the input file data as continuous string
                operation : this function should calculate the frequency of each character in the input file
                return type : it returns a map {[char] -> node}
            */


            let freq = {};

            for (let i = 0; i < text.length; i++) {
                if (freq[text[i]]) {
                    //freq[text[i]].symbol = text[i];
                    freq[text[i]].frequency++;
                } else {
                    freq[text[i]] = {};
                    freq[text[i]].symbol = text[i];
                    freq[text[i]].frequency = 1;
                }
            }
            console.log(Object.keys(freq))

            for (const [key, value] of Object.entries(freq)) {
                this.charArray.push(value.symbol);
                this.charFreq.push(value.frequency);
            }
            this.n = this.charArray.length

        },

        generarNodos() {
            this.cy.elements().remove()
            this.charArray = []
            this.charFreq = []
            this.colaPrioridad = []
            this.obtenerFrecuencias(this.cadena)
            for (let i = 0; i < this.n; i++) {
                let hn = new NodoHuffman();

                hn.caracter = this.charArray[i];
                hn.frecuencia = this.charFreq[i];

                hn.idCy = `${hn.caracter}-${hn.frecuencia}`;

                hn.izquierda = null;
                hn.derecha = null;

                this.colaPrioridad.push(hn);
            }

            this.colaPrioridad.sort(function(a, b) {
                return a.frecuencia - b.frecuencia;
            });

            //mete los nodos a la grafica
            let i = 1;
            this.colaPrioridad.forEach((nodoHuffman) => {
                console.log(nodoHuffman)
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
                });
                i++;
            });
            this.cy.zoom(0.7);
            this.AlgoritmoHuffman(this.colaPrioridad);
        },

        async AlgoritmoHuffman(colaPrioridad) {
            let iteraciones = 0;
            while (colaPrioridad.length > 1) {
                let nodoUno = colaPrioridad.shift();
                let nodoDos = colaPrioridad.shift();

                let nuevoArbol = new NodoHuffman();
                nuevoArbol.frecuencia = nodoUno.frecuencia + nodoDos.frecuencia;
                nuevoArbol.caracter = undefined;


                nuevoArbol.izquierda = nodoUno;
                nuevoArbol.derecha = nodoDos;

                nuevoArbol.idCy = `it-${iteraciones}-${nodoUno.frecuencia}-${nodoDos.frecuencia}`

                colaPrioridad.push(nuevoArbol);

                this.animarHuffman(nodoUno.idCy, nodoDos.idCy, nuevoArbol.idCy, nuevoArbol.frecuencia, this.cy);
                await this.sleep(6000);
                colaPrioridad.sort(function(a, b) {
                    return a.frecuencia - b.frecuencia;
                });
                iteraciones++;
            }
            await this.sleep(1000);
            this.cy.center();
            this.cy.fit();
        },

        animarHuffman(idNodoUno, idNodoDos, idNuevoArbol, sumaFrecuencia, cy) {
            //obtiene un el primer nodo
            let nodo1 = cy.getElementById(idNodoUno);
            let posicionOriginal = nodo1.position('x');
            let i = 100;
            let esHoja = cy.$(`.${idNodoUno}`).length == 0;
            setTimeout(function() {
                if (esHoja) { //si el nodo es hoja se ejecuta la animacion de hoja
                    console.log('hoja');
                    nodo1.addClass(idNuevoArbol);
                    nodo1.animate({
                        position: {
                            x: nodo1.position('x'),
                            y: 400
                        },
                        style: {
                            lineColor: 'pink'
                        }
                    }, {
                        duration: 1000,
                    });

                } else { //en caso contrario, se ejecuta la animacion de arbol
                    console.log('arbol');
                    let arbol = cy.$(`.${idNodoUno}`);
                    arbol.forEach((nodo) => nodo.addClass(idNuevoArbol)); //actualizamos la nueva clase para que podamos moverlo
                    arbol.layout({
                        name: 'preset',
                        animate: true,
                        fit: false,
                        transform: (nodo) => {
                            let position = {};
                            position.x = nodo.position('x');
                            position.y = nodo.position('y') + 200;
                            i = nodo.position('x');
                            return position;
                        }
                    }).run();

                }
            }, 1000);


            //obtiene el segundo nodo
            let nodo2 = cy.getElementById(idNodoDos);
            setTimeout(function() {
                if (cy.$(`.${idNodoDos}`).length == 0) { //si el nodo es hoja se ejecuta la animacion de hoja
                    console.log('hoja');
                    nodo2.addClass(idNuevoArbol);
                    nodo2.animate({
                        position: {
                            x: nodo1.position('x') + 100,
                            y: 400
                        },
                        style: {
                            lineColor: 'pink'
                        }
                    }, {
                        duration: 1000,
                    });

                } else { //en caso contrario, se ejecuta la animacion de arbol
                    console.log('arbol');
                    console.log(nodo1.position('x'));
                    let arbol = cy.$(`.${idNodoDos}`);
                    arbol.forEach((nodo) => nodo.addClass(idNuevoArbol)); //actualizamos la nueva clase para que podamos moverlo
                    arbol.layout({
                        name: 'preset',
                        animate: true,
                        fit: false,
                        transform: (nodo) => {
                            let position = {};
                            position.x = nodo.position('x') + nodo1.position('x'); //poner a la izquierda del arbol 1
                            position.y = nodo.position('y') + 200;
                            i += 70;
                            return position;
                        }
                    }).run();

                }
            }, 2000);





            //agregamos nodo de huffman
            setTimeout(function() {
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




            //agregamos izquierda
            setTimeout(function() {
                cy.add({
                    data: {
                        id: `.${idNuevoArbol}-izq`,
                        source: idNuevoArbol,
                        target: idNodoUno
                    }
                });
            }, 4000);


            //agregamos derecha
            setTimeout(function() {
                cy.add({
                    data: {
                        id: `.${idNuevoArbol}-der`,
                        source: idNuevoArbol,
                        target: idNodoDos
                    }
                });
            }, 5000);




            setTimeout(function() {
                let arbol = cy.$(`.${idNuevoArbol}`);
                arbol.layout({
                    name: 'preset',
                    animate: true,
                    fit: false,
                    transform: (nodo) => {
                        let position = {};
                        position.x = nodo.position('x'); //colaPrioridad.length 

                        position.y = nodo.position('y') - 100;
                        return position;
                    }
                }).run();
            }, 6000);
        }




    },

}