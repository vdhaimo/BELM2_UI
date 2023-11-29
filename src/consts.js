const FUELS = [

    {},                                 //0 Not available
    { NAME: 'Gasoline', STCHM: 14.7, DNST: 730 },  //1 Gasoline
    {},                                 //2	Methanol
    {},                                 //3	Ethanol
    { NAME: 'Diesel', STCHM: 14.4, DNST: 840 },    //4	Diesel
    {},                                 //5	LPG
    { NAME: 'CNG', STCHM: 10, DNST: 0 },         //6	CNG
    {}                                  //7	Propane
];

const units = [

    ['', 0, 1],//0
    ['', 0, 1],//1 FuelSystemStatus
    ['kPa', 0, 1, 'psi', 0, 0.145038],//2 MAP
    ['rpm', 0, 1],//3 RPM
    ['kmph', 0, 1, 'mph', 0, 0.621371],//4 VehicleSpeed
    ['°C', 0, 1, '°F', 32, 1.8],//5 IntakeTemp
    ['g/s', 0, 1, 'oz/s', 0, 0.035274],//6 MAF
    ['', 0, 1],//7 eqAFR
    ['%', 0, 1],//8 loadCalc
    ['%', 0, 1],//9 loadAbs
    ['g/s', 0, 1, 'oz/s', 0, 0.035274],//10 fuel rate
    ['kmpl', 0, 1, 'mpg', 0, 2.3521458],//11 fuel economy
    ['m/s²', 0, 1, 'G', 0, 0.101972], //12 accn
    ['revs/km', 0, 1, 'revs/mile', 0, 1.60934], //13 driveratio
    ['kms', 0, 1, 'miles', 0, 0.621371], //14 distance
    ['kg', 0, 1, 'lbs', 0, 2.20462], //15 Fuel mass
    ['Liters', 0, 1, 'Gallon', 0, 0.264172] //16 Fuel volume

];
const precision = [
    0,//0
    0,//1 FuelSystemStatus
    0,//2 MAP
    0,//3 RPM
    0,//4 VehicleSpeed
    0,//5 IntakeTemp
    2,//6 MAF
    4,//7 eqAFR
    0,//8 loadCalc
    0,//9 loadAbs
    3,//10 fuel rate
    2,//11 fuel economy
    2, //12 accn
    0, //13 driveratio
    1, //14 distance
    2, //15 Fuel mass
    2 //16 Fuel volume

];




function readvalue(reading, un) {

    let pref = 3 * unp[un];

    return { READING: parseFloat(reading * units[un][pref + 2] + units[un][pref + 1]).toFixed(precision[un]), UNIT: units[un][pref] }
}


function getVehicleFromVIN(vin) {

    var v;
    vehiclelist.forEach((el) => {
        if (el.vin) v = el;
    });

    return v;
}



const compareArrays = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
};