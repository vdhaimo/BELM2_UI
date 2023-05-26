

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const btdevicelist = document.getElementById("listholder")


const btdevicelistMain = document.getElementById('selectBTdevices')
btdevicelistMain.addEventListener("animationend", (event) => {
    if (event.animationName == 'slideOut') {
        while (btdevicelist.firstChild) {
            btdevicelist.removeChild(btdevicelist.lastChild);
        }
        btdevicelistMain.style.display = 'none';
    }
});


function closeDevices() {
    clear();
    if (!ispc) XAPI.stopDeviceRead();

}


function clear() {

    btdevicelistMain.classList.remove('slide-in')
    btdevicelistMain.classList.add('slide-out')


}


function load() {
    if (!ispc) XAPI.readDevices();

    btdevicelistMain.style.display = 'block';

    btdevicelistMain.classList.remove('slide-out')
    btdevicelistMain.classList.add('slide-in')



}


function onDeviceRead(dname, dadd, dtype) {



    var h = document.createElement('bt-listitem');
    h.setAttribute('bigtext', dname);
    h.setAttribute('smalltext', dadd);

    btdevicelist.appendChild(h);


}

function btlistitemclicked(addr) {
    if (!XAPI.ispc) XAPI.connectdevice(addr);
}

function rer() {
    console.log('capybara')
}
// program to generate random strings





const navbarbuttons = document.getElementsByClassName("navbarbutton");

function toggleNavbarButtons(btn) {


    Array.prototype.forEach.call(navbarbuttons, element => {

        element.setAttribute('active', 'none');

    });
    navbarbuttons[btn].setAttribute('active', 'yes');
}

function navbar_link() {
    toggleNavbarButtons(0);
}
function navbar_drive() {
    toggleNavbarButtons(1);
}
function navbar_trips() {
    toggleNavbarButtons(2);
}
function navbar_settings() {
    toggleNavbarButtons(3);
}


const connectionbar = document.getElementsByClassName("vehicleconnection");

var i = 32
Array.prototype.forEach.call(connectionbar, element => {

    element.style.left = i + 'px';

    i += 10;
});


const editvehicleOptn = document.getElementById("editVehicle");

function editvehicle() {

    editvehicleOptn.style.display = 'block';

    editvehicleOptn.classList.remove('slide-out')
    editvehicleOptn.classList.add('slide-in')

}

function editvehicleclose(isSave) {
    editvehicleOptn.classList.remove('slide-in')
    editvehicleOptn.classList.add('slide-out')
}

editvehicleOptn.addEventListener("animationend", (event) => {
    if (event.animationName == 'slideOut') {
        editvehicleOptn.style.display = 'none';
    }
});



if (!ispc) XAPI.showMsg("fname", "pswd");

