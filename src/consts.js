const FUELS = [];

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




function readvalue(reading, un) {

    let pref = unp[un];

    return { READING: reading * units[un][pref + 2] + units[un][pref + 1], UNIT: units[un][pref] }
}


