import VisualizadorHuffman from "./componentes/VisualizadorHuffman.js";

window.addEventListener('load', () => {
    new Vue({
        el: '#app',
        components: {
            'visualizador-huffman': VisualizadorHuffman
        },
        data: () => ({
            cadena: '',
        }),
        methods: {

        },
        computed: {

        },
        vuetify: new Vuetify(),
    })
})