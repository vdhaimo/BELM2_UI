

let dl2 = document.getElementById('dlog2');




var MTRX = [[], [], [], [], [], [], [], [], [], []];
const mtrx_units =
    [
        'timestamp',
        'Fuel Sys Status',
        'MAP',
        'RPM',
        'Speed',
        'Intake Temp',
        'MAF',
        'AFR',
        'Calc Load',
        'Abs Load',
        'Fuel Rate',
        'Fuel Economy',
        'Acceleration',
        'Drive Ratio'
    ];

var mtrx_range = [
    [],//0 tstamp
    [0, 16],//1 FuelSysStatus
    [0, 200],//2 MAP
    [0, 7000],//3 RPM
    [0, 220],//4 VehicleSPeed
    [-20, 80],//5 IntakeTemp
    [0, 180],//6 MAF //111222333
    [0.5, 1.5],//7 eqAFR
    [0, 100],//8 loadCalc
    [0, 200]//9 loadAbs

    // FuelRate
    // FuelEconomy
    // Accn
    // DriveRatio
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

function vupdate(string) {

    let ar = string.split('\t');

    var txt = "";

    ar.forEach(element => {
        txt += element + "<br>";
    });

    dl2.innerHTML = txt;

    ar.forEach(function (element, index) { MTRX[index].push(element); });


    while ((MTRX[0][0] + 60000) < ar[0]) {

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
switchtab(selectedtab);

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
    Cookies.set('lastDriveTab', tbn)


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



if (loopf) clearInterval(loopf);

var loopf = setInterval(loop, 40);





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

    dial_values(pdial_val, sdial1_val, sdial2_val, sdial3_val);

}

var dashboard = [];



function readDash() {
    let jsn = Cookies.get('dboard');
    if (jsn) {
        dashboard = JSON.parse(jsn);
    } else {
        dashboard = [
            { p: 0, s1: 1, s2: 2, s3: 3 },
            { p: 0, s1: 1, s2: 2, s3: 3 },
            { p: 0, s1: 1, s2: 2, s3: 3 }
        ]
    }
}
readDash();

function savedashbaord() {
    Cookies.set('dboard', JSON.stringify(dashboard));
}


function setDials() {

    //P




    //s1


    //s2


    //s3

}