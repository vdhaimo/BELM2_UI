

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
}
initunp();


function saveUserPrefs() {
    Cookies.set('unp', JSON.stringify(unp));
}

