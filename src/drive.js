

let dl2 = document.getElementById('dlog2');




var MTRX = [[], [], [], [], [], [], [], [], [], []];
var mtrx = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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
    [],//0 tstamp
    [0, 16, 16],//1 FuelSysStatus
    [0, 200, 200],//2 MAP
    [0, 7000, 7000],//3 RPM
    [0, 220, 220],//4 VehicleSPeed
    [-20, 80, 100],//5 IntakeTemp
    [0, 180, 180],//6 MAF //111222333
    [0.5, 1.5, 1.0],//7 eqAFR
    [0, 100, 100],//8 loadCalc
    [0, 300, 300]//9 loadAbs

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

    ar.forEach(function (element, index) {
        MTRX[index].push(element);
        mtrx[index] = element;
    });


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


function getPercent(idx, value) {

    var midx = mtrx_range[idx];

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
        readingavg = readvalue(araverage(_p), _p);

    primary_title.innerHTML = mtrx_names[_p];
    primary_average.innerHTML = 'Average<br>' + readingavg.READING + ' ' + readingavg.UNIT;
    primary_text.innerHTML = readinginst.READING + '<span style="font-size: 12px;"><br>' + readinginst.UNIT + '</span>';

    pdial_Tval = mtrx[_p];

    //s
    secondary_texts.forEach(function (element, index) {

        let _s = dashboard[selectedtab].s[index];
        let readinginst = readvalue(mtrx[_s], _s),
            readingavg = readvalue(araverage(_s), _s);

        element.innerHTML = '<span style="font-size: 18px;">' + mtrx_names[_s] + '<br>' + readinginst.READING + '</span>' + readinginst.UNIT +
            '<br><br>60s Av ' + readingavg.READING + ' ' + readingavg.UNIT;

        if (index == 0) sdial1_Tval = mtrx[_s];
        else if (index == 1) sdial2_Tval = mtrx[_s];
        else if (index == 2) sdial3_Tval = mtrx[_s];

    });

}

function araverage(n) {

    var sum = 0;
    MTRX[n].forEach(element => { sum += element });
    let l = MTRX[n].length;

    return l > 0 ? sum / l : 0;
}






