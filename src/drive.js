

let dl2 = document.getElementById('dlog2');

function vupdate(string) {

    let ar = string.split('\t');

    var txt = "";

    ar.forEach(element => {
        txt += element + "<br>";
    });

    dl2.innerHTML = txt;


}




let tabswitch = [
    document.getElementById("swtab1"),
    document.getElementById("swtab2"),
    document.getElementById("swtab3"),

];

switchtab(Cookies.get('lastDriveTab'));

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

    Cookies.set('lastDriveTab', tbn)


}


let pdial_bar = document.getElementById("bigdial");


function pdial_value(value) {

    pdial_bar.style.background = 'conic-gradient(var(--c1) 0deg ' + value * 3.6 + 'deg, #555555 ' + value * 3.6 + 'deg 360deg)';

}


var pdial_Tval = 0, pdial_val = 0;

if (loopf) clearInterval(loopf);

var loopf = setInterval(loop, 40);


function loop() {

    let dif = pdial_Tval - pdial_val;

    if (Math.abs(dif) < 5) pdial_val = pdial_Tval;
    else if (dif < 0) pdial_val -= 5;
    else pdial_val += 5;

    pdial_value(pdial_val);

}