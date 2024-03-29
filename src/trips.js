

var tripsjs = this;

var tripsListHolder = document.querySelector('.tripslistholder');


var lastLayerSelected = 1;


var trlist = [];
var triplogs = [];


function readLogs(loglist) {


    trlist = [];
    triplogs = [];

    while (tripsListHolder.firstChild) {
        tripsListHolder.removeChild(tripsListHolder.lastChild);
    }


    triplogs = loglist.slice().reverse();


    triplogs.forEach(log => {
        var dmx = demuxFileName(log);



        vehiclelist.forEach(vh => {

            if (dmx.VID && vh.vin == dmx.VID) {

                //create log entry
                var h = document.createElement('bt-cardx1');
                h.setAttribute('bigtext', vh.jsn.name);
                h.setAttribute('smalltext', dmx.DATE);
                h.setAttribute('icon', 'line_end');

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
    let nn = name.split('.txt')[0].split('&&');
    return { VID: nn[1], DATE: nn[2] ? nn[2].replace(/_/g, ':') : undefined };
}




var selected_filename;
var vid_selectedtrip;
function sendReadFileReq(filename) {

    XAPI.readLogFile(filename);

    selected_filename = filename;
    vid_selectedtrip = demuxFileName(filename).VID;

}

var coords = [], data = [], td = [], markeronindex;

const mfactor = [
    1,
    1,//FuelSystemStatus
    1,//MAP
    -1,//RPM
    1,//VehicleSpeed
    -1,//IntakeTemp
    -1,//MAF
    1,//eqAFR
    -1,//loadCalc
    -1,//loadAbs
    -1,//fuelrate
    1,//fueleco
    1, //accn
    -1 //dr ratio
];

const mShift = [
    135,
    135,//FuelSystemStatus
    135,//MAP
    135,//RPM
    135,//VehicleSpeed
    135,//IntakeTemp
    135,//MAF
    135,//eqAFR
    135,//loadCalc
    135,//loadAbs
    135,//fuelrate
    0,//fueleco
    135,//accn
    275 //dr ratio
];



var nearest_globalIdx;

const tripstats_global = document.getElementById('tripstats_gl');

var fe = 0;

function fileRead(json) {




    coords = [];
    data = [];
    td = [];
    markeronindex = undefined;
    nearest_globalIdx = undefined;


    //vehiclespecs

    let trip_vehicle = getVehicleFromVIN(vid_selectedtrip);


    if (!trip_vehicle) return;

    let Engg_disp = parseFloat(trip_vehicle.jsn.cc) / 1000;
    let Fuel_Stchmr = FUELS[trip_vehicle.jsn.fuel].STCHM;
    let Fuel_Dnst = FUELS[trip_vehicle.jsn.fuel].DNST;
    let Fuel_ecn_factor = FUELS[trip_vehicle.jsn.fuel].DNST / 3600;



    cache_ed = [];

    var lastCoord = [], dcml = 0, fuel = 0, lastspeed = 0;

    var lt = 0;


    json.forEach(element => {


        var arr = element.split('\t');
        if (arr.length > 3) {

            let ddt = 0.001 * (Number(arr[0]) - Number(lt));

            ddt = lt ? ddt : 0;

            lt = arr[0];


            let ff = arr[6] ? (arr[1] == 4 && parseInt(arr[8]) < 10) ? 0 : 0.01 * parseFloat(arr[9]) * 1.184 * Engg_disp * parseFloat(arr[3]) * parseFloat(arr[7]) / (120 * Fuel_Stchmr)
                : (arr[1] == 4 && parseInt(arr[8]) < 10) ? 0 : parseFloat(arr[6]) * parseFloat(arr[7]) / Fuel_Stchmr;

            arr[10] = ff;


            fuel += (ddt * ff);

            arr[11] = (ddt && ff) ? Number(arr[4]) * Fuel_ecn_factor / ff : 0;


            let rpm = 60 * Number(arr[3]), spd = Number(arr[4]);

            arr[12] = ddt ? (spd - lastspeed) * 0.28 / ddt : 0;

            lastspeed = spd;

            arr[13] = spd > 5 ? rpm / spd : 0;


            data.push(arr);

        }
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

    fe = Fuel_Dnst * dcml / fuel;

    addPath(coords);

    layerSelected(lastLayerSelected);

    let tr_dis = readvalue(dcml, 14), fuel_spent_mass = readvalue(fuel / 1000, 15), fuel_spent_volume = readvalue(fuel / Fuel_Dnst, 16), fuel_economy = readvalue(fe, 11);


    tripstats_global.innerHTML = "Trip dist: " + tr_dis.READING + ' ' + tr_dis.UNIT + ' | Duration: ' + new Date(td[td.length - 1][0] - td[0][0]).toISOString().slice(11, 19)
        + '<br>Fuel: ' + fuel_spent_mass.READING + ' ' + fuel_spent_mass.UNIT + ' [' + fuel_spent_volume.READING + ' ' + fuel_spent_volume.UNIT + '] | Av. Economy: ' + fuel_economy.READING + ' ' + fuel_economy.UNIT;


    if (tripsList.style.display == 'block') openTripsList();
}


var cache_ed = [];

function loadMetric(m) {

    if (!data || data.length < 1) return;





    if (!cache_ed[m]) {

        cache_ed[m] = { max: 0.001, ar: [], av: 0 };

        // analize data
        var cum = 0; let isnz = mtrx_range[m][3];
        data.forEach(e => {
            cache_ed[m].max = Math.max(cache_ed[m].max, e[m]);
            if (!isnz) cum += Number(e[m]);
        });



        cache_ed[m].av = (isnz) ? fe : (cum / data.length);


        let fac = mfactor[m] * 135 / ((m != 13) ? cache_ed[m].max : cache_ed[m].av);

        let m_s = mShift[m];


        data.forEach(entry => {
            if (entry[0] <= 1) {
                cache_ed[m].ar.push(entry[0]);


                cache_ed[m].ar.push(hslToHex(m_s + (fac * entry[m]), 100, 50));
            }
        });
    }


    updatepath(cache_ed[m].ar);
    loadStats(m);

}

const statstext = document.getElementById('tripstats');

var last_m = 6;
function loadStats(m) {

    if (!m) m = last_m;

    last_m = m;

    if (!cache_ed[m]) {
        statstext.innerHTML = '';
        return;
    }

    var statxt = '';

    if (nearest_globalIdx) {

        var ii;
        let _d = td[nearest_globalIdx][1] / td[td.length - 1][1];

        data.every(function (entry, index) {
            if (ii) return false;

            if (entry[0] > _d && entry[0] < 1) ii = index;


            return true;

        });

        let pointread = readvalue(data[ii][m], m);

        statxt = '<Span style="font-weight:bold; color:var(--c4);">&#9864 ' + ((mtrx_range[m][3] && !Number(pointread.READING)) ? ' - - ' : pointread.READING) + " " + pointread.UNIT + '<br></Span>';
    }

    let avr = readvalue(cache_ed[m].av, m);
    let maxr = readvalue(cache_ed[m].max, m);

    statxt += 'Average: ' + avr.READING + " " + avr.UNIT +
        '<br>Max: ' + maxr.READING + " " + maxr.UNIT;

    statstext.innerHTML = statxt;

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


    lastLayerSelected = idx;

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
            // Fuel Rate
            loadMetric(10);
            break;
        case 1:
            // Fuel Economy
            loadMetric(11);
            break;

        case 2:
            // Acceleration
            loadMetric(12);
            break;
        case 3:
            // Drive ratio
            loadMetric(13);
            break;
        //_______________________________//
        case 4:
            // Fuel sys stat
            loadMetric(1);
            break;
        case 5:
            // MAP
            loadMetric(2);
            break;
        case 6:
            // RPM
            loadMetric(3);
            break;
        case 7:
            // Speed
            loadMetric(4);
            break;
        case 8:
            // Intake temp
            loadMetric(5);
            break;
        case 9:
            // MAF
            loadMetric(6);
            break;
        case 10:
            // AFR
            loadMetric(7);
            break;
        case 11:
            // Calc Load
            loadMetric(8);
            break;
        case 12:
            // Abs Load
            loadMetric(9);
            break;
    }



}


function deleteSelected() {
    if (selected_filename) XAPI.deleteLog(selected_filename);
}


// tripoptions

let tripoptions = document.querySelector(".tripoptions");


function toggletripoptions(forcehide) {

    if (forcehide) {
        tripoptions.classList.remove('tro-slide-in');
        tripoptions.classList.add('tro-slide-out');
        return;
    }

    if (!tripoptions.classList.contains('tro-slide-in')) {
        tripoptions.classList.add('tro-slide-in');
        tripoptions.classList.remove('tro-slide-out');
    }
    else {
        tripoptions.classList.remove('tro-slide-in');
        tripoptions.classList.add('tro-slide-out');
    }

}


function deletecurrentlog() {

    if (!tripoptions.classList.contains('tro-slide-in')) return;

    toggletripoptions(true);

    showPrompt("Delete This Trip ?", "deleteSelected");

}