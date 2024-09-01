let capabilities = {};
let active_reg;
let serial, usb, ble;
var current_board = {};     // must be var, to allow access from child

bc = new BroadcastChannel('proffiediag');

bc.onmessage = (ev)=> {
    console.log(ev.data);

    if(ev.data.status) displayStatus(ev.data.status, ev.data.is_error);

    if(ev.data.send) sendConnected(ev.data.send);

    if(ev.data.prop) current_board["props"] = ev.data.prop;
    if(ev.data.buttons) current_board["buttons"] = ev.data.buttons;
    if(ev.data.installdate) current_board["installdate"] = ev.data.installdate;

    if(ev.data.config) current_board["config"] = ev.data.config;

    if(ev.data.battery) batteryMonitor.setValue(ev.data.battery);
    //if(ev.data.volume)

    if(ev.data.serial_data) addMessage("contentSerial", ev.data.serial_data + "\n", ev.data.dir);
    if(ev.data.usb_data) addMessage("contentUSB", ev.data.usb_data + "\n", ev.data.dir);

    if(ev.data.ble_data) {
        addMessage("contentUSB", ev.data.ble_data + "\n", ev.data.dir);
        parseData(ev.data.ble_data);
    }

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
            document.getElementById("ble_connected").className = "disabled";
            _findMenuButton("Connect").className = "tb-menu hidden";
            _findMenuButton("Disconnect").className = "tb-menu";
            break;

        case "usb_connected":
            document.getElementById("usb_connected").className = "connected";
            document.getElementById("ble_connected").className = "disabled";
            _findMenuButton("Connect").className = "tb-menu hidden";
            _findMenuButton("Disconnect").className = "tb-menu";
            break;

        case "ble_connected":
            document.getElementById("usb_connected").className = "disabled";
            document.getElementById("serial_connected").className = "disabled";
            document.getElementById("ble_connected").className = "connected";
            break;

        case "usb_disconnected":
            _findMenuButton("Connect").className = "tb-menu";
            _findMenuButton("Disconnect").className = "tb-menu hidden";

            document.getElementById("serial_connected").className = "";
            document.getElementById("usb_connected").className = "";
            document.getElementById("ble_connected").className = "";
            break;

        case "serial_disconnected":
            _findMenuButton("Connect").className = "tb-menu";
            _findMenuButton("Disconnect").className = "tb-menu hidden";

            document.getElementById("serial_connected").className = "";
            document.getElementById("usb_connected").className = "";
            document.getElementById("ble_connected").className = "";
            break;
    }
};

function parseData(data){
    console.log("parseData: " + data);

    if(data.indexOf(": ") > 0) {
        let d = data.split(": ");

        switch(d[0]){
            case "$Id":
                current_board["version"] = d[1];
                break;

            case "prop":
                current_board["props"] = d[1];
                //this.bc.postMessage({"prop": d[1]});
                break;

            case "buttons":
                current_board["buttons"] = d[1];
                //this.bc.postMessage({"buttons": d[1]});
                break;

            case "installed":
                current_board["installdate"] = d[1];
                //this.bc.postMessage({"installdate": d[1]});
                break;

            default:
                console.warn(d[0] + " not implemented");
                break;
        }

    } else {
        if(data.startsWith("config/")) {
            current_board["config"] = data;
            //this.bc.postMessage({"config": data});
        }

        let matches = data.match("v([0-9])*\.([0-9]*)");

        if(matches){
            current_board["version"] = matches[1] + "." + matches[2];
            //this.bc.postMessage({"version": version});
        }
    }
}

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

function connectUSB(){
    bc.postMessage("connect_usb")
    bc.postMessage("connect_serial")
}

function connectBLE(){
    bc.postMessage("connect_ble")
}

function sendUSB(cmd){
    bc.postMessage({"send_usb": cmd});
}

function sendSerial(cmd){
    bc.postMessage({"send_serial": cmd});
}

function disconnectAll(){
    bc.postMessage("disconnect_all");
}

function Init() {
    console.log(document.lastModified);

    let err = true;

    if (navigator.usb) {
        capabilities["usb"] = true;
        usb = new USB();
        err = false;
    }
    if (navigator.serial) {
        capabilities["serial"] = true;
        serial = new Serial();
        err = false;
    }
    if (navigator.bluetooth) {
        capabilities["ble"] = true;
        ble = new BLE();
        err = false;
    }

    if (err) displayStatus("This browser supports neither webusb nor web bluetooth.", true);
}

function displayStatus(txt, isError){
    const st = document.getElementById("status_text");
    st.innerHTML = txt;
    if(isError) st.className = "error";
    else st.className = "";
}


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

window.addEventListener("load", Init);
