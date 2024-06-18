

let serviceUuid = '713d0000-389c-f637-b1d7-91b361ae7678';

let usbProductId = 0x6668;
let usbVendorId = 0x1209;

// BT variables
let device;
let server;
let rx;
let tx;
let pw;
let status;

// USB vars
let usb_device;
let endpointOut;
let endpointIn;
let topPID = -1;

// Serial vars
let serial_port;
let versionLoaded = false;
let topCalled = false;
let processes = {};

let send_buf = [];
let current_packet;
let sending = false;
let callback_queue = [];
let last_callback;
let status_cb;

let buffer = "";
let track_lines;
let max_blade_length = 0;
let font_lines;
let style_lines;
let dir_lines;
let named_styles = {};
let track_string = "";
let tracks_listed = false;
let watchdog_running = false;
let arg_storage = {};
let batteryMonitor = FIND("batteryChart");

batteryMonitor.setAttribute("width", "190");
batteryMonitor.setAttribute("height", "50");
batteryMonitor.setAttribute("background", "#202020");

let updating_sliders = {}

let current_preset_num = -1;
let currentMode = 'normal';
let presets = [];
let dragging = null;
let loop_running = false;

const filters = [
    {
        usbVendorId
        //'productId': usbProductId
    }
];

const UARTs = {
    '713d0000-389c-f637-b1d7-91b361ae7678': {
        rx: '713d0002-389c-f637-b1d7-91b361ae7678',
        tx: '713d0003-389c-f637-b1d7-91b361ae7678',   // my own special blend
        pw: '713d0004-389c-f637-b1d7-91b361ae7678',
        status: '713d0005-389c-f637-b1d7-91b361ae7678'
    },

    "6e400001-b5a3-f393-e0a9-e50e24dcca9e": {
        rx: "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
        tx: "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
    },  //Nordic
    "49535343-fe7d-4ae5-8fa9-9fafd205e455": {
        rx: "49535343-8841-43f4-a8d4-ecbe34729bb3",
        tx: "49535343-1e4d-4bd9-ba61-23c647249616"
    },  //ISSC
    "0000fff0-0000-1000-8000-00805f9b34fb": {
        rx: "0000fff1-0000-1000-8000-00805f9b34fb",
        tx: "0000fff2-0000-1000-8000-00805f9b34fb"
    },  //ISSC Trandparent
    "0000ffe0-0000-1000-8000-00805f9b34fb": {
        rx: "0000ffe1-0000-1000-8000-00805f9b34fb",
        tx: "0000ffe1-0000-1000-8000-00805f9b34fb"
    },  //HM-10
    "0000fefb-0000-1000-8000-00805f9b34fb": {
        rx: "00000001-0000-1000-8000-008025000000",
        tx: "00000002-0000-1000-8000-008025000000"
    },  //Stollmann Terminal IO
    "569a1101-b87f-490c-92cb-11ba5ea5167c": {
        rx: "569a2001-b87f-490c-92cb-11ba5ea5167c",
        tx: "569a2000-b87f-490c-92cb-11ba5ea5167c"
    },  //Laird BL600 Virtual Serial Port Service
};


function SendNext() {
    if (!current_packet) {
        if (!send_buf.length) {
            sending = false;
            return;
        }

        current_packet = send_buf[0];
        send_buf = send_buf.slice(1);
    }

    console.log("Sending " + (new TextDecoder().decode(current_packet)));
    sending = true;

    tx.writeValue(current_packet).then(
        function (v) {
            current_packet = 0;
            SendNext();
        },
        function (e) {
            console.log('rejected', e);
            Die();
            setTimeout(DoRunLoop, 10000);
        }
    );
}

function Die(e) {
    for (let i = 0; i < callback_queue.length; i++) callback_queue[i][1](e);
    callback_queue = [];
    current_packet = null;
    send_buf = [];
    sending = false;
}

function OnData(data) {
    data = new TextDecoder().decode(data);
    // console.log("GOT DATA: " + data);
    buffer += data;
    let tmp = buffer.split("-+=END_OUTPUT=+-");

    if (tmp.length > 1) {
        buffer = tmp[1];
        let ret = tmp[0];

        tmp = ret.split("-+=BEGIN_OUTPUT=+-\n");

        if (tmp.length > 1) ret = tmp[1];

        ret = ret.split("\r").join("");

        console.log('> ' + ret);
        addMessage("contentUSB", ret, "in");

        if (callback_queue.length) {
            last_callback = Date.now();
            callback_queue[0][0](ret);
            callback_queue = callback_queue.slice(1);
        }
    }
}

function OnSerialData(data){
    console.log('> ' + data);
    addMessage("contentSerial", data + "\n", "in");


    if(data.match("Battery voltage: ")){
        let d = data.split(": ");
        batteryMonitor.setValue(d[1]);
    }

    if(!versionLoaded) {
        let matches = data.match("v([0-9])*\.([0-9]*)");

        if(matches){
            let version = matches[1] + "." + matches[2];
            FIND("txtVersion").innerHTML = version;
        }

        if(data.indexOf(": ") > 0) {
            let d = data.split(": ");
            switch(d[0]){
            case "prop":
                FIND("txtProp").innerHTML = d[1];
                break;

            case "buttons":
                FIND("txtButtons").innerHTML = d[1];
                break;

            case "installed":
                FIND("txtInstalled").innerHTML = d[1];
                versionLoaded = true;
                break;
            }
        }

        if(data.startsWith("config/")){
            FIND("txtConfig").innerHTML = data;
        }
    }

    if(topCalled){
        if(data.indexOf(": ") > 0) {
            let d = data.split(": ");
            processes[d[0]] = d[1];

            if(d[0] === "MonitorHelper loop") {
                topCalled = false;
                FIND("contentTop").innerHTML = displayTop();
            }
        }
    }
}

function displayTop(){
    let ret = "<table>";

    for (const property in processes) {
        ret += "<tr>";
        ret += "<td>" + property + "</td>";
        ret += "<td>" + processes[property] + "</td>";
        ret += "</tr>";
    }

    ret += "</table>";

    return ret;
}

function openTop(){
    FIND("top").style.visibility = "visible";

    topPID = window.setInterval(() => {
        topCalled = true;
        SendSerial("top");
    }, 5000);

    topCalled = true;
    SendSerial("top");
}

function closeTop(){
    if(topPID >= 0) window.clearInterval(topPID);
    topPID = -1;
    FIND("top").style.visibility = "hidden";
}

function getVersion(){
    versionLoaded = false;
    SendSerial("version");
}

function addMessage(dest, txt, dir){
    const console = FIND(dest);

    while(console.childNodes.length > 200) {
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

function OnRX(event) {
    OnData(event.target.value);
}



function WatchDog() {
    watchdog_running = false;
    if ((Date.now() - last_callback) > 20000) {
        Die("timeout");
        setTimeout(DoRunLoop, 10000);
    }
    RunWatchDog();
}

function RunWatchDog() {
    if (callback_queue.length && !watchdog_running) {
        watchdog_running = true;
        setTimeout(WatchDog, 10000);
    }
}

async function SendSerial(cmd) {
    const textEncoder = new TextEncoderStream();
    const writableStreamClosed = textEncoder.readable.pipeTo(serial_port.writable);

    const writer = textEncoder.writable.getWriter();

    addMessage("contentSerial", cmd + "\n", "out");

    await writer.write(cmd + "\r\n");
    await writer.close();
}

function Send(cmd) {
    let data = new TextEncoder('utf-8').encode(cmd + '\n');
    // console.log(usb_device);

    if (usb_device) {
        return new Promise(function (resolve, reject) {
                console.log("Sending " + cmd);
                addMessage("contentUSB", cmd + "\n", "out");
                if (callback_queue.length === 0) last_callback = Date.now();
                callback_queue.push([resolve, reject])
                RunWatchDog();
                usb_device.transferOut(endpointOut, data);
            }
        );
    }

    // needs to fail on timeout
    return new Promise(function (resolve, reject) {
        if (send_buf.length && send_buf[send_buf.length - 1].length != 20) {
            data = concatTypedArrays(send_buf[send_buf.length - 1], data);
            send_buf = send_buf.slice(0, send_buf.length - 1);
        }
        while (data.length) {
            send_buf.push(data.slice(0, 20));
            data = data.slice(20);
        }

        if (callback_queue.length === 0) last_callback = Date.now();

        callback_queue.push([resolve, reject]);
        RunWatchDog();

        //console.log("======SEND BUF BEGIN===");
        //for (var i = 0; i < send_buf.length; i++) {
        //  console.log(new TextDecoder().decode(send_buf[i]));
        // }
        //console.log("======SEND BUF END===");
        if (!sending) SendNext();
    });
}

function OnStatus(event) {
    console.log("ONSTATUS");
    const data = new TextDecoder().decode(event.target.value);
    console.log('STATUS> ' + data);

    if (status_cb) {
        status_cb(data);
        status_cb = 0;
    }
}

function SendPW(password) {
    // needs to fail on timeout
    return new Promise(function (resolve, reject) {
        status_cb = resolve;
        setTimeout(reject, 2000)
        pw.writeValue(new TextEncoder('utf-8').encode(password));
    });
}

function FIND(id) {
    let ret = document.getElementById(id);
    if (!ret) {
        console.log("Failed to find " + id);
    }
    return ret;
}

function make_select(list, value, fn) {
    let i;
    if (!fn) fn = str => str.toLowerCase();
    if (!list) list = [];
    let contains_value = false;
    for (i = 0; i < list.length; i++) {
        if (value === list[i]) {
            contains_value = true;
            break;
        }

    }
    if (!contains_value) {
        list = list.slice();
        list.push(value);
    }

    let ret = "";
    for (i = 0; i < list.length; i++) {
        ret += "<option value='" + list[i] + "' ";
        if (value === list[i]) ret += " selected";
        ret += ">" + fn(list[i]) + "</option>";
    }
    return ret;
}

function style_arg_edits(blade, style) {
    let ret = "";
    if (named_styles[style]) {
        const args = named_styles[style].ARGS;
        const template_id = named_styles[style].TEMPLATE;

        for (let i = 0; i < args.length; i++) {
            console.log(args[i]);

            let value = arg_storage[template_id + "." + i];
            const title = args[i][1].replaceAll(" ", "&nbsp;");

            console.log(title);
            console.log(value);

            if (!value) {
                value = args[i][2];
            }

            console.log(value);

            if (args[i][0] === "INT") {
                //ret += "<br>" + title;
                //ret += " <input type=text id=style_field" + blade + "." + i + " class=myinput onchange='SaveStyle(" + blade + ")' value=" + value + "><br>";

                ret += "<tr>";
                ret += "<td>" + title + "</td>";
                ret += "<td><input type=text id=style_field" + blade + "." + i + " class=myinput onchange='SaveStyle(" + blade + ")' value=" + value + "></td>";
                ret += "</tr>";
            }

            if (args[i][0] === "COLOR") {
                //ret += "<br>" + title;
                //ret += " <input type=color id=style_field" + blade + "." + i + " class=custom onchange='SaveStyle(" + blade + ")' value=" + from16bitcolor(value) + "><br>";

                ret += "<tr>";
                ret += "<td>" + title + "</td>";
                ret += "<td><input type=color id=style_field" + blade + "." + i + " class=custom onchange='SaveStyle(" + blade + ")' value=" + from16bitcolor(value) + "></td>";
                ret += "</tr>";
            }
        }
    }
    return ret;
}

function style_field_height(style) {
    if (named_styles[style]) {
        const l = named_styles[style].ARGS.filter(arg => arg[0] != "VOID").length;
        return (l * 2 + 5) * 42;
    }
    return 300;
}

function make_style_field(blade, value) {
    arg_storage = {};
    let fields = value.split(' ');
    let style = fields[0];
    fields = fields.slice(1);

    if (style === "builtin") {
        const style_and_args = style + " " + fields[0] + " " + fields[1];

        if (named_styles[style_and_args]) {
            style = style_and_args;
            fields = fields.slice(2);
        }
    }

    let ret = "<div class=setting_preset id='style_edit" + blade + "'>";
    ret += "<span>Blade " + blade + "</span><br>";
    ret += "<select class=myselect id=style_select" + blade + " onchange='OnStyleSelect(" + blade + ")'>";
    ret += make_select(style_lines, style);
    ret += "</select>";

    const template_id = named_styles[style].TEMPLATE;

    for (let i = 0; i < fields.length; i++) {
        arg_storage[template_id + "." + i] = fields[i];
    }

    ret += "<table id=style_container" + blade + ">";
    ret += style_arg_edits(blade, style);
    ret += "";
    ret += "</table>";
    ret += "</div>\n";
    return ret;
}

function OnStyleSelect(blade) {
    const style_select = FIND('style_select' + blade);
    const style = style_select.value;
    const style_container = FIND('style_container' + blade);
    style_container.innerHTML = style_arg_edits(blade, style);

    const style_edit = FIND('style_edit' + blade);
    const height = style_field_height(style);
    style_edit.style.height = height + "px";

    SaveStyle(blade);
}

function SaveStyle(blade) {
    const style_select = FIND('style_select' + blade);
    const style = style_select.value;
    let ret = [style];
    const args = named_styles[style].ARGS;
    const template_id = named_styles[style].TEMPLATE;
    for (let i = 0; i < args.length; i++) {
        const form_field = FIND('style_field' + blade + '.' + i);
        let val;
        if (form_field) {
            val = form_field.value;
            if (val[0] == '#') {
                val = to16bitcolor(val);
            }
        } else {
            val = "~";
        }
        arg_storage[template_id + "." + i] = val;
        ret.push(val);
    }

    console.log("***SAVE STYLE***");
    console.log(ret);
    ret = ret.join(" ");
    presets[current_preset_num]["STYLE" + blade] = ret;
    Send("set_style" + blade + " " + ret);
    SetPreset(current_preset_num) //to make sure it takes immediate effect
}

function SaveName() {
    const name_input = FIND('name_input');
    console.log("SAVE NAME " + name_input.value);
    if (presets[current_preset_num].NAME !== name_input.value) {
        presets[current_preset_num].NAME = name_input.value;
        Send("set_name " + name_input.value);
    }
    const preset_tags = document.getElementsByClassName('preset');
    UpdatePresets();
}

function make_name_field(value) {
    return "<div class=setting><span class=title>Name<br><input style='width: 90%' type=text class=myinput id=name_input value='" + value + "' onchange='SaveName()'></span></div>\n";
}

function SaveVariation() {
    const variation_slider = FIND('variation_slider');
    console.log("SAVE VARIATION " + variation_slider.value);
    if (presets[current_preset_num].VARIATION != variation_slider.value) {
        presets[current_preset_num].VARIATION = variation_slider.value;
        Send("variation " + variation_slider.value);
    }
    const variation_field = FIND('variation_field');
    if (variation_field.value != variation_slider.value) {
        variation_field.value = variation_slider.value; //update numeric value when altered by slider
    }
    const preset_tags = document.getElementsByClassName('preset');
    //	SetPreset(current_preset_num) //no need, variation is always updates directly
    UpdatePresets();
}

function SetVariation() {
    const set_variation_field = FIND('variation_field');
    console.log("SET VARIATION " + set_variation_field.value);
    const set_variation_slider = FIND('variation_slider');
    set_variation_slider.value = set_variation_field.value;
    SaveVariation(); // now do the actual update
}

function UpdateVariation(value) {
    value = parseInt(value, 10);
    const set_variation_slider = FIND('variation_slider');
    const set_variation_field = FIND('variation_field');
    let tmp = parseInt(set_variation_field.value, 10);
    tmp += value;
    tmp &= 32767;  //clamp between min and max slider value, rollover to 0 when too high, rollback to 32767 when negative
    console.log("SET VARIATION " + tmp);
    set_variation_slider.value = tmp;
    set_variation_field.value = tmp;
    SaveVariation(); // now do the actual update
}

function make_variation_field(value) {
    let ret = "<div class=setting>";
    ret += "<span class=title>Variation<br><input type=range min=0 max=32767 class=slider id=variation_slider value='" + value + "' onchange='SaveVariation()'><br>";
    ret += "<input class=myinput2 type='button' id=variation_decrease value='-' onclick='UpdateVariation(-1)' />";
    ret += "<input class=myinput type='number' id=variation_field onchange='SetVariation()' value=" + value + " />";
    ret += "<input class=myinput2 type='button' id=variation_increase value='+' onclick='UpdateVariation(1)' />";
    ret += "</span></div>\n";
    return ret;
}

function SaveFont() {
    const font_select = FIND('font_select');
    console.log("SAVE FONT " + font_select.value);
    if (presets[current_preset_num].FONT != font_select.value) {
        presets[current_preset_num].FONT = font_select.value;
        Send("set_font " + font_select.value);
        SetPreset(current_preset_num) //to make sure it takes immediate effect
    }
}

function make_font_field(value) {
    let ret = "<div class=setting><span class=title>Font<br><select class=myselect id=font_select name=font_select onchange='SaveFont()'>";
    ret += make_select(font_lines, value);
    ret += "</select></span></div>\n";
    return ret;
}

function SaveTrack() {
    const track_select = FIND('track_select');
    console.log("SAVE TRACK " + track_select.value);
    if (presets[current_preset_num].TRACK != track_select.value) {
        presets[current_preset_num].TRACK = track_select.value;
        Send("set_track " + track_select.value);
        SetPreset(current_preset_num) //to make sure it takes immediate effect
    }
}

function make_track_field(value) {
    let ret = "<div class=setting><span class=title>Track<br><select class=myselect id=track_select onchange='SaveTrack()'>";
    ret += make_select(track_lines, value);
    ret += "</select></span></div>\n";
    return ret;
}

function updateEditPane(preset) {
    // TODO: We shouldn't do this part every 5 seconds!
    let tmp = "";
    tmp += make_name_field(presets[preset].NAME) + "<br>";
    tmp += make_font_field(presets[preset].FONT) + "<br>";
    tmp += make_track_field(presets[preset].TRACK) + "<br>";
    tmp += make_variation_field(presets[preset].VARIATION);
    tmp += "";

    for (let blade = 1; presets[preset]["STYLE" + blade]; blade++) {
        tmp += make_style_field(blade, presets[preset]["STYLE" + blade]);
    }

    const edit_pane = FIND('contentEdit');
    edit_pane.innerHTML = tmp;
}

function showCurrentPreset(preset) {
    preset = parseInt(preset);
    if (current_preset_num === preset) return;
    current_preset_num = preset;
    updateCurrentPreset();
}

function updateCurrentPreset() {
    const preset_tags = document.getElementsByClassName('preset');
    for (let i = 0; i < preset_tags.length; i++) {
        if (i === current_preset_num) {
            preset_tags[i].style.background = '#505080';
        } else {
            preset_tags[i].style.background = '#101040';
        }
    }
    if (currentMode === "edit")
        updateEditPane(current_preset_num);
}

async function On() {
    await Send('on');
    FIND('onbutton').className = 'control active';
    FIND('offbutton').className = 'control';
}

async function Off() {
    await Send('off');
    FIND('offbutton').className = 'control';
    FIND('onbutton').className = 'control active';
}

function showCurrentTrack(track) {
    if (track_string !== "") {
        const track_tags = document.getElementsByClassName('track');
        for (let i = 0; i < track_lines.length; i++) {
            if (track_lines[i] === track) {
                track_tags[i].style.background = '#505080';
            } else {
                track_tags[i].style.background = '#101040';
            }
        }
    }
}

async function SetPreset(n) {
    //  showCurrentPreset(n);
    await Send("set_preset " + n);
    showCurrentPreset(n);
}

async function StartDrag(n) {
    console.log('DRAG ' + n);
    //  showCurrentPreset(n);
    dragging = n;
    Send("set_preset " + n);
    showCurrentPreset(n);
}

async function DropEvent(n) {
    console.log('DROP ' + n);
    //  showCurrentPreset(n);
    if (n === dragging) {
        return;
    }
    Send("move_preset " + n);
    const x = presets[dragging];
    presets = presets.slice(0, dragging).concat(presets.splice(dragging + 1, presets.length));
    presets = presets.slice(0, n).concat([x], presets.slice(n, presets.length));
    UpdatePresets();
}

async function AddPreset() {
    const r = confirm("Duplicate current preset?");
    if (r == true) {
        Send("duplicate_preset " + presets.length);
        presets.push(Object.assign({}, presets[current_preset_num]));
        UpdatePresets();
    }
}

async function DelPreset() {
    if (current_preset_num >= 0 &&
        current_preset_num < presets.length &&
        presets.length > 1) {
        Send("delete_preset " + current_preset_num);
        presets.splice(current_preset_num, 1);
        current_preset_num = -1;
        SetPreset(0);
    }
    UpdatePresets();
}

async function DelConfirm() {
    const r = confirm("Delete current preset?");
    if (r == true) {
        DelPreset();
    }
}

async function PlayTrack(track) {
    await Send("play_track " + track);
    showCurrentTrack(track);
}

function SendField() {
    const value = FIND('textField').value;
    Send(value);
    FIND('textField').value = "";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function UpdateSlider(cmd, slider, label, fn) {
    const slider_tag = FIND(slider);
    const label_tag = FIND(label);

    let value = slider_tag.value;
    label_tag.innerHTML = value + "%";

    if (updating_sliders[slider]) return;

    updating_sliders[slider] = true;
    await Send(cmd + " " + (fn ? fn(value) : value));
    updating_sliders[slider] = false;
}

async function UpdateVolume() {
    UpdateSlider("set_volume", "volume", "volume_label");
}

async function onDisconnectedBLE() {
    console.log('Bluetooth Device disconnected');
    Die();

    FIND('reconnecting_message').style.visibility = 'visible';

    while (true) {
        await sleep(5000);
        console.log('Try reconnect');
        try {
            await Connect();
            FIND('reconnecting_message').style.visibility = 'hidden';
            DoRunLoop();
            return;
        } catch (e) {
            console.log(e);
        }
    }
}

async function onDisconnectedUSB() {
    console.log("USB DISCONNECTED");
    Die();
    FIND('disconnected').style.visibility = 'visible';
}

function dumpChar(c) {
    if (!c) return;
    console.log('> UUID:                 ' + c.uuid);
    console.log('> Broadcast:            ' + c.properties.broadcast);
    console.log('> Read:                 ' + c.properties.read);
    console.log('> Write w/o response:   ' + c.properties.writeWithoutResponse);
    console.log('> Write:                ' + c.properties.write);
    console.log('> Notify:               ' + c.properties.notify);
    console.log('> Indicate:             ' + c.properties.indicate);
    console.log('> Signed Write:         ' + c.properties.authenticatedSignedWrites);
    console.log('> Queued Write:         ' + c.properties.reliableWrite);
    console.log('> Writable Auxiliaries: ' + c.properties.writableAuxiliaries);
}

async function Connect() {
    let status;
    try {
        let rxUuid = '713d0002-389c-f637-b1d7-91b361ae7678';
        let txUuid = '713d0003-389c-f637-b1d7-91b361ae7678';
        let pwUuid = '713d0004-389c-f637-b1d7-91b361ae7678';
        let statusUuid = '713d0005-389c-f637-b1d7-91b361ae7678';

        console.log('Connecting to GATT Server...');
        server = await device.gatt.connect();
        console.log(server)
        console.log(device.allowedServices);

        console.log('Getting Service...');
        let service;
        for (const uuid in UARTs) {
            console.log("trying uuid " + uuid);
            try {
                service = await server.getPrimaryService(uuid);
            } catch (e) {
                console.log(e);
                continue;
            }
            rxUuid = UARTs[uuid].rx;
            txUuid = UARTs[uuid].tx;
            pwUuid = UARTs[uuid].pw;
            statusUuid = UARTs[uuid].status;
            break;
        }

        if (!service) throw "No matching service found!";
        // service = await server.getPrimaryService(serviceUuid);
        console.log(service)

        console.log('Getting Characteristics...');
        rx = await service.getCharacteristic(rxUuid);
        tx = await service.getCharacteristic(txUuid);
        if (pwUuid) pw = await service.getCharacteristic(pwUuid);
        if (statusUuid) status = await service.getCharacteristic(statusUuid);

        if (1) {
            dumpChar(rx);
            dumpChar(tx);
            dumpChar(pw);
            dumpChar(status);
        }

        console.log("StartNotify");
        await rx.startNotifications();
        rx.addEventListener('characteristicvaluechanged', OnRX);

        if (status) {
            await status.startNotifications();
            status.addEventListener('characteristicvaluechanged', OnStatus);
        }

        device.addEventListener('gattserverdisconnected', onDisconnectedBLE);
    } catch (e) {
        console.log(e);
        FIND('EMSG').innerHTML = 'Connection Failed';
        throw e;
    }

    if (pw) {
        console.log("Sending PW");
        const password = FIND('password').value;
        status = await SendPW(password);
        if (status === "OK") {
            console.log("Authenticated.");
            localStorage.password = password;
        } else {
            FIND('pwspan').style.display = 'initial';
            if (password !== "") {
                console.log("WRONG PASSWORD!");
                FIND('EMSG').innerHTML = 'Wrong Password';
            }
            throw 'Wrong Password';
        }
    }
}

function UpdateMode() {
    FIND('containerControls').style.display = currentMode === 'normal' ? 'initial' : 'none'
    FIND('containerTracks').style.display = currentMode === 'normal' ? 'initial' : 'none'
    FIND('containerPresets').style.display = currentMode !== 'settings' ? 'initial' : 'none'
    FIND('containerEdit').style.display = currentMode === 'edit' ? 'initial' : 'none';
    FIND('settings_pane').style.display = currentMode === 'settings' ? 'initial' : 'none';
    FIND("editbutton").style.background = currentMode === 'edit' ? '#505080' : '#101040';
    FIND("settingsButton").style.background = currentMode === 'settings' ? '#505080' : '#101040';
    if (currentMode === 'settings') {
        UpdateSettings();
    } else {
        UpdatePresets();
    }
}

function ToggleMode(mode) {
    if (currentMode === mode) {
        currentMode = "normal";
    } else {
        currentMode = mode;
    }
    UpdateMode();
}

function ToggleEditMode() {
    ToggleMode("edit");
}

function ToggleSettingsMode() {
    ToggleMode("settings");
}

function UpdatePresets() {
    let preset_string = "";
    for (let i = 0; i < presets.length; i++) {
        const p = presets[i];
        if (currentMode === "edit") {
            preset_string += "<div draggable=true class=preset ondragstart='StartDrag(" + i + ")' onclick='SetPreset(" + i + ")'  ondrop='DropEvent(" + i + ")'  ondoubleclick='EditPreset(" + i + ")' ondragover='return false'>";
        } else {
            preset_string += "<div class=preset onclick='SetPreset(" + i + ")'>";
        }
        preset_string += "<span class=title>" + p.NAME.replace("\\n", "<br>") + "</span>";
        preset_string += "</div>";
    }
    if (currentMode === "edit") {
        preset_string += "<div class=preset onclick='AddPreset()'>";
        preset_string += "<span class=title>+</span>";
        preset_string += "</div>";
        preset_string += "<div class=preset ondrop='DelPreset()' onclick=DelConfirm()>";
        preset_string += "<span class=title>&#x1F5D1;</span>";
        preset_string += "</div>";
    }
    FIND('presets').innerHTML = preset_string;
    updateCurrentPreset(current_preset_num);
}

async function generateBoolSetting(base_cmd, variable, label) {
    const value = await Send("get_" + base_cmd + " " + variable);

    if (value.startsWith("Whut?")) return "";
    if (value.trim() === "") return "";

    const checked = parseFloat(value) > 0.5 ? "checked" : "";

    return "<div class=setting><span class=title>" + label +
        ": <input type=checkbox class=mycheck id=bool_setting_" + base_cmd + "_" + variable + " " + checked +
        " onchange=\"SaveBoolSetting('" + base_cmd + "','" + variable + "')\"></span></div>\n";
}

function SaveBoolSetting(base_cmd, variable) {
    const value = FIND("bool_setting_" + base_cmd + "_" + variable).checked ? "1" : "0";
    Send("set_" + base_cmd + " " + variable + " " + value);
}

async function generateIntSetting(base_cmd, variable, label) {
    let value = await Send("get_" + base_cmd + " " + variable);
    if (value.startsWith("Whut?")) return "";
    if (value.trim() === "") return "";
    value = Math.round(parseFloat(value));
    return "<div class=setting><span class=title>" + label +
        "<br><input type=text class=myinput id=int_setting_" + base_cmd + "_" + variable + " value='" + value + "'" +
        " onchange=\"SaveIntSetting('" + base_cmd + "','" + variable + "')\"></span></div>\n";
}

function SaveIntSetting(base_cmd, variable) {
    const value = FIND("int_setting_" + base_cmd + "_" + variable).value;
    Send("set_" + base_cmd + " " + variable + " " + value);
}

async function UpdateSettings() {
    FIND("contentSettings").innerHTML = "...";
    let html = "";

    const dimming = await Send("get_blade_dimming");

    if (!dimming.startsWith("Whut?")) {
        const dim_percent = Math.round(Math.pow(parseInt(dimming) / 16384.0, 1.0 / 2.2) * 100);
        html += "<div class=setting id=brightness_setting><span class=title>Brightness<input type=range min=1 max=100 class=slider style='width:90%' id=brightness_input value='" + dim_percent + "' onchange='SaveBrightness()' oninput='SaveBrightness()'><span id=brightness_number>" + dim_percent + "%</span></span></div>\n";
    }
    let threshold = await Send("get_clash_threshold");

    if (!threshold.startsWith("Whut?")) {
        threshold = threshold.trim();
        html += "<div class=setting id=clash_threshold_setting><span class=title>Clash&nbsp;Threshold<input type=range min=0.5 max=6.0 step=0.05 class=slider style='width:90%' id=clash_threshold_input value='" + threshold + "' onchange='SaveClashThreshold()' oninput='SaveClashThreshold()'><span id=clash_threshold_number>" + threshold + "</span></span></div>\n";
    }

    if (max_blade_length) {
        let blade = 1;
        while (true) {
            const tmp = await Send("get_blade_length " + blade);
            if (tmp.startsWith("Whut?")) break;
            let blade_length = parseInt(tmp);
            max_blade_length = parseInt(await Send("get_max_blade_length " + blade));
            if (blade_length === -1) {
                blade_length = max_blade_length;
            }
            if (!blade_length) break;
            html += "<div class=setting><span class=title>Blade " + blade + " length<br><input type=text class=myinput id=blade_length_input_" + blade + " value='" + blade_length + "' onchange='SaveBladeLength(" + blade + "," + max_blade_length + ")'></span></div>\n";
            blade++;
        }
    }

    html += await generateBoolSetting("gesture", "gestureon", "gesture ignition");
    html += await generateBoolSetting("gesture", "swingon", "swing ignition");
    html += await generateIntSetting("gesture", "swingonspeed", "swing on speed");
    html += await generateBoolSetting("gesture", "twiston", "twist ignition");
    html += await generateBoolSetting("gesture", "thruston", "thrust ignition");
    html += await generateBoolSetting("gesture", "stabon", "stab ignition");
    html += await generateBoolSetting("gesture", "twistoff", "twist off");
    html += await generateBoolSetting("gesture", "powerlock", "power lock");
    html += await generateBoolSetting("gesture", "forcepush", "force push");
    html += await generateIntSetting("gesture", "forcepushlen", "force push length");
    html += await generateIntSetting("gesture", "lockupdelay", "lockup delay");
    html += await generateIntSetting("gesture", "clashdetect", "clash detect");
    html += await generateIntSetting("gesture", "maxclash", "max clash strength");

    FIND("contentSettings").innerHTML = html;
}

function SaveBladeLength(blade, max_length) {
    const tag = FIND("blade_length_input_" + blade);
    let length = tag.value;
    if (length > max_length) {
        length = max_length;
    }
    tag.value = length;
    Send("set_blade_length " + blade + " " + length);
}

function SaveBrightness() {
    UpdateSlider("set_blade_dimming", "brightness_input", "brightness_number",
        dim_percent => Math.round(Math.pow(dim_percent / 100.0, 2.2) * 16384));
}

function SaveClashThreshold() {
    const threshold = FIND("clash_threshold_input").value;
    Send("set_clash_threshold " + threshold);
    const threshold_label = FIND("clash_threshold_number");
    threshold_label.innerHTML = threshold;
}

async function Run() {
    FIND('EMSG').innerHTML = '';
    if (!device) {
        const filters = [];
        for (const uuid in UARTs) {
            filters.push({services: [uuid]});
        }

        device = await navigator.bluetooth.requestDevice({
            //     acceptAllDevices: true,
            optionalServices: [serviceUuid],
            //     filters: [{services: [serviceUuid]}]
            filters: filters,
        });

        console.log(device);
    }
    await Connect();
    Run2();
}

async function Run2() {
    FIND('connect_usb').style.visibility = 'hidden';
    FIND('connect_ble').style.visibility = 'hidden';

    let preset;
    let preset_string;

    while (true) {
        preset_string = await Send("list_presets");
        if (preset_string.split("=").length > 3) break;
    }

    const lines = preset_string.split("\n");

    for (let l = 0; l < lines.length; l++) {
        const tmp = lines[l].split("=");

        if (tmp.length > 1) {
            if (tmp[0] === "FONT") {
                if (preset) presets.push(preset);
                preset = {}
            }
            preset[tmp[0]] = tmp.slice(1).join("=");
        }
    }

    if (preset && Object.keys(preset).length > 0) presets.push(preset);

    UpdatePresets();
    DoRunLoop()
}

async function RunSerial() {
    FIND('EMSG').innerHTML = '';
    const ports = await navigator.serial.getPorts();

    if (ports.length === 1) {
        serial_port = ports[0];
    } else {
        console.log(filters);
        serial_port = await navigator.serial.requestPort({'filters': filters});
    }

    // Wait for the serial port to open.
    await serial_port.open({ baudRate: 9600 });


    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = serial_port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable
        .pipeThrough(new TransformStream(new LineBreakTransformer()))
        .getReader();

    FIND('connect_serial').style.visibility = 'hidden';

    getVersion();

    FIND("topbutton").style.visibility = 'visible';


    // Listen to data coming from the serial device.
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            // Allow the serial port to be closed later.
            reader.releaseLock();
            break;
        }
        // value is a string.
        //console.log(value);
        OnSerialData(value);
    }
}



async function RunUSB() {
    FIND('EMSG').innerHTML = '';

    const usb_devices = await navigator.usb.getDevices();

    if (usb_devices.length === 1) {
        usb_device = usb_devices[0];
    } else {
        usb_device = await navigator.usb.requestDevice({'filters': filters});
    }
    await usb_device.open();

    if (usb_device.configuration === null) {
        await usb_device.selectConfiguration(1);
    }

    console.log(usb_device);

    FIND("txtManufact").innerHTML = usb_device.manufacturerName;
    FIND("txtProduct").innerHTML = usb_device.productName;
    FIND("txtSerial").innerHTML = usb_device.serialNumber;

    let interfaceNumber;

    endpointOut = -1;
    endpointIn = -1;

    usb_device.configuration.interfaces.forEach(element => {
        element.alternates.forEach(elementalt => {

            console.log(elementalt);

            if (elementalt.interfaceClass === 0xff) {
                interfaceNumber = element.interfaceNumber;

                elementalt.endpoints.forEach(elementendpoint => {
                    if (elementendpoint.direction === "out") endpointOut = elementendpoint.endpointNumber;
                    if (elementendpoint.direction === "in") endpointIn = elementendpoint.endpointNumber;
                })
            }
        })
    })

    console.log("OUT EP", endpointOut, "IN EP", endpointIn);

    if (endpointOut === -1 || endpointIn === -1) {
        usb_device = undefined;
        FIND('EMSG').innerHTML = "No Webusb interface found"
        return;
    }

    navigator.usb.ondisconnect = onDisconnectedUSB;

    await usb_device.claimInterface(interfaceNumber);
    await usb_device.selectAlternateInterface(interfaceNumber, 0);
    await usb_device.controlTransferOut({
        'requestType': 'class',
        'recipient': 'interface',
        'request': 0x22,
        'value': 0x01,
        'index': interfaceNumber
    });

    usb_device.transferOut(endpointOut, new TextEncoder('utf-8').encode("\n\n"));
    Run2();

    while (true) {
        const data = await usb_device.transferIn(endpointIn, 64);
        OnData(data.data);
    }
}

async function DoRunLoop() {
    console.log('DoRunLoop');
    if (!loop_running) {
        loop_running = true;
        try {
            await Loop();
        } finally {
            console.log('Loop exit!');
            loop_running = false;
        }
    }
}

async function GetList(cmd) {
    const s = await Send(cmd);
    if (s.startsWith("Whut?")) {
        return [];
    }
    const ret = s.split("\n");
    ret.pop();  // remove empty line at end
    return ret;
}

async function HasCmd(cmd) {
    const s = await Send(cmd);
    return !s.startsWith("Whut?");
}

async function HasDir(dir) {
    const entries = await GetList("dir " + dir);
    return !(entries.length === 1 && entries[0] === "No such directory.");
}

async function Loop() {
    let tmp;
    let template_ids;

    let max_blade_answer;
    while (true) {
        const preset = await Send("get_preset");
        showCurrentPreset(preset);

        let current_track = await Send("get_track");
        current_track = current_track.split("\n")[0];
        showCurrentTrack(current_track);

        const volume = await Send("get_volume");
        FIND('volume').value = parseInt(volume);
        FIND('volume_label').innerHTML = volume;

        const voltage = await Send("battery_voltage");
        FIND('voltage').innerHTML = voltage;

        const on = await Send("get_on");

        if (parseInt(on)) {
            FIND('onbutton').style.background = '#505080';
            FIND('offbutton').style.background = '#101040';
        } else {
            FIND('offbutton').style.background = '#505080';
            FIND('onbutton').style.background = '#101040';
        }

        // It will give a short click, but only the first time, after track_list has been populated
        // this is no longer executed. It is annoying if tracks are not shown, when connecting
        // with a inited or track_playing saber. Looks like the app is broken...
        if (!tracks_listed) {
            let i;
            let l;

            tracks_listed = true;
            track_lines = await GetList("list_tracks");
            track_string = "";

            for (l = 0; l < track_lines.length; l++) {
                const track = track_lines[l];
                // console.log(escape(track));
                if (track.length > 4) {
                    tmp = track.split('/');
                    const title = tmp[tmp.length - 1].split('.')[0].toLowerCase();
                    // console.log(title);
                    // TODO: quote track properly
                    track_string += "<div class=track onclick='PlayTrack(\"" + escape(track) + "\")'>";
                    track_string += "<span class=title>" + title + "</span>";
                    track_string += "</div>";
                }
            }

            FIND('tracks').innerHTML = track_string;
            const has_common = await HasDir("common");
            font_lines = await GetList("list_fonts");

            if (has_common) {
                for (i = 0; i < font_lines.length; i++) {
                    font_lines[i] += ";common";
                }
            }

            style_lines = await GetList("list_named_styles");
            named_styles = {};
            template_ids = [];

            for (i = 0; i < style_lines.length; i++) {
                let j;
                // console.log(style_lines[i]);
                const desc = await GetList("describe_named_style " + style_lines[i]);
                // console.log(desc);
                // console.log(desc[0]);
                const arg_string = desc[0];
                const args = arg_string.split(",");
                for (j = 1; j < args.length; j++) {
                    args[j] = args[j].trim();
                }

                let arguments = [];
                // if (args.length != desc.length) {
                // console.log("WARNING: "+style_lines[i]+" has wrong number of descriptive arguments");
                // }
                for (j = 1; j < desc.length; j++) {
                    const default_arguments = desc[j].split(" ");
                    // TYPE, DESC, DEFAULT
                    arguments.push([default_arguments[0], args[j], default_arguments[1]]);

                    if (args[j]) {
                        const last_word = args[j].split(" ").pop();

                        if (last_word === "color" && default_arguments[0] === "INT") {
                            console.warn("WARNING: " + style_lines[i] + " argument " + i + " desc says color, but is int.");
                        }

                        if (last_word === "time" && default_arguments[0] === "COLOR") {
                            console.warn("WARNING: " + style_lines[i] + " argument " + i + " desc says time, but is color.");
                        }
                    }
                }

                if (style_lines[i].split(" ")[0] === "builtin") {
                    arguments = arguments.slice(2);
                }

                // Group compatible templates for argument saving.
                let best_matches = -1;
                const styles_so_far = Object.keys(named_styles);
                let template_id = styles_so_far.length;

                for (j = 0; j < template_ids.length; j++) {
                    const tid = template_ids[j];
                    let compatible = true;
                    let matches = 0;

                    for (l = 0; l < styles_so_far.length && compatible; l++) {
                        tmp = named_styles[styles_so_far[l]];
                        if (tmp.TEMPLATE !== tid) continue;

                        if (arg_string !== tmp.ARG_STRING) {
                            compatible = false;
                            break;
                        }

                        let matching_args = 0;

                        for (let k = 0; k < Math.min(arguments.length, tmp.ARGS.length); k++) {
                            if (arguments[k][0] === "VOID") continue;
                            if (tmp.ARGS[k][0] === "VOID") continue;
                            if (arguments[k][0] === tmp.ARGS[k][0]) {
                                matching_args = 0;
                            } else {
                                compatible = false;
                                break;
                            }
                        }

                        matches = Math.max(matches, matching_args);
                    }

                    if (compatible && matches > best_matches) {
                        best_matches = matches;
                        template_id = tid;
                    }
                }

                template_ids.push(template_id);

                named_styles[style_lines[i]] = {
                    NAME: style_lines[i],
                    DESC: args[0],
                    ARG_STRING: arg_string,
                    ARGS: arguments,
                    TEMPLATE: template_id
                };
            }

            if (Object.keys(named_styles).length > 0) {
                console.log("ENABLING EDITING");
                FIND("editbutton").style.visibility = 'visible';
            }

            max_blade_answer = await Send("get_max_blade_length 1");
            max_blade_length = parseInt(max_blade_answer);

            const hasDimming = await HasCmd("get_blade_dimming");
            const hasThreshold = await HasCmd("get_clash_threshold");
            const hasGetGesture = await HasCmd("get_gesture test");

            if (max_blade_length || hasDimming || hasThreshold | hasGetGesture) {
                console.log("ENABLING SETTINGS");
                FIND("settingsButton").style.visibility = 'visible';
            }
        }

        // TODO: temp
        await sleep(5000);
    }
}

function from16bitlinear(val) {
    val = parseInt(val);
    val = Math.round(Math.pow(val / 65535.0, 1.0 / 2.2) * 255.0);
    return Number(1024 + val).toString(16).slice(-2);
}

function from16bitcolor(val) {
    val = val.split(",");
    return "#" + from16bitlinear(val[0]) + from16bitlinear(val[1]) + from16bitlinear(val[2]);
}

function to16bitlinear(val) {
    val = parseInt(val, 16);
    val = Math.round(Math.pow(val / 255.0, 2.2) * 65535);
    return val;
}

function to16bitcolor(val) {
    return to16bitlinear(val.substr(1, 2)) + "," +
        to16bitlinear(val.substr(3, 2)) + "," +
        to16bitlinear(val.substr(5, 2));
}

function concatTypedArrays(a, b) { // a, b TypedArray of same type
    const c = new (a.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
}

function Init() {
    console.log("VERSION: $Id: 4edfd53c3b9972c337d0aced34279f3983ca81d4 $");
    console.log(document.lastModified);

    let err = true;

    if (localStorage.password) {
        FIND('password').value = localStorage.password;
    }
    if (navigator.usb) {
        FIND('connect_usb').style.visibility = 'visible';
        err = false;
    }
    if (navigator.serial) {
        FIND('connect_serial').style.visibility = 'visible';
        err = false;
    }
    if (navigator.bluetooth) {
        FIND('connect_ble').style.visibility = 'visible';
        err = false;
    }
    if (err) {
        FIND('EMSG').innerHTML = "This browser supports neither webusb nor web bluetooth.";
    }
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function () {
        console.log('Service Worker Registered');
    });
}


window.addEventListener("load", Init);


