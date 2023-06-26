

function readLogs(loglist) {

    console.log(loglist);

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

