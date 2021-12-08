class info extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
    
            <h1>
                Holaa
            </h1>
        `;
    }
}

window.customElements.define("v-info", info);