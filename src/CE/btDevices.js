



class btListItem extends HTMLElement {

    constructor() {
        super();

        let template = document.getElementById("tp-btdevlistitem");

        const shadowRoot = this.attachShadow({ mode: "closed" });
        const content = template.content.cloneNode(true);



        this.BIGTEXT = content.querySelector('#bigtext');
        this.SMALLTEXT = content.querySelector('#smalltext');
        this.RIGHTTEXT = content.querySelector('#righttext');

        shadowRoot.appendChild(content);

    }

    connectedCallback() {

        this.addEventListener('click', function (event) {
            btlistitemclicked(event.target.getAttribute('smalltext'));
        });

    }

    static get observedAttributes() {
        return ['bigtext', 'smalltext', 'righttext'];
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'bigtext') {
            // Update the element's content based on the new attribute value
            this.BIGTEXT.innerHTML = newValue;
        }
        if (name === 'smalltext') {
            // Update the element's content based on the new attribute value
            this.SMALLTEXT.innerHTML = newValue;
        }
        if (name === 'righttext') {
            this.RIGHTTEXT.innerHTML = newValue;
        }
    }


}



// Define the custom element
window.customElements.define('bt-listitem', btListItem);


class btVehicleCard extends HTMLElement {

    constructor() {
        super();

        let template = document.getElementById("tp-vehiclecard");

        const shadowRoot = this.attachShadow({ mode: "closed" });
        const content = template.content.cloneNode(true);


        this.MAIN = content.querySelector('#main');
        this.COM = content.querySelector('#com');
        this.CONSTAT = content.querySelector('#connectionstat');
        this.VNAME = content.querySelector('#vname');
        this.VDTL = content.querySelector('#vdetails');
        this.TTS = content.querySelector('#tapinstr');


        shadowRoot.appendChild(content);

    }

    connectedCallback() {

        /*
                this.addEventListener('click', function (event) {
                    btlistitemclicked(event.target.getAttribute('smalltext'));
                });    */

    }

    static get observedAttributes() {
        return ['com', 'constat', 'vnm', 'vdtl', 'select', 'vin'];
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'com') {
            // Update the element's content based on the new attribute value
            this.COM.style.display = 'none';
            this.COM.style.display = 'block';
        }
        if (name === 'constat') {
            // Update the element's content based on the new attribute value
            this.CONSTAT.innerHTML = newValue;


        }
        if (name === 'vnm') {
            this.VNAME.innerHTML = newValue;
        }
        if (name === 'vdtl') {
            this.VDTL.innerHTML = newValue;
        }
        if (name === 'select') {
            if (newValue === 'yes') {
                this.MAIN.style.opacity = 1;
                this.COM.style.opacity = 1;
                this.CONSTAT.style.opacity = 1;
                this.VNAME.style.opacity = 1;
                this.VDTL.style.opacity = 1;
                this.TTS.style.display = 'none';
            }
            else {
                this.MAIN.style.opacity = 0.5;
                this.COM.style.opacity = 0.5;
                this.CONSTAT.style.opacity = 0.5;
                this.VNAME.style.opacity = 0.5;
                this.VDTL.style.opacity = 0.5;
                this.TTS.style.display = 'block';
            }

        }
    }


}



// Define the custom element
window.customElements.define('bt-vehiclecard', btVehicleCard);





class tpiconbutton extends HTMLElement {
    constructor() {

        super();

        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,100,0,0');


        let template = document.getElementById("tp-iconbutton");

        const shadowRoot = this.attachShadow({ mode: "closed" });
        const content = template.content.cloneNode(true);


        this.ICON = content.querySelector('.material-symbols-outlined');
        this.DESC = content.querySelector('.maticonbtext');
        this.MAIN = content.querySelector('.mmain');

        shadowRoot.appendChild(linkElem);
        shadowRoot.appendChild(content);

    }

    connectedCallback() {
        this.addEventListener('click', function (event) {
            window[event.target.getAttribute('callback')]();
        });
    }

    static get observedAttributes() {
        return ['icon', 'desc', 'active', 'callback'];
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
        if (name === 'active') {
            if (newValue === 'yes') {
                this.MAIN.style.opacity = 1;
                this.MAIN.style.color = getComputedStyle(this.MAIN).getPropertyValue('--c0');

            }
            else {
                this.MAIN.style.opacity = 0.5;
                this.MAIN.style.color = getComputedStyle(this.MAIN).getPropertyValue('--text-colorA');
            }
        }
    }


}

window.customElements.define('bt-iconmatbutton', tpiconbutton, { mode: 'no-encapsulation' });





class btCardX1 extends HTMLElement {

    constructor() {
        super();

        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,100,0,0');


        let template = document.getElementById("tp-cardX1");

        const shadowRoot = this.attachShadow({ mode: "closed" });
        const content = template.content.cloneNode(true);



        this.BIGTEXT = content.querySelector('#bigtext')
        this.SMALLTEXT = content.querySelector('#smalltext')
        this.ICON = content.querySelector('#icn')


        shadowRoot.appendChild(linkElem);
        shadowRoot.appendChild(content);

    }

    connectedCallback() {



    }

    static get observedAttributes() {
        return ['bigtext', 'smalltext', 'icon'];
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
        if (name === 'icon') {
            // Update the element's content based on the new attribute value
            this.ICON.innerHTML = newValue
        }
    }


}



// Define the custom element
window.customElements.define('bt-cardx1', btCardX1);







