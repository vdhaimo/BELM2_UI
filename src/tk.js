

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const btdevicelist = document.getElementById("listholder")


const btdevicelistMain = document.getElementById('selectBTdevices')
btdevicelistMain.addEventListener("animationend", (event) => {
    if (event.animationName == 'slideOut') {


        cleanBTlist();

        btdevicelistMain.style.display = 'none';
    }
});



function cleanBTlist() {
    while (btdevicelist.firstChild) {
        btdevicelist.removeChild(btdevicelist.lastChild);
    }

}


function closeDevices() {
    clear();

}


function clear() {

    btdevicelistMain.classList.remove('slide-in')
    btdevicelistMain.classList.add('slide-out')


}


function load() {

    searchtext.value = "";


    XAPI.read();

    btdevicelistMain.style.display = 'block';

    btdevicelistMain.classList.remove('slide-out');
    btdevicelistMain.classList.add('slide-in');


}

const searchtext = document.getElementById("btdevicesearch");
searchtext.addEventListener('input', result => {
    updateDeviceList();
});

var devices = [];

function bondedDevices(devs) {

    devices = devs;


    updateDeviceList();

}

function updateDeviceList() {

    cleanBTlist();

    var text = searchtext.value;

    devices.forEach(element => {

        if (element.name.toLowerCase().includes(text.toLowerCase()) || element.address.toLowerCase().includes(text.toLowerCase())) {
            var h = document.createElement('bt-listitem');
            h.setAttribute('bigtext', element.name);
            h.setAttribute('smalltext', element.address);
            vehiclelist.forEach(vehicle => {
                if (element.address == vehicle.devadd) h.setAttribute('righttext', vehicle.name);
            });

            btdevicelist.appendChild(h);
        }
    });



}


function btlistitemclicked(addr) {
    if (!XAPI.ispc) XAPI.connectdevice(addr);
}

function rer() {
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




const editvehicleOptn = document.getElementById("editVehicle");
const editHeading = document.getElementById("editvehheading");
const editvehicleClosebutton = document.getElementById("vehicleeditclose");

var isNw;
function editvehicle(isNew) {


    isNw = isNew;

    editHeading.innerHTML = isNew ? "Create Vehicle" : "Edit Vehicle";
    editvehicleClosebutton.style.display = isNew ? 'none' : 'flex';


    editvehicleOptn.style.display = 'block';

    editvehicleOptn.classList.remove('slide-out')
    editvehicleOptn.classList.add('slide-in')

}

function editvehicleclose(isSave) {
    editvehicleOptn.classList.remove('slide-in')
    editvehicleOptn.classList.add('slide-out')

    if (isSave) saveVehicle();


}

editvehicleOptn.addEventListener("animationend", (event) => {
    if (event.animationName == 'slideOut') {
        editvehicleOptn.style.display = 'none';
    }
});


function pairNewDevice() {
    XAPI.pairNewDevice();
}


var vehiclelist = []

function readVehicles(vehicles) {




    var vhs = []

    vehicles.forEach(vh => {
        var updated = false;
        vhs.forEach(element => {
            if (element.vin == vh.vin) {
                element = vh;
                updated = true;
            }
        });
        if (!updated) vhs.push(vh);

    });
    console.log(vhs);

    if (vhs.length > 1) {
        vhs.sort((a, b) => {
            const vinA = a.vin.toLowerCase();
            const vinB = b.vin.toLowerCase();
            if (vinA < vinB) {
                return -1; // a should be placed before b
            }
            if (vinA > vinB) {
                return 1; // b should be placed before a
            }
            return 0; // names are equal, maintain the order
        });
    }

    vehiclelist = vhs;

    populateHomescreen(!vehiclelist.length);


    return "read";

}


function connectedVehicleID(id, mac) {

    closeDevices();

    document.getElementById('dlog2').innerHTML = id;

    connectedvehicleid = id;

    lastdeviceMAC = mac;

    Cookies.set('lastMAC', lastdeviceMAC);

    vehiclelist.forEach(element => {
        if (element.vin == id) {
            //connected to element update card

            selectVehicle(element);

            vlis.forEach(lmnt => {
                if (lmnt.getAttribute('vin') == vehicle.vin) connectedVCard = lmnt;
            });


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

    if (nm.length < 2) {
        XAPI.showToast("Name should be at least 4 characters long")
        return;
    }

    var fuel = fueltypeselector.value;

    var c_c = parseInt(cc.value);

    if (isNaN(c_c)) {
        XAPI.showToast("Invalid Displacement")
        return;
    }

    if (isNw) XAPI.saveVehicle(nm, c_c, fuel);
    else if (selectVcard) {

        vehiclelist.forEach(element => {
            if (element.vin == selectVcard.getAttribute('vin')) {
                XAPI.saveEditedVehicle(element.vin, nm, c_c, element.conm, element.mac);
                return;
            }
        });

    }
}


const vehicleCard = document.getElementById("curvehcard");

const devicesOption = document.getElementById("option_devices");

const editOption = document.getElementById("option_edit");


const connectOption = document.getElementById("option_connect");
const disconnectOption = document.getElementById("option_disconnect");


function populateHomescreen(noVehicles) {


    connectOption.style.display = 'none';
    disconnectOption.style.display = 'none';

    if (noVehicles) {
        // vehicleCard.style.display = 'none';
        editOption.style.display = 'none';
        devicesOption.style.display = 'block';

    }
    else {
        // vehicleCard.style.display = 'flex';
        editOption.style.display = 'none';
        devicesOption.style.display = 'block';
    }

    vehiclelist.forEach(vh => {

        var dt = vh.cc + " cc" + " | " + FUELS[vh.fuel];
        uploadtolist(vh.name, dt, "", "", vh.vin);
    });
}

function connectVehicle(isconnect) {

}

//card
const cvName = document.getElementById('vname');
const cvD = document.getElementById('vehicledetails');

const ecuLamp = document.getElementById('vehicleconnection');
const ecuStatus = document.getElementById('connectstatus');

var lastdeviceMAC = Cookies.get('lastMAC');
function lastDevice() {

    if (!lastdeviceMAC) return;

    vehiclelist.forEach(vehicle => {
        if (vehicle.devadd == lastdeviceMAC) selectVehicle(vehicle);
    });
}




function updatevehiclecard(vehicleid) {




}






if (!ispc) XAPI.askVehicles();

var dbg = document.getElementById('dlog');

function plog(mess) {

    var str = "";
    mess.forEach(element => {
        str += element;
    });
    dbg.innerHTML = str;
}



const cardhodler = document.querySelector(".vehiclecardsholder");


var parent = this;

var vlis = [];
function uploadtolist(name, details, com, constat, vin) {



    var h = document.createElement('bt-vehiclecard');
    h.setAttribute('vnm', name);
    h.setAttribute('vdtl', details);
    h.setAttribute('com', com);
    h.setAttribute('constat', constat);
    h.setAttribute('select', 'none');
    h.setAttribute('vin', vin);

    h.addEventListener('click', function (event) {
        parent.selectVcard(h);
    });


    cardhodler.appendChild(h);

    vlis.push(h);

}

var connectedVCard;
var selectedVcard;

function selectVehicle(vehicle) {

    vlis.forEach(element => {
        if (element.getAttribute('vin') == vehicle.vin) selectVcard(element);
    });
}


function selectVcard(element) {


    //deselect
    vlis.forEach(lmnt => {
        lmnt.setAttribute('select', 'none');
    });

    //select
    element.setAttribute('select', 'yes');
    element.scrollIntoView({ behavior: 'smooth' });

    editOption.style.display = 'block';

    if (connectedVCard && element == connectedVCard) {
        connectOption.style.display = 'none';
        disconnectOption.style.display = 'block';
    } else {
        connectOption.style.display = 'block';
        disconnectOption.style.display = 'none';
    }

    selectedVcard = element;

}


/*

uploadtolist('Bolt', '1200 cc| Petrol', 'das', 'asd')
uploadtolist('Fiesta', '1400 cc| Petrol', 'das', 'asd')
uploadtolist('i20', '1200 cc| Petrol', 'das', 'asd')
uploadtolist('Idc', '1500 cc| Petrol', 'das', 'asd')*/


function updateReceived() {
    if (connectedVCard) connectedVCard.setAttribute('com', 'yes');
}