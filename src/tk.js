

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

    console.log(devices);

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


function pairNewDevice() {
    XAPI.pairNewDevice();
}


var vehiclelist = []

function readVehicles(vehicles) {


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

    connectedvehicleid = id;

    lastdeviceMAC = mac;

    vehiclelist.forEach(element => {
        if (element.vin == id) {
            //connected to element update card

            selectVehicle(element);



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


const vehicleCard = document.getElementById("curvehcard");

const devicesOption = document.getElementById("option_devices");

const editOption = document.getElementById("option_edit");


const connectOption = document.getElementById("option_connect");
const disconnectOption = document.getElementById("option_disconnect");


function populateHomescreen(noVehicles) {

    if (noVehicles) {
        vehicleCard.style.display = 'none';
        editOption.style.display = 'none';
        devicesOption.style.display = 'block';
        connectOption.style.display = 'none';
        disconnectOption.style.display = 'none';
    }
    else {
        vehicleCard.style.display = 'flex';
        editOption.style.display = 'block';
        devicesOption.style.display = 'block';
    }

}

function connectVehicle(isconnect) {

}

//card
const cvName = document.getElementById('vname');
const cvD = document.getElementById('vehicledetails');

const ecuLamp = document.getElementById('vehicleconnection');
const ecuStatus = document.getElementById('connectstatus');

var lastdeviceMAC = ""
function lastDevice(mac) {
    lastdeviceMAC = mac;
}




function updatevehiclecard(vehicleid) {




}

function navVards(inc) {



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
        selectVcard(h);
    });


    cardhodler.appendChild(h);

    vlis.push(h);

}

var connectedVCard;

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


}




uploadtolist('Bolt', '1200 cc| Petrol', 'das', 'asd')
uploadtolist('Fiesta', '1400 cc| Petrol', 'das', 'asd')
uploadtolist('i20', '1200 cc| Petrol', 'das', 'asd')
uploadtolist('Idc', '1500 cc| Petrol', 'das', 'asd')