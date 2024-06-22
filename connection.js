

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

let buffer = "";

let watchdog_running = false;
let presets = [];
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

function addMessage(dest, txt, dir){
    const console = document.getElementById(dest);

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
            document.getElementById("txtVersion").innerHTML = version;
        }

        if(data.indexOf(": ") > 0) {
            let d = data.split(": ");
            switch(d[0]){
                case "prop":
                    document.getElementById("txtProp").innerHTML = d[1];
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

function OnRX(event) {
    OnData(event.target.value);
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
        if (send_buf.length && send_buf[send_buf.length - 1].length !== 20) {
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

async function onDisconnectedBLE() {
    console.log('Bluetooth Device disconnected');
    Die();

    while (true) {
        await sleep(5000);
        console.log('Try reconnect');
        try {
            await Connect();
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
    document.getElementById("usb_connected").className = "";
    document.getElementById("ble_connected").className = "";
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

async function Run() {
    displayError("", false);

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
    document.getElementById("usb_connected").className = "connected";
    //document.getElementById("ble_connected").className = "connected";

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
    displayError("", false);

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

    getVersion();

    document.getElementById("serial_connected").className = "connected";


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
    displayError("", false);

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

    currentDevice = {
        manufacturerName: usb_device.manufacturerName,
        productName: usb_device.productName,
        serialNumber: usb_device.serialNumber
    }

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
        displayError("No Webusb interface found", true);
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

    document.getElementById("usb_connected").className = "connected";

    usb_device.transferOut(endpointOut, new TextEncoder('utf-8').encode("\n\n"));
    //Run2();
    //DoRunLoop()

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

function getVersion(){
    versionLoaded = false;
    SendSerial("version");
}
