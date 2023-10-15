

let dl2 = document.getElementById('dlog2');

function vupdate(arr) {

    var txt = "";

    arr.forEach(element => {
        txt += (element + '<br>');
    });

    dl2.innerHTML = txt;
}






function changetabs(tbn) {

}