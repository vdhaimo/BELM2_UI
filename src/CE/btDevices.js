



class btListItem extends HTMLElement {

    constructor() {
        super();

        let template = document.getElementById("tp-btdevlistitem");

        const shadowRoot = this.attachShadow({ mode: "open" });
        const content = template.content.cloneNode(true);



        this.BIGTEXT = content.querySelector('#bigtext')
        this.SMALLTEXT = content.querySelector('#smalltext')

        shadowRoot.appendChild(content);

    }

    connectedCallback() {


        this.addEventListener('click', function (event) {
            btlistitemclicked(event.target.getAttribute('smalltext'));
        });

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





class tpiconbutton extends HTMLElement {
    constructor() {

        super();

        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,100,0,0');


        let template = document.getElementById("tp-iconbutton");

        const shadowRoot = this.attachShadow({ mode: "closed" });
        const content = template.content.cloneNode(true);


        this.ICON = content.querySelector('.material-symbols-outlined')
        this.DESC = content.querySelector('.maticonbtext')

        shadowRoot.appendChild(linkElem);
        shadowRoot.appendChild(content);

    }

    connectedCallback() {
        this.addEventListener('click', function (event) {
            window[event.target.getAttribute('callback')]();
        });
    }

    static get observedAttributes() {
        return ['icon', 'desc', 'callback'];
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'icon') {
            // Update the element's content based on the new attribute value
            this.ICON.innerHTML = newValue
        }
        if (name === 'desc') {
            // Update the element's content based on the new attribute value
            this.DESC.innerHTML = newValue
        }
    }


}

window.customElements.define('bt-iconmatbutton', tpiconbutton, { mode: 'no-encapsulation' });





