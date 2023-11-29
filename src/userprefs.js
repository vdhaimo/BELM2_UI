

var unp =
    [
        0,
        0,//FuelSystemStatus
        0,//MAP
        0,//RPM
        0,//VehicleSpeed
        0,//IntakeTemp
        0,//MAF
        0,//eqAFR
        0,//loadCalc
        0,//loadAbs
        0,//fuel rate
        0,//fuel economy
        0,//accn
        0,//driveratio
        0,//distance
        0,//fuel mass
        0//fuel volume

    ];





function initunp() {
    let unptmp = Cookies.get('unp');
    if (unptmp) unp = JSON.parse(unptmp);


    if (compareArrays(unp, un_metric)) selected_un = 0;
    else if (compareArrays(unp, un_imp)) selected_un = 1;

    selectunits(false);
}



function saveUserPrefs() {
    Cookies.set('unp', JSON.stringify(unp));
}

const un_metric = [
    0,
    0,//FuelSystemStatus
    0,//MAP
    0,//RPM
    0,//VehicleSpeed
    0,//IntakeTemp
    0,//MAF
    0,//eqAFR
    0,//loadCalc
    0,//loadAbs
    0,//fuel rate
    0,//fuel economy
    0,//accn
    0,//driveratio
    0,//distance
    0,//fuel mass
    0//fuel volume

],
    un_imp = [
        0,
        0,//FuelSystemStatus
        1,//MAP
        0,//RPM
        1,//VehicleSpeed
        1,//IntakeTemp
        1,//MAF
        0,//eqAFR
        0,//loadCalc
        0,//loadAbs
        1,//fuel rate
        1,//fuel economy
        1,//accn
        1,//driveratio
        1,//distance
        1,//fuel mass
        1//fuel volume

    ];


var selected_un = 0;
let settings_units = document.getElementById('set_unit');
function selectunits(istoggle) {

    if (istoggle) {
        selected_un++;
        if (selected_un > 1) selected_un = 0;
    }

    switch (selected_un) {
        case 0:
            unp = un_metric;
            break;
        case 1:
            unp = un_imp;
            break;
    }

    settings_units.setAttribute('smalltext', selected_un ? 'Imperial' : 'Metric');

    saveUserPrefs();

}


initunp();