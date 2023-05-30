

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
const editHeading = document.getElementById("editvehheading");
const editvehicleClosebutton = document.getElementById("vehicleeditclose");

function editvehicle(isNew) {


    editHeading.innerHTML = isNew ? "Create Vehicle" : "Edit Vehicle";
    editvehicleClosebutton.style.display = isNew ? 'none' : 'flex';


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


var vehiclelist = []

function readVehicles(vehicles) {

    console.log(vehicles);

    var vhs = []

    for (vh in vehicles) {
        var updated = false;
        vhs.forEach(element => {
            if (element.vin == vh.vin) {
                element = vh;
                updated = true;
            }
        });
        if (!updated) vhs.push(vh);

    }


    if (vehicles.length > 2) {
        vehicles.sort((a, b) => {
            const vinA = a.vin;
            const vinB = b.vin;
            if (vinA < vinB) {
                return -1; // a should be placed before b
            }
            if (vinA > vinB) {
                return 1; // b should be placed before a
            }
            return 0; // names are equal, maintain the order
        });
    }

    vehiclelist = vehicles;

    populateHomescreen(vehiclelist.length < 1);


    return "read";

}


function connectedVehicleID(id, mac) {

    connectedvehicleid = id;

    vehiclelist.forEach(element => {
        if (element.vin == id) {
            //connected to element update card
            editOption.setAttribute('smalltext', element.name);
            devicesOption.setAttribute('smalltext', mac);


            if (element.mac != mac) {
                //save new
                XAPI.saveEditedVehicle(element.vin, element.name, element.cc, element.conm, mac);

            }
            return;
        }
    });


    //vehicle does not exist

    //create vehicle
    editvehicle(true);
}

var fueltypeselector = document.getElementById("FuelType");
var vehicleName = document.getElementById("lname");
var cc = document.getElementById("lcc");
function fuelTypeChanged() {

}

function saveVehicle() {

    var nm = vehicleName.value;

    if (nm.length < 4) {
        XAPI.showToast("Name should be at least 4 characters long")
        return;
    }

    var fuel = fueltypeselector.value;

    var c_c = parseInt(cc.value);

    if (isNaN(c_c)) {
        XAPI.showToast("Invalid Displacement")
        return;
    }

    XAPI.saveVehicle(nm, c_c, fuel);
}


const vehicleCard = document.getElementById("currentvehiclecard");

const devicesOption = document.getElementById("option_devices");

const editOption = document.getElementById("option_edit");

const nodevsOption = document.getElementById("option_nodevs");


function populateHomescreen(noVehicles) {

    if (noVehicles) {
        vehicleCard.style.display = 'none';
        editOption.style.display = 'none';
        devicesOption.style.display = 'none';
        nodevsOption.style.display = 'block';
    }
    else {
        vehicleCard.style.display = 'block';
        editOption.style.display = 'block';
        devicesOption.style.display = 'block';
        nodevsOption.style.display = 'none';
    }

}

//card
const cvName = document.getElementById('vname');
const cvD = document.getElementById('vehicledetails');

const ecuLamp = document.getElementById('vehicleconnection');
const ecuStatus = document.getElementById('connectstatus');


function populateCurrentVehicleCard() {

}


XAPI.askVehicles();