let capabilities = {};

let serial, usb;
var current_board = {};

let version, installdate, prop, buttons;


bc = new BroadcastChannel('proffiediag');

bc.onmessage = (ev)=> {
    console.log(ev);

    if(ev.data.prop) current_board["props"] = ev.data.prop;
    if(ev.data.buttons) current_board["buttons"] = ev.data.buttons;
    if(ev.data.installdate) current_board["installdate"] = ev.data.installdate;
    if(ev.data.config) current_board["config"] = ev.data.config;
    if(ev.data.battery) batteryMonitor.setValue(ev.data.battery);
    if(ev.data.serial_data) addMessage("contentSerial", ev.data.serial_data + "\n", ev.data.dir);
    if(ev.data.usb_data) addMessage("contentUSB", ev.data.usb_data + "\n", ev.data.dir);

    if(ev.data.version) current_board["version"] = ev.data.version;

    if(ev.data.currentDevice) {
        current_board["manufacturerName"] = ev.data.currentDevice.manufacturerName;
        current_board["productName"] = ev.data.currentDevice.productName;
        current_board["serialNumber"] = ev.data.currentDevice.serialNumber;

        document.getElementById("manufacturerName").innerHTML = current_board["manufacturerName"];
        document.getElementById("productName").innerHTML = current_board["productName"];
        document.getElementById("serialNumber").innerHTML = current_board["serialNumber"];
    }

    if(ev.data.monitor){
        switch(ev.data.monitor){
            case "started":
                document.getElementById("top").style.display = "inline-block";
                break;

            case "stopped":
                document.getElementById("top").style.display = "none";
                break;
        }
    }

    switch(ev.data){
        case "serial_connected":
            document.getElementById("serial_connected").className = "connected";
            break;

        case "usb_connected":
            document.getElementById("usb_connected").className = "connected";
            document.getElementById("ble_connected").className = "disabled";
            break;

        case "ble_connected":
            document.getElementById("usb_connected").className = "disabled";
            document.getElementById("ble_connected").className = "connected";
            break;
    }
};

function addMessage(dest, txt, dir){
    const console = document.getElementById(dest);

    while(console.childNodes.length > 100) {
        console.firstChild.remove();
    }

    switch(dir){
        case "in":
            console.innerHTML += "<span class='receive'>" + txt + "</span>";
            break;

        case "out":
            console.innerHTML += "<span class='send'>" + txt + "</span>";
            break;

        default:
            console.innerHTML += "<span>" + txt + "</span>";
            break;
    }

    console.scrollTo(0, console.scrollHeight)
}

function connectSerial(){
    bc.postMessage("connect_serial")
}

function connectUSB(){
    bc.postMessage("connect_usb")
}

function sendUSB(cmd){
    bc.postMessage({"send_usb": cmd});
}

function sendSerial(cmd){
    bc.postMessage({"send_serial": cmd});
}

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

    serial = new Serial();
    usb = new USB();
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

window.addEventListener("load", Init);
