

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const btdevicelist = document.getElementById("listholder")


const btdevicelistMain = document.getElementById('selectBTdevices')
btdevicelistMain.addEventListener("animationend", (event) => {
    if (event.animationName == 'slideOut') {
        while (btdevicelist.firstChild) {
            btdevicelist.removeChild(btdevicelist.lastChild);
        }
    }
});

var n = 20

function closeDevices() {
    clear();
}


function clear() {

    btdevicelistMain.classList.remove('slide-in')
    btdevicelistMain.classList.add('slide-out')


}


function load() {

    btdevicelistMain.classList.remove('slide-out')
    btdevicelistMain.classList.add('slide-in')


    i = n
    while (i > 0) {

        var h = document.createElement('bt-listitem');
        h.setAttribute('bigtext', generateString(5));
        h.setAttribute('smalltext', generateString(8));
        btdevicelist.appendChild(h);

        i--
    }


}

load()

// program to generate random strings

// declare all characters

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
