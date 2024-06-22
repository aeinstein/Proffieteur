let capabilities = {};

function Init() {
    console.log(document.lastModified);

    let err = true;

    if (navigator.usb) {
        capabilities["usb"] = true;
        err = false;
    }
    if (navigator.serial) {
        capabilities["serial"] = true;
        err = false;
    }
    if (navigator.bluetooth) {
        capabilities["ble"] = true;
        err = false;
    }

    if (err) displayError("This browser supports neither webusb nor web bluetooth.", true);
}

function displayError(txt, isError){
    const st = document.getElementById("status_text");
    st.innerHTML = txt;
    if(isError) st.className = "error";
    else st.className = "";
}

let active_reg;


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(() => {
        console.log('Service Worker Registered');

        navigator.serviceWorker.addEventListener("message", (evt)=>{
            console.log(evt);
            parseMessage(evt);
        });

        navigator.serviceWorker.ready.then((registration) => {
            active_reg = registration.active;
        });

        navigator.serviceWorker.startMessages();
    });
}

function sendCommand(cmd){
    active_reg.postMessage({cmd: cmd});
}


function parseMessage(evt){
    console.log(evt);
}

function RunSerial(){
    navigator.serviceWorker.postMessage("connectSerial");
}

function RunUSB(){
    navigator.serviceWorker.postMessage("connectUSB");
}

window.addEventListener("load", Init);
