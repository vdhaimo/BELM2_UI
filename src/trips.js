

var tripsjs = this;

var tripsListHolder = document.querySelector('.tripslistholder');


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
                console.log(vh.name, dmx[2]);

                //create log entry
                var h = document.createElement('bt-cardx1');
                h.setAttribute('bigtext', vh.name);
                h.setAttribute('smalltext', dmx[2]);
                h.setAttribute('icon', 'stop');

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


XAPI.readTrips();



function sendReadFileReq(filename) {

    XAPI.readLogFile(filename);

}

var coords = [], data = [];

function fileRead(stringarray) {

    coords = [];
    data = [];

    stringarray.forEach(element => {



        var arr = element.split('\t');
        if (arr.length > 3) data.push(arr);
        else coords.push([arr[1], arr[2]]);



    });



    console.log(coords);
    console.log(data);

    addPath(coords);
    if (tripsList.style.display == 'block') openTripsList();
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