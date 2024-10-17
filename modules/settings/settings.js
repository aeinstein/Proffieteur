let connected = 0;

bc.onmessage = async (ev) => {
    console.log(ev);

    if (ev.data.prop) {
        console.log("Props: " + ev.data.prop);
        document.getElementById("txtProp").value = ev.data.prop;
    }

    if (ev.data.buttons) {
        console.log("Buttons: " + ev.data.buttons);
        document.getElementById("txtButtons").value = ev.data.buttons;
    }

    if (ev.data.installdate) {
        document.getElementById("txtInstalled").value = ev.data.installdate;
    }

    if(ev.data.blade_dimming) {
        document.getElementById("blade_dimming").value = ev.data.blade_dimming;
    }


    setUI(ev, "gestureon");
    setUI(ev, "swingon");
    setUI(ev, "thruston");
    setUI(ev, "stabon");
    setUI(ev, "twiston");


    // getpresets if connection is complete
    if(ev.data === "usb_connected") connected |= 1
    if(ev.data === "ble_connected") connected |= 4

    if(connected === 3 || connected === 5) {
        onConnected();
    }
};

function setUI(ev, id){
    if(ev.data.hasOwnProperty("gesture " + id)){
        if(ev.data["gesture gestureon"] > 0.5) {
            document.getElementById(id).checked = true;
        } else {





            
            document.getElementById(id).checked = false;
        }
    }
}

function sendConnected(cmd){
    bc.postMessage({"send_usb": cmd});
    bc.postMessage({"send_ble": cmd});
}

function onConnected(){
    //document.getElementById("txtVersion").innerHTML = parent.current_board["version"];
    document.getElementById("txtButtons").innerHTML = parent.current_board["buttons"];
    document.getElementById("txtProp").innerHTML = parent.current_board["props"];
    document.getElementById("txtConfig").innerHTML = parent.current_board["config"];
    document.getElementById("txtInstalled").innerHTML = parent.current_board["installdate"];
    getAllSettings();
}

function getAllSettings(){
    const container = document.getElementById("fldgestures");
    let elems = container.getElementsByTagName("INPUT");

    for(let i = 0; i < elems.length; i++){
        let elem = elems[i];

        let id = elem.id;
        console.log(elem);
        bc.postMessage({"get_setting": "gesture " + id})
    }

    bc.postMessage({"get_setting": "blade_dimming"});
    bc.postMessage({"get_setting": "max_blade_length"});
}


function init(){
    onConnected();
}

window.addEventListener("load", init);
