class BLE {
    serviceUuid = '713d0000-389c-f637-b1d7-91b361ae7678';

    UARTs = {
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
    device;
    rx;
    tx;
    pw;
    status;
    server;
    send_buf = [];
    callback_queue = [];
    bc;
    sending;
    watchdog_running = false;
    connected = false;

    constructor() {
        this.bc = new BroadcastChannel('proffiediag');

        this.bc.onmessage = (ev) => {
            if(!this.connected){
                if(ev.data === "connect_ble") this.connect();
                return;
            }

            if(ev.data.send_ble) this.send(ev.data.send_ble);
            if(ev.data.blade_id) this.listPresets();    // refresh presets when blade changed
            if(ev.data.play_track) this.send("play_track " + ev.data.play_track);

            switch (ev.data) {
                case "disconnect_ble":
                case "disconnect_all":
                    this.disconnect();
                    break;

                case "list_tracks":
                    this.listTracks();
                    break;

                case "list_named_styles":
                    this.listNamedStyles();
                    break;

                case "list_presets":
                    this.listPresets();
                    break;

                case "list_fonts":
                    this.listFonts();
                    break;

                case "get_presets":
                    this.getPresetSettings();
                    break;
            }
        };
    }

    send(cmd) {
        let data = new TextEncoder('utf-8').encode(cmd + '\n');
        this.bc.postMessage({"ble_data": cmd, "dir": "out"});

        // needs to fail on timeout
        return new Promise((resolve, reject) => {
            if (this.send_buf.length && this.send_buf[this.send_buf.length-1].length !== 20) {
                data = concatTypedArrays(this.send_buf[this.send_buf.length-1], data);
                this.send_buf = this.send_buf.slice(0, this.send_buf.length-1);
            }
            while (data.length) {
                this.send_buf.push(data.slice(0, 20));
                data = data.slice(20);
            }
            if (this.callback_queue.length === 0)
                this.last_callback = Date.now();

            this.callback_queue.push([resolve, reject]);
            this.RunWatchDog();

            //console.log("======SEND BUF BEGIN===");
            //for (var i = 0; i < send_buf.length; i++) {
            //  console.log(new TextDecoder().decode(send_buf[i]));
            // }
            //console.log("======SEND BUF END===");
            if (!this.sending) this.SendNext();
        });
    }

    SendNext() {
        if (!this.current_packet) {
            if (!this.send_buf.length) {
                this.sending = false;
                return;
            }
            this.current_packet = this.send_buf[0];
            this.send_buf = this.send_buf.slice(1);
        }
        console.log("Sending " + (new TextDecoder().decode(this.current_packet)));
        this.sending = true;

        this.tx.writeValue(this.current_packet).then(
            (v) => {
                this.current_packet = 0;
                this.SendNext();
            },

            (e) => {
                console.log('rejected', e);
                this.die();
                setTimeout(this.runLoop, 10000);
            });
    }

    RunWatchDog() {
        if (this.callback_queue.length && !this.watchdog_running) {
            this.watchdog_running = true;
            setTimeout(()=>{
                this.WatchDog();
            }, 10000);
        }
    }

    WatchDog() {
        this.watchdog_running = false;

        if ((Date.now() - this.last_callback) > 20000) {
            this.die("timeout");
            setTimeout(this.runLoop, 10000);
        }
        this.RunWatchDog();
    }

    async connect() {
        if (!this.device) {
            const filters = [];

            for (const uuid in this.UARTs) {
                filters.push({services: [uuid]});
            }

            this.device = await navigator.bluetooth.requestDevice({
                //     acceptAllDevices: true,
                optionalServices: [this.serviceUuid],
                //     filters: [{services: [serviceUuid]}]
                filters: filters,
            });

            console.log(this.device);
        }

        try {
            let rxUuid = '713d0002-389c-f637-b1d7-91b361ae7678';
            let txUuid = '713d0003-389c-f637-b1d7-91b361ae7678';
            let pwUuid = '713d0004-389c-f637-b1d7-91b361ae7678';
            let statusUuid = '713d0005-389c-f637-b1d7-91b361ae7678';

            console.log('Connecting to GATT Server...');
            this.server = await this.device.gatt.connect();
            console.log(this.server)
            console.log(this.device.allowedServices);

            console.log('Getting Service...');

            let service;
            for (const uuid in this.UARTs) {
                console.log("trying uuid " + uuid);
                try {
                    service = await this.server.getPrimaryService(uuid);

                } catch (e) {
                    console.log(e);
                    continue;
                }

                rxUuid = this.UARTs[uuid].rx;
                txUuid = this.UARTs[uuid].tx;
                pwUuid = this.UARTs[uuid].pw;
                statusUuid = this.UARTs[uuid].status;
                break;
            }

            if (!service) throw "No matching service found!";
            // service = await server.getPrimaryService(serviceUuid);
            console.log(service)

            console.log('Getting Characteristics...');

            this.rx = await service.getCharacteristic(rxUuid);
            this.tx = await service.getCharacteristic(txUuid);
            if (pwUuid) this.pw = await service.getCharacteristic(pwUuid);
            if (statusUuid) this.status = await service.getCharacteristic(statusUuid);


            if (1) {
                this.dumpChar(this.rx);
                this.dumpChar(this.tx);
                this.dumpChar(this.pw);
                this.dumpChar(this.status);
            }

            console.log("StartNotify");
            await this.rx.startNotifications();
            this.rx.addEventListener('characteristicvaluechanged', (e)=>{
                this.OnRX(e);
            });

            if (this.status) {
                await this.status.startNotifications();
                this.status.addEventListener('characteristicvaluechanged', (e)=>{
                    this.OnStatus(e);
                });
            }

            this.device.addEventListener('gattserverdisconnected', (e)=>{
                this.onDisconnectedBLE(e);
            });

            this.connected = true;
            this.bc.postMessage("ble_connected");
            this.send("version");
            this.runLoop();

        } catch (e) {
            console.log(e);
            this.bc.postMessage({error: e.message});
            return;
        }

        /*
        if(this.pw) {
            console.log("Sending PW");
            const password = FIND('password').value;

            this.status = await this.SendPW(password);

            if (this.status === "OK") {
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
        }*/
    }

    dumpChar(c) {
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

    async onDisconnectedBLE() {
        console.log("BLE DISCONNECTED");
        this.bc.postMessage("ble_disconnected");
        this.connected = false;
        this.die();


        while (true) {
            await sleep(5000);
            console.log('Try reconnect ble');

            try {
                await this.connect();
                FIND('reconnecting_message').style.visibility = 'hidden';
                this.runLoop();
                return;

            } catch (e) {
                console.log(e);
            }
        }
    }

    die(e) {
        for (let i = 0; i < this.callback_queue.length; i++) this.callback_queue[i][1](e);
        this.callback_queue = [];
    }

    OnStatus(event) {
        console.log("ONSTATUS");
        const data = new TextDecoder().decode(event.target.value);
        console.log('STATUS> ' + data);

        if(this.status_cb) {
            this.status_cb(data);
            this.status_cb = 0;
        }
    }

    OnRX(event) {
        console.log(event);

        this.OnData(event.target.value);
    }

    OnData(d){
        const data = new TextDecoder().decode(d);
        console.log("GOT DATA: " + data);

        this.buffer += data;

        let tmp = this.buffer.split("-+=END_OUTPUT=+-");

        if (tmp.length > 1) {
            this.buffer = tmp[1];
            let ret = tmp[0];

            tmp = ret.split("-+=BEGIN_OUTPUT=+-\n");

            if (tmp.length > 1) ret = tmp[1];

            ret = ret.split("\r").join("");

            const lines = ret.split("\n");
            for(let i= 0; i< lines.length;i++){
                this.bc.postMessage({"ble_data": lines[i], "dir": "in"});
            }

            console.log('> ' + ret);

            if (this.callback_queue.length) {
                this.last_callback = Date.now();
                this.callback_queue[0][0](ret);
                this.callback_queue = this.callback_queue.slice(1);
            }
        }
    }

    async getList(cmd) {
        const s = await this.send(cmd);

        if (s.startsWith("Whut?")) {
            return [];
        }
        const ret = s.split("\n");
        ret.pop();  // remove empty line at end
        return ret;
    }

    async hasCmd(cmd) {
        const s = await this.send(cmd);
        return !s.startsWith("Whut?");
    }

    async hasDir(dir) {
        const entries = await this.getList("dir " + dir);
        return !(entries.length === 1 && entries[0] === "No such directory.");
    }

    async listTracks() {
        let track_lines = await this.getList("list_tracks");
        this.bc.postMessage({"tracks": track_lines});
        localStorage.setItem("TRACKS", JSON.stringify(track_lines));

        let current_track = await this.send("get_track");
        current_track = current_track.split("\n")[0];
        this.bc.postMessage({"currentTrack": current_track});
    }

    async listNamedStyles() {
        let style_lines = await this.getList("list_named_styles");
        this.bc.postMessage({"named_styles": style_lines});


        for (let i = 0; i < style_lines.length; i++) {
            let desc = await this.getList("describe_named_style " + style_lines[i]);
            this.bc.postMessage({"named_style": style_lines[i], desc: desc});
        }
    }

    async listFonts() {
        const has_common = await this.hasDir("common");
        let font_lines = await this.getList("list_fonts");

        localStorage.setItem("FONTS", JSON.stringify(font_lines));

        if (has_common) {
            for (let i = 0; i < font_lines.length; i++) {
                font_lines[i] += ";common";
            }
        }


        this.bc.postMessage({"fonts": font_lines});
    }

    async listPresets() {
        let preset;
        let presets = [];
        let preset_string = await this.send("list_presets");

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

        this.bc.postMessage({"presets": presets });

        let current_preset = await this.send("get_preset");
        current_preset = current_preset.split("\n")[0];
        this.bc.postMessage({"currentPreset": current_preset});
    }

    async getPresetSettings() {
        await this.listPresets();
        await this.listTracks();
        await this.listFonts();
        await this.listNamedStyles();
    }

    SendPW(password) {
        // needs to fail on timeout
        return new Promise((resolve, reject) =>{
            this.status_cb = resolve;
            setTimeout(reject, 2000)
            this.pw.writeValue(new TextEncoder('utf-8').encode(password));
        });
    }


    async runLoop() {
        console.log("runLoop BLE");
        const voltage = await this.send("battery_voltage");
        this.bc.postMessage({"battery": voltage});

        const volume = await this.send("get_volume");
        this.bc.postMessage({"volume": volume});

        setTimeout(()=>{
            this.runLoop();
        }, 5000);
    }

}