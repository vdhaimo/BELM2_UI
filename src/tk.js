

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const btdevicelist = document.getElementById("listholder")


var splashScreen = document.getElementById('splashscreen');
let stateCheck = setInterval(() => {
    if (document.readyState === 'complete') {
        splashScreen.style.display = 'none';
        clearInterval(stateCheck);

    }
}, 100);


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

function permissionsdenied() {
    closeDevices();
}

function clear() {

    btdevicelistMain.classList.remove('slide-in');
    btdevicelistMain.classList.add('slide-out');


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
                if (element.address == vehicle.jsn.devadd) h.setAttribute('righttext', vehicle.jsn.name);
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





const navbarbuttons = document.getElementsByClassName("navbarbutton");

function toggleNavbarButtons(btn) {


    Array.prototype.forEach.call(navbarbuttons, element => {

        element.setAttribute('active', 'none');

    });
    navbarbuttons[btn].setAttribute('active', 'yes');
}



const connectionbar = document.getElementsByClassName("vehicleconnection");




const editvehicleOptn = document.getElementById("editVehicle");
const editHeading = document.getElementById("editvehheading");
const editvehicleClosebutton = document.getElementById("vehicleeditclose");

var isNw;
function editvehicle(isNew) {


    isNw = isNew;

    if (isNew) {

        fueltypeselector.value = 1;
        vehicleName.value = "";
        cc.value = "";

    } else if (selectedVcard) {

        vehiclelist.forEach(vehicle => {
            if (vehicle.vin == selectedVcard.getAttribute('vin')) {
                fueltypeselector.value = vehicle.jsn.fuel;
                vehicleName.value = vehicle.jsn.name;
                cc.value = vehicle.jsn.cc;
            }
        });


    }

    editHeading.innerHTML = isNew ? "Create Vehicle" : "Edit Vehicle";
    editvehicleClosebutton.style.display = isNew ? 'none' : 'flex';


    editvehicleOptn.style.display = 'block';

    editvehicleOptn.classList.remove('slide-out')
    editvehicleOptn.classList.add('slide-in')

}

function editvehicleclose(isSave) {


    if (isSave && saveVehicle()) {

        editvehicleOptn.classList.remove('slide-in')
        editvehicleOptn.classList.add('slide-out')
    }

    else {
        editvehicleOptn.classList.remove('slide-in')
        editvehicleOptn.classList.add('slide-out')
    }


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


    vehicles.forEach(item => {
        if (item.vin && item.jsn && item.jsn.name && item.jsn.cc && item.jsn.fuel) vehiclelist.push(item);
    });

    populateHomescreen(!vehiclelist.length);

    lastDevice();

    return "read";

}

function existingConnection(address, vid) {

    document.getElementById('dlog2').innerHTML = address;

    vehiclelist.forEach((vh) => {
        if (vh.vin == vid) connectedVehicleID(vh.vin, address);
    });
}


function connectedVehicleID(id, mac) {

    closeDevices();

    document.getElementById('dlog2').innerHTML = id;

    connectedvehicleid = id;

    lastdeviceMAC = mac;

    Cookies.set('lastMAC', lastdeviceMAC);

    var tr = false;
    vehiclelist.forEach(element => {
        if (element.vin == id) {
            //connected to element update card


            vlis.forEach(lmnt => {
                if (lmnt.getAttribute('vin') == id) {
                    connectedVCard = lmnt;
                    connectedVCard.setAttribute('com', 'elm');
                    selectVehicle(element);
                }
            });

            if (element.jsn.devadd != mac) {
                //save new mac address
                element.jsn.devadd = mac;
                XAPI.saveVehicle(element.vin, JSON.stringify(element.jsn));

            }
            tr = true;

            //set vehicle paramaeters for drive
            drive_vehicleParams(element);
        } else if (element.jsn.devadd == mac) {
            //remove duplicate mac
            element.jsn.devadd = "nal";
            XAPI.saveVehicle(element.vin, JSON.stringify(element.jsn));
        }
    });

    vlis.forEach(item => {
        if (item.getAttribute('vin') == id) connectedVCard = item;
    });


    //vehicle does not exist

    //create vehicle
    if (!tr) editvehicle(true);
}

var fueltypeselector = document.getElementById("FuelType");
var vehicleName = document.getElementById("lname");
var cc = document.getElementById("lcc");
function fuelTypeChanged() {

}

function saveVehicle() {

    var nm = vehicleName.value;

    if (nm.length < 4) {
        XAPI.showToast("Name should be at least 4 characters long");
        return false;
    }

    var _fuel = fueltypeselector.value;

    var c_c = parseInt(cc.value);

    if (isNaN(c_c)) {
        XAPI.showToast("Invalid Displacement")
        return false;
    }

    if (isNw) {
        XAPI.saveVehicle(connectedvehicleid, JSON.stringify({ name: nm, cc: c_c, fuel: _fuel, devadd: lastdeviceMAC }));
        isNw = false;
    }
    else if (selectedVcard) {

        vehiclelist.forEach(element => {
            if (element.vin == selectedVcard.getAttribute('vin')) {
                element.jsn.name = nm;
                element.jsn.cc = c_c;
                element.jsn.fuel = _fuel;
                XAPI.saveVehicle(element.vin, JSON.stringify(element.jsn));
                return true;
            }
        });

    }
}


const vehicleCard = document.getElementById("curvehcard");

const devicesOption = document.getElementById("option_devices");

const editOption = document.getElementById("option_edit");

const deleteOption = document.getElementById("option_delete");


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

        var dt = vh.jsn.cc + " cc" + " | " + FUELS[vh.jsn.fuel].NAME;
        uploadtolist(vh.jsn.name, dt, "", "", vh.vin);
    });
}

function connectVehicle(isconnect) {


    if (!selectedVcard) return;

    vehiclelist.forEach(vehicle => {
        if (vehicle.vin == selectedVcard.getAttribute('vin')) {

            if (isconnect) {
                connectedVCard = selectedVcard;
                selectVcard(selectedVcard, null);
                XAPI.connectdevice(vehicle.jsn.devadd);
            }

            else {
                XAPI.disconnectCurrent();
            }

        }
    });

}


function connectStatus(status) {


    //0 connected
    //1 trying
    //2 failall
    switch (status) {
        case '0':

            XAPI.showToast('Connected')
            selectedVcard.setAttribute('constat', 'Connected')

            break;
        case '1':

            selectedVcard.setAttribute('constat', 'connecting..')

            break;
        case '2':
            vlis.forEach(item => { item.setAttribute('constat', ""); });

            if (connectedVCard) connectedVCard.setAttribute('com', 'val');
            // change disconnect button to connect
            connectedVCard = null;
            selectVcard(selectedVcard, null);

            drivestatus(null);

            XAPI.showToast('Disconnected')
            break;
    }
}

function elmStatus(status) {
    console.log(status);
}


//card
const cvName = document.getElementById('vname');
const cvD = document.getElementById('vehicledetails');

const ecuLamp = document.getElementById('vehicleconnection');
const ecuStatus = document.getElementById('connectstatus');

var lastdeviceMAC = Cookies.get('lastMAC');
var connectedvehicleid;
function lastDevice() {

    if (!lastdeviceMAC) return;

    vehiclelist.forEach(vehicle => {
        if (vehicle.jsn.devadd == lastdeviceMAC) selectVehicle(vehicle);
    });
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

    var updated = false;
    vlis.forEach(item => {
        if (item.getAttribute('vin') == vin) {
            item.setAttribute('vnm', name);
            item.setAttribute('vdtl', details);
            item.setAttribute('com', com);
            item.setAttribute('constat', constat);
            item.setAttribute('select', 'none');
            updated = true;
            return;
        }
    });

    if (updated) return;


    var h = document.createElement('bt-vehiclecard');
    h.setAttribute('vnm', name);
    h.setAttribute('vdtl', details);
    h.setAttribute('com', com);
    h.setAttribute('constat', constat);
    h.setAttribute('select', 'none');
    h.setAttribute('vin', vin);

    h.addEventListener('click', function (event) {
        parent.selectVcard(h, null);
    });


    cardhodler.appendChild(h);

    vlis.push(h);

}

var connectedVCard;
var selectedVcard;

function selectVehicle(vehicle) {



    vlis.forEach(element => {
        if (element.getAttribute('vin') == vehicle.vin) {

            selectVcard(element, vehicle);



            return;
        }
    });
}


function selectVcard(element, vehicle) {


    let _vin = element.getAttribute('vin')
    if (!vehicle) vehiclelist.forEach(vh => {
        if (vh.vin == _vin) vehicle = vh;
    });



    //deselect
    vlis.forEach(lmnt => {
        lmnt.setAttribute('select', 'none');
    });

    //select
    element.setAttribute('select', 'yes');
    element.scrollIntoView({ behavior: 'smooth' });

    editOption.style.display = 'block';

    connectOption.setAttribute('smalltext', vehicle.jsn.devadd);
    disconnectOption.setAttribute('smalltext', vehicle.jsn.devadd);

    if (connectedVCard && element == connectedVCard) {
        connectOption.style.display = 'none';
        disconnectOption.style.display = 'block';
        editOption.style.display = 'none';
        deleteOption.style.display = 'none';
    } else {
        connectOption.style.display = 'block';
        disconnectOption.style.display = 'none';
        editOption.style.display = 'block';
        deleteOption.style.display = 'block';
    }

    selectedVcard = element;




}





function updateReceived(string) {
    if (connectedVCard) {
        connectedVCard.setAttribute('com', 'val');
        vupdate(string);
    }
}


const tabs = [document.querySelector('.home'),
document.querySelector('.drive'),
document.querySelector('.trips'),
document.querySelector('.settings')];


tabs.forEach(tab => {

    tab.style.display = 'none';

    tab.addEventListener("animationend", (event) => {
        if (event.animationName == 'OFL' || event.animationName == 'OFR') {

            tab.style.display = 'none';
        }
    });
});

function selectTab(n) {

    toggleNavbarButtons(n);

    var ii = false;

    tabs.forEach(function (tab, index) {

        if (tab.style.display == 'block') {

            // slide in slide out logic
            if (index < n) {
                //slide out left
                tab.classList.remove('ifl');
                tab.classList.remove('ifr');
                tab.classList.remove('ofl');
                tab.classList.add('ofr');

            }
            if (index > n) {
                //slide out right
                tab.classList.remove('ifl');
                tab.classList.remove('ifr');
                tab.classList.add('ofl');
                tab.classList.remove('ofr');

            }

            ii = true;

        }

        if (index == n) {

            if (tab.style.display == 'block') return;

            tab.style.display = 'block';
            if (ii) {
                //slide in right                
                tab.classList.add('ifl');
                tab.classList.remove('ifr');
                tab.classList.remove('ofl');
                tab.classList.remove('ofr');
            }
            else {
                //slide in left
                tab.classList.remove('ifl');
                tab.classList.add('ifr');
                tab.classList.remove('ofl');
                tab.classList.remove('ofr');
            }

        }

    });



}

selectTab(0);



// prompt

let promptbox = document.querySelector(".promptbox");
let prompttext = document.querySelector(".prompttext");

let promptback = document.querySelector('.prompt');

promptback.onclick = function (e) {

    var ev = e || window.event;
    if (e.target !== this)
        return;
    promptcance();
}

promptbox.addEventListener("animationend", (event) => {
    if (event.animationName == 'prslideOut') {

        promptback.style.display = 'none';


    }
});

function prcs() {
    console.log('rere')
}

var onPromptOk;

function showPrompt(text, onok) {
    onPromptOk = onok;
    promptback.style.display = 'block';
    prompttext.innerHTML = text;
    promptbox.classList.remove('pslide-out');
    promptbox.classList.add('pslide-in');


}

function promptok() {
    if (onPromptOk) eval(onPromptOk + "()");
    escprmt();
}

function promptcance() {
    onPromptOk = undefined;
    escprmt();
}

function escprmt() {
    promptbox.classList.add('pslide-out');
    promptbox.classList.remove('pslide-in');
}




function deletevehicle() {
    showPrompt("Delete current vehicle data?", "confirmdeletevehicle");
}

function confirmdeletevehicle() {
    if (selectedVcard) {
        XAPI.deletevehicleanddata(selectedVcard.getAttribute('vin'));
    }
}