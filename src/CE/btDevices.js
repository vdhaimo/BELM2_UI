



class btListItem extends HTMLElement {
    constructor() {

        super();

        let template = document.getElementById("tp-btdevlistitem");
        let templateContent = template.content;

        const shadowRoot = this.attachShadow({ mode: "open" });
        const content = template.content.cloneNode(true);

        this.BIGTEXT = content.querySelector('#bigtext')
        this.SMALLTEXT = content.querySelector('#smalltext')

        shadowRoot.appendChild(content);

    }

    connectedCallback() {

    }

    static get observedAttributes() {
        return ['bigtext', 'smalltext'];
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'bigtext') {
            // Update the element's content based on the new attribute value
            this.BIGTEXT.innerHTML = newValue
        }
        if (name === 'smalltext') {
            // Update the element's content based on the new attribute value
            this.SMALLTEXT.innerHTML = newValue
        }
    }


}



// Define the custom element
window.customElements.define('bt-listitem', btListItem);





