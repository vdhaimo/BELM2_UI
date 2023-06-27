

function readLogs(loglist) {


    loglist.forEach(log => {
        var dmx = demuxFileName(log);

        vehiclelist.forEach(vh => {
            if (vh.vin == dmx[1]) console.log(vh.name, dmx[2]);
        });
    });

}


function demuxFileName(name) {
    return name.split('.txt')[0].split('&&');
}


XAPI.readTrips();



function sendReadFileReq(filename) {

    XAPI.readLogFile(filename);

}

function fileRead(stringarray) {
    stringarray.forEach(element => {

        console.log(element);

    });
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
        tripsList.classList.remove('col');
        tripsList.classList.add('exp');


    } else {
        expandbutton.setAttribute('icon', 'unfold_more');
        tripsList.classList.add('col');
        tripsList.classList.remove('exp');

    }


}