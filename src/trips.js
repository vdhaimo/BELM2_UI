

var tripsjs = this;

var tripsListHolder = document.querySelector('.tripslistholder');


var lastLayerSelected = 6;


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
                h.setAttribute('icon', 'line_end_circle');

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






function sendReadFileReq(filename) {

    XAPI.readLogFile(filename);

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



const units = [
    '',
    '',//FuelSystemStatus
    'kPa',//MAP
    'rpm',//RPM
    'km/h',//VehicleSpeed
    '°C',//IntakeTemp
    'g/s',//MAF
    '',//eqAFR
    '%',//loadCalc
    '%',//loadAbs
    'g/s',//fuel rate
    'km/l',//fuel economy
    'm/s^2', //accn
    'revs/km', //driveratio
    'kms'//distance

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


    cache_ed = [];

    var lastCoord = [], dcml = 0, fuel = 0, lastspeed = 0;

    var lt = 0;


    json.forEach(element => {


        var arr = element.split('\t');
        if (arr.length > 3) {

            let ddt = 0.001 * (Number(arr[0]) - Number(lt));

            ddt = lt ? ddt : 0;

            lt = arr[0];

            let ff = (arr[1] == 4 && parseInt(arr[8]) < 10) ? 0 : 0.01 * parseFloat(arr[9]) * 1.184 * 1.2 * parseFloat(arr[3]) * parseFloat(arr[7]) / (120 * 14);

            arr[10] = ff;

            fuel += (ddt * ff);

            arr[11] = (ddt && ff) ? Number(arr[4]) * 0.2083 / ff : 30;


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

    fe = 750 * dcml / fuel;

    addPath(coords);

    layerSelected(lastLayerSelected);

    tripstats_global.innerHTML = "Trip dist: " + parseFloat(dcml).toFixed(2) + ' ' + units[14] + ' | Duration: ' + new Date(td[td.length - 1][0] - td[0][0]).toISOString().slice(11, 19)
        + '<br>Fuel: ' + parseFloat(fuel / 1000).toFixed(2) + ' Kg [' + parseFloat(fuel / 750).toFixed(2) + ' Liters] | Av. Economy: ' + parseFloat(fe).toFixed(2) + ' Km/l';


    if (tripsList.style.display == 'block') openTripsList();
}


var cache_ed = [];

function loadMetric(m) {

    if (!data || data.length < 1) return;





    if (!cache_ed[m]) {

        cache_ed[m] = { max: 0.001, ar: [], av: 0 };

        // analize data
        var cum = 0;
        data.forEach(e => {
            cache_ed[m].max = Math.max(cache_ed[m].max, e[m]);
            cum += Number(e[m]);
        });



        cache_ed[m].av = (m == 11) ? fe : cum / data.length;


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


        statxt = '<Span style="font-weight:bold; color:var(--c4);">&#9864 ' + parseFloat(data[ii][m]).toFixed(2) + " " + units[m] + '<br></Span>';
    }


    statxt += 'Average: ' + parseFloat(cache_ed[m].av).toFixed(2) + " " + units[m] +
        '<br>Max: ' + parseFloat(cache_ed[m].max).toFixed(2) + " " + units[m];

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
