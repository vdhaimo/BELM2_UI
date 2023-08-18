

var tripsjs = this;

var tripsListHolder = document.querySelector('.tripslistholder');


var trlist = [];
var triplogs = [];


function readLogs(loglist) {

    while (tripsListHolder.firstChild) {
        tripsListHolder.removeChild(tripsListHolder.lastChild);
    }

    triplogs = loglist.slice().reverse();

    triplogs.forEach(log => {
        var dmx = demuxFileName(log);

        vehiclelist.forEach(vh => {
            if (vh.vin == dmx[1]) {

                //create log entry
                var h = document.createElement('bt-cardx1');
                h.setAttribute('bigtext', vh.name);
                h.setAttribute('smalltext', dmx[2]);
                h.setAttribute('icon', 'stop');

                h.addEventListener('click', function (event) {
                    tripsjs.selectLogFile(h);
                });


                tripsListHolder.appendChild(h);


                trlist.push(h);


            }
        });
    });

    if (trlist.length > 0) selectLogFile(trlist[0]);


}

const tripcard_vname = document.getElementById('tcvehicle');
const tripcard_logtstamp = document.getElementById('tctstamp');

function selectLogFile(h) {

    var idx = trlist.indexOf(h);
    if (idx == undefined || triplogs.length < idx) return;
    trlist.forEach(element => { element.setAttribute('selected', 'no'); });
    h.setAttribute('selected', 'yes');

    tripcard_vname.innerHTML = h.getAttribute('bigtext');
    tripcard_logtstamp.innerHTML = h.getAttribute('smalltext');

    sendReadFileReq(triplogs[idx]);

}


function demuxFileName(name) {
    return name.split('.txt')[0].split('&&');
}


if (!ispc) XAPI.readTrips();



function sendReadFileReq(filename) {

    XAPI.readLogFile(filename);

}

var coords = [], data = [], td = [];

const mfactor = [
    1,
    16,//FuelSystemStatus
    1,//MAP
    0.05,//RPM
    1,//VehicleSpeed
    1,//IntakeTemp
    2.5,//MAF
    100,//eqAFR
    2,//loadCalc
    0.01//loadAbs
];

function fileRead(json) {



    coords = [];
    data = [];
    td = [];

    var lastCoord = [], dcml = 0;



    json.forEach(element => {

        var arr = element.split('\t');
        if (arr.length > 3) data.push(arr);
        else {
            coords.push([arr[1], arr[2]]);
            if (lastCoord.length < 1) td.push([arr[0], dcml]);
            else {
                const delta = turf.distance(turf.point(lastCoord), turf.point([arr[1], arr[2]]), { units: 'kilometers' });

                if (data.length > 0) {
                    //loop last elements from data till time < last td element time                    
                    const lasttd = td[td.length - 1];

                    var i = 1;
                    while (data[data.length - i] && data[data.length - i][0] > lasttd[0]) {

                        data[data.length - i][0] = dcml + delta * (data[data.length - i][0] - lasttd[0]) / (arr[0] - lasttd[0]);

                        i++;
                    }
                }

                dcml += delta;
                td.push([arr[0], dcml]);
            }

            lastCoord = [arr[1], arr[2]];
        }


    });



    data.forEach(entry => {
        entry[0] = entry[0] / dcml;
    });


    var ar = [];

    data.forEach(entry => {
        if (entry[0] <= 1) {
            ar.push(entry[0]);
            ar.push(hslToHex(mfactor[8] * entry[8], 100, 50));
        }
    });

    addPath(coords);

    loadMetric(1);



    if (tripsList.style.display == 'block') openTripsList();
}

function loadMetric(m) {

    if (!data) return;

    var ar = [];



    data.forEach(entry => {
        if (entry[0] <= 1) {
            ar.push(entry[0]);
            ar.push(hslToHex(mfactor[m] * entry[m], 100, 50));
        }
    });

    updatepath(ar);
}




function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}


const expandbutton = document.querySelector('#opentripslist');
var tripsList = document.querySelector('.tripslistholder');

tripsList.addEventListener("animationend", (event) => {
    if (event.animationName == 'collap') {
        tripsList.style.display = 'none';
    }
});

function openTripsList() {


    if (tripsList.style.display != 'block') {

        tripsList.style.display = 'block';
        expandbutton.setAttribute('icon', 'map');
        expandbutton.setAttribute('desc', 'Map');
        tripsList.classList.remove('col');
        tripsList.classList.add('exp');


    } else {
        expandbutton.setAttribute('icon', 'list_alt');
        expandbutton.setAttribute('desc', 'Trips');
        tripsList.classList.add('col');
        tripsList.classList.remove('exp');

    }


}


var layerslist = document.querySelector('.layerslist');
var layersbutton = document.getElementById('layersbt');
function layers_button_clicked() {


    if (layerslist.clientWidth < '150') {

        hidelayes(false);

    } else {

        hidelayes(true);
    }
}

function hidelayes(hide) {

    if (!hide) {
        if (layerslist.clientWidth > '0') return;
        layerslist.classList.remove('layerscol');
        layerslist.classList.add('layersexp');

        layersbutton.setAttribute('icon', 'keyboard_arrow_right');

    } else {
        if (layerslist.clientWidth < '150') return;
        layerslist.classList.remove('layersexp');
        layerslist.classList.add('layerscol');

    }
}

layerslist.addEventListener("animationend", (event) => {

    layerslist.classList.remove('layersexp');
    layerslist.classList.remove('layerscol');


    if (event.animationName == 'lexpand') {


        //change button icon
        layerslist.style.width = '150px';

    }
    if (event.animationName == 'lcollap') {


        //change button icon
        layerslist.style.width = '0';

        layersbutton.setAttribute('icon', 'layers');

    }


});


let layernames = document.getElementsByClassName('layerop');

Array.from(layernames).forEach(function (element, index) {
    element.addEventListener("click", function () {

        layerSelected(index);
    });
});




function layerSelected(idx) {

    Array.from(layernames).forEach(function (el, iidx) {
        if (iidx == idx) {
            el.style.opacity = 1;
        }
        else {
            el.style.opacity = 0.3;
        }
    });

    switch (idx) {
        case 0:
            // Fuel Consumption
            break;
        case 1:
            // Drive ratio
            break;
        //_______________________________//
        case 2:
            // Fuel sys stat
            loadMetric(1);
            break;
        case 3:
            // MAP
            loadMetric(2);
            break;
        case 4:
            // RPM
            loadMetric(3);
            break;
        case 5:
            // Speed
            loadMetric(4);
            break;
        case 6:
            // Intake temp
            loadMetric(5);
            break;
        case 7:
            // MAF
            loadMetric(6);
            break;
        case 8:
            // AFR
            loadMetric(7);
            break;
        case 9:
            // Calc Load
            loadMetric(8);
            break;
        case 10:
            // Abs Load
            loadMetric(9);
            break;
        default:
            return;
    }

}
