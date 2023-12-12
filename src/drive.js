

let dl2 = document.getElementById('dlog2');




var MTRX = [
    [],//0 tstamp
    [],//1 FuelSysStatus
    [],//2 MAP
    [],//3 RPM
    [],//4 VehicleSPeed
    [],//5 IntakeTemp
    [],//6 MAF
    [],//7 eqAFR
    [],//8 loadCalc
    [],//9 loadAbs

    [],//10 FuelRate
    [],//11 FuelEconomy
    [],//12 Accn
    [] //13 DriveRatio
];
var mtrx = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const mtrx_names =
    [
        'timestamp',
        'Fuel Sys',
        'MAP',
        'RPM',
        'Speed',
        'Intake Temp',
        'MAF',
        'AFR',
        'Calc Load',
        'Abs Load',
        'Fuel Rate',
        'Fuel Eco',
        'Accn',
        'Dr Ratio'
    ];

var mtrx_range = [
    //low high range isnonzero
    [],//0 tstamp
    [0, 16, 16, 0],//1 FuelSysStatus
    [0, 200, 200, 0],//2 MAP
    [0, 7000, 7000, 0],//3 RPM
    [0, 220, 220, 0],//4 VehicleSPeed
    [-25, 80, 75, 0],//5 IntakeTemp
    [0, 180, 180, 0],//6 MAF //111222333
    [0.5, 1.5, 1.0, 0],//7 eqAFR
    [0, 100, 100, 0],//8 loadCalc
    [0, 300, 150, 0],//9 loadAbs

    [0, 5, 5, 0],// FuelRate
    [0, 100, 100, 1],// FuelEconomy
    [-10, 10, 20, 0],// Accn
    [0, 25000, 25000, 0],// DriveRatio
];


//0 tstamp
//1 FuelSysStatus
//2 MAP
//3 RPM
//4 VehicleSPeed
//5 IntakeTemp
//6 MAF
//7 eqAFR
//8 loadCalc
//9 loadAbs

// FuelRate
// FuelEconomy
// Accn
// DriveRatio

var Engg_disp,
    Fuel_Stchmr,
    Fuel_Dnst,
    Fuel_ecn_factor,
    lt = 0,
    lastspeed = 0;

function drive_vehicleParams(vh) {
    Engg_disp = parseFloat(vh.jsn.cc) / 1000;
    Fuel_Stchmr = FUELS[vh.jsn.fuel].STCHM;
    Fuel_Dnst = FUELS[vh.jsn.fuel].DNST;
    Fuel_ecn_factor = FUELS[vh.jsn.fuel].DNST / 3600;

    drivestatus(vh.jsn.name);
}

function vupdate(string) {

    let arr = string.split('\t');

    if (!Engg_disp || !Fuel_Stchmr || !Fuel_Dnst || !Fuel_ecn_factor) return;

    let ddt = 0.001 * (Number(arr[0]) - Number(lt));

    ddt = lt ? ddt : 0;

    lt = arr[0];

    let ff = (arr[6]) ? ((arr[1] == 4 && parseInt(arr[8]) < 10) ? 0 : 0.01 * parseFloat(arr[9]) * 1.184 * Engg_disp * parseFloat(arr[3]) * parseFloat(arr[7]) / (120 * Fuel_Stchmr))
        : ((arr[1] == 4 && parseInt(arr[8]) < 10) ? 0 : parseFloat(arr[6]) * parseFloat(arr[7]) / Fuel_Stchmr);
    arr[10] = ff;



    arr[11] = (ddt && ff) ? Number(arr[4]) * Fuel_ecn_factor / ff : 0;


    let rpm = 60 * Number(arr[3]), spd = Number(arr[4]);

    arr[12] = ddt ? (spd - lastspeed) * 0.28 / ddt : 0;

    lastspeed = spd;

    arr[13] = spd > 5 ? rpm / spd : 0;


    arr.forEach(function (element, index) {
        MTRX[index].push(element);
        mtrx[index] = element;
    });

    while ((Number(MTRX[0][0]) + 60000) < arr[0]) {

        MTRX.forEach(function (element) { element.shift(); });

    }


    setDials();

}





let tabswitch = [
    document.getElementById("swtab1"),
    document.getElementById("swtab2"),
    document.getElementById("swtab3"),

];


var selectedtab = Cookies.get('lastDriveTab');


function switchtab(tbn) {



    if (!tbn) tbn = 0;

    tabswitch.forEach(function (element, index) {
        if (index == tbn) {
            element.style.opacity = 1;
        }
        else {
            element.style.opacity = 0.2;
        }
    });

    selectedtab = tbn;
    Cookies.set('lastDriveTab', tbn);

    setDials();

}


let pdial_bar = document.getElementById("bigdial"),
    s1dial_bar = document.getElementById("hr1"),
    s2dial_bar = document.getElementById("hr2"),
    s3dial_bar = document.getElementById("hr3");


function dial_values(v0, v1, v2, v3) {

    pdial_bar.style.background = 'conic-gradient(var(--c1) 0deg ' + v0 * 3.6 + 'deg, #555555 ' + v0 * 3.6 + 'deg 360deg)';

    s1dial_bar.style.left = (100 - v1) / 2 + '%';
    s1dial_bar.style.width = v1 + '%';

    s2dial_bar.style.left = (100 - v2) / 2 + '%';
    s2dial_bar.style.width = v2 + '%';

    s3dial_bar.style.left = (100 - v3) / 2 + '%';
    s3dial_bar.style.width = v3 + '%';

}




var pdial_Tval = 0, pdial_val = 0;
var sdial1_Tval = 0, sdial1_val = 0,
    sdial2_Tval = 0, sdial2_val = 0,
    sdial3_Tval = 0, sdial3_val = 0;






const fff = 0.3;
function deltaf(t, v) {

    let dif = t - v;

    if (Math.abs(dif) < 2) v = t;
    else v += dif * fff;

    return v;

}


function loop() {

    pdial_val = deltaf(pdial_Tval, pdial_val);
    sdial1_val = deltaf(sdial1_Tval, sdial1_val);
    sdial2_val = deltaf(sdial2_Tval, sdial2_val);
    sdial3_val = deltaf(sdial3_Tval, sdial3_val);

    dial_values(pdial_val, sdial1_val, sdial2_val, sdial3_val);

}

var dashboard = [];



function readDash() {
    let jsn = Cookies.get('dboard');
    if (jsn) {
        dashboard = JSON.parse(jsn);

    } else {
        dashboard = [
            { p: 1, s: [2, 3, 4] },
            { p: 2, s: [4, 5, 6] },
            { p: 8, s: [2, 5, 9] }
        ]
    }
}
readDash();

function savedashbaord() {
    Cookies.set('dboard', JSON.stringify(dashboard));
}


function getPercent(idx) {

    var midx = mtrx_range[idx];
    var value = mtrx[idx];


    if (value < midx[0]) {
        midx[0] = value;
        midx[2] = midx[1] - midx[0];
    }
    else if (value > midx[1]) {
        midx[1] = value;
        midx[2] = midx[1] - midx[0];
    }

    mtrx_range[idx] = midx;

    return 100 * value / (midx[2]);

}

let primary_title = document.getElementById('bigdialtitle'),
    primary_average = document.getElementById('bigdialaverage'),
    primary_text = document.getElementById('bigdialtext');


let secondary_texts = [
    document.getElementById('hr1txt'),
    document.getElementById('hr2txt'),
    document.getElementById('hr3txt')
]

function setDials() {

    //P

    let _p = dashboard[selectedtab].p;

    let readinginst = readvalue(mtrx[_p], _p),
        readingavg = readvalue(mtrx_range[_p][3] ? araverage_noZero(_p) : araverage(_p), _p);

    primary_title.innerHTML = mtrx_names[_p];
    primary_average.innerHTML = 'Average<br>' + ((mtrx_range[_p][3] && !Number(readingavg.READING)) ? '- -' : readingavg.READING) + ' ' + readingavg.UNIT;
    primary_text.innerHTML = ((mtrx_range[_p][3] && !Number(readinginst.READING)) ? '- -' : readinginst.READING) + '<span style="font-size: 12px;"><br>' + readinginst.UNIT + '</span>';

    pdial_Tval = getPercent(_p);

    //s
    secondary_texts.forEach(function (element, index) {

        let _s = dashboard[selectedtab].s[index];

        let readinginst = readvalue(mtrx[_s], _s),
            readingavg = readvalue(mtrx_range[_s][3] ? araverage_noZero(_s) : araverage(_s), _s);

        element.innerHTML = '<span style="font-size: 18px;">' + mtrx_names[_s] + '<br>' + ((mtrx_range[_s][3] && !Number(readinginst.READING)) ? '- -' : readinginst.READING) + '</span>' + readinginst.UNIT +
            '<br><br>1 min Av ' + ((mtrx_range[_s][3] && !Number(readingavg.READING)) ? '- -' : readingavg.READING) + ' ' + readingavg.UNIT;

        if (index == 0) sdial1_Tval = getPercent(_s);
        else if (index == 1) sdial2_Tval = getPercent(_s);
        else if (index == 2) sdial3_Tval = getPercent(_s);

    });

}

function araverage(n) {

    var sum = 0;
    MTRX[n].forEach(element => {
        sum += parseFloat(element);

    });
    let l = MTRX[n].length;


    return l > 0 ? (sum / l) : 0;
}

function araverage_noZero(n) {

    var sum = 0; var l = 0;
    MTRX[n].forEach(element => {
        if (element) {
            sum += parseFloat(element);
            l++;
        }

    });

    return l > 0 ? (sum / l) : 0;
}






switchtab(selectedtab);


if (loopf) clearInterval(loopf);

var loopf = setInterval(loop, 40);


let icon = document.getElementById('editdialsicon');
var iseditunlocked = false;

let editdialinstructions = document.getElementById('editdialinstr');

function edtDials() {

    iseditunlocked = !iseditunlocked;

    if (iseditunlocked) {
        //XAPI.showToast("edit enabled");
        icon.setAttribute('icon', 'lock_open_right');
        editdialinstructions.style.display = 'block';
    }
    else {
        //XAPI.showToast("edit disabled");
        icon.setAttribute('icon', 'lock');
        editdialinstructions.style.display = 'none';

    }


}

function getnextdial(n) {
    let nn = n + 1;

    return nn < MTRX.length ? nn : 1;
}
function getprevdial(n) {
    let nn = n - 1;

    return nn > 0 ? nn : (MTRX.length - 1);
}


let chdls = document.getElementsByClassName('chdl');


Array.from(chdls).forEach((element, index) => {

    var ix = 0;

    element.addEventListener('touchstart', (event) => {
        if (!iseditunlocked) return;


        ix = event.changedTouches[0].screenX;

    });
    element.addEventListener('mousedown', (event) => {
        if (!iseditunlocked) return;

        dialclicked(true, index);

    });
    element.addEventListener('touchend', (event) => {

        if (!iseditunlocked) return;


        if (event.changedTouches[0].screenX < ix) dialclicked(true, index);
        else dialclicked(false, index);
    });




});

function dialclicked(fwd, n) {


    if (!iseditunlocked) return;

    switch (n) {
        case 0:
            dashboard[selectedtab].p = fwd ? getnextdial(dashboard[selectedtab].p) : getprevdial(dashboard[selectedtab].p);
            break;
        case 1:
            dashboard[selectedtab].s[0] = fwd ? getnextdial(dashboard[selectedtab].s[0]) : getprevdial(dashboard[selectedtab].s[0]);
            break;
        case 2:
            dashboard[selectedtab].s[1] = fwd ? getnextdial(dashboard[selectedtab].s[1]) : getprevdial(dashboard[selectedtab].s[1]);
            break;
        case 3:
            dashboard[selectedtab].s[2] = fwd ? getnextdial(dashboard[selectedtab].s[2]) : getprevdial(dashboard[selectedtab].s[2]);
            break;
    }

    savedashbaord();

    setDials();

}


const connS = '► ', discS = '⊝ Disconnected';
let driveconto = document.getElementById('driveconto');
function drivestatus(vehiclename) {

    if (vehiclename) {
        driveconto.innerHTML = connS + vehiclename;
        driveconto.style.color = document.styleSheets[0].cssRules[0].style.getPropertyValue('--c3');
    }
    else {
        driveconto.innerHTML = discS;
        driveconto.style.color = document.styleSheets[0].cssRules[0].style.getPropertyValue('--text-colorB');
    }
}

drivestatus(null);