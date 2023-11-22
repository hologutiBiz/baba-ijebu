
    // dialog //
let dialog = document.querySelector('dialog');
document.querySelector('#show').onclick = function() {
    dialog.show();
};
document.querySelector('#close').onclick = function() {
    dialog.close();
    document.getElementById('dis').style.display = 'none';
};



    // page orientation
let pageOrt = document.getElementById('pageOrt');
let container = document.getElementById('iframeContainer');

pageOrt.addEventListener("click", function() {
    if(container.style.flexWrap === 'wrap') {
        container.style.flexWrap = 'nowrap';
        // container.style.justifyContent = 'center';
        pageOrt.innerText = "change to potrait";

    } else {
        container.style.flexWrap = 'wrap';
        // container.style.justifyContent = 'start';
        pageOrt.innerText = "Change to Landscape";
    }
});


   