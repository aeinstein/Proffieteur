class USB {
    usbProductId = 0x6668;
    usbVendorId = 0x1209;

    filters = [
        {
            'vendorId': this.usbVendorId,
            'productId': this.usbProductId
        }
    ];

    buffer;
    endpointIn;
    endpointOut;
    usb_device;
    callback_queue = [];
    bc;

    constructor() {
        this.bc = new BroadcastChannel('proffiediag');

        this.bc.onmessage = (ev) => {
            //console.log(ev);

            if (ev.data.send_usb) this.send(ev.data.send_usb);

            if(ev.data.blade_id) this.listPresets();    // refresh presets when blade changed

            if(ev.data.play_track) this.send("play_track " + ev.data.play_track);

            switch (ev.data) {
            case "connect_usb":
                this.connect();
                break;

            case "disconnect_usb":
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

    async connect() {
        const usb_devices = await navigator.usb.getDevices();

        if (usb_devices.length === 1) {
            this.usb_device = usb_devices[0];
        } else {
            this.usb_device = await navigator.usb.requestDevice({'filters': this.filters});
        }

        await this.usb_device.open();

        if (this.usb_device.configuration === null) {
            await this.usb_device.selectConfiguration(1);
        }

        console.log(this.usb_device);

        this.currentDevice = {
            manufacturerName: this.usb_device.manufacturerName,
            productName: this.usb_device.productName,
            serialNumber: this.usb_device.serialNumber
        }

        localStorage.setItem("CURRENT_DEVICE", JSON.stringify(this.currentDevice));

        let interfaceNumber;

        this.endpointOut = -1;
        this.endpointIn = -1;

        this.usb_device.configuration.interfaces.forEach(element => {
            element.alternates.forEach(elementalt => {

                console.log(elementalt);

                if (elementalt.interfaceClass === 0xff) {
                    interfaceNumber = element.interfaceNumber;

                    elementalt.endpoints.forEach(elementendpoint => {
                        if (elementendpoint.direction === "out") this.endpointOut = elementendpoint.endpointNumber;
                        if (elementendpoint.direction === "in") this.endpointIn = elementendpoint.endpointNumber;
                    })
                }
            })
        })

        console.log("OUT EP", this.endpointOut, "IN EP", this.endpointIn);

        if (this.endpointOut === -1 || this.endpointIn === -1) {
            this.usb_device = undefined;

            this.bc.postMessage({error: "No Webusb interface found"});
            return;
        }

        navigator.usb.ondisconnect = ()=>{
            this.onDisconnected();
        };

        console.log("claim");
        await this.usb_device.claimInterface(interfaceNumber);

        console.log("select");
        await this.usb_device.selectAlternateInterface(interfaceNumber, 0);

        console.log("control");
        await this.usb_device.controlTransferOut({
            'requestType': 'class',
            'recipient': 'interface',
            'request': 0x22,
            'value': 0x01,
            'index': interfaceNumber
        });


        this.bc.postMessage({currentDevice: this.currentDevice});

        setTimeout(()=>{
            this.runLoop();
        }, 10);

        this.usb_device.transferOut(this.endpointOut, new TextEncoder('utf-8').encode("\n\n"));
    }

    disconnect(){
        console.log("disconnect USB");
        this.usb_device.close();
        this.onDisconnected();
    }

    async runLoop() {
        this.bc.postMessage("usb_connected");

        try {
            while (true) {
                const data = await this.usb_device.transferIn(this.endpointIn, 64);
                this.onData(data.data);
            }

        } catch(e){
            this.die();
        }
    }

    onData(data){
        const d1 = new TextDecoder().decode(data);

        this.buffer += d1;

        let tmp = this.buffer.split("-+=END_OUTPUT=+-");

        if (tmp.length > 1) {
            this.buffer = tmp[1];
            let ret = tmp[0];

            tmp = ret.split("-+=BEGIN_OUTPUT=+-\n");

            if (tmp.length > 1) ret = tmp[1];

            ret = ret.split("\r").join("");

            // failsave: sometimes there is no empty line at end
            if(ret.substring(ret.length - 1) !== "\n") ret += "\n";

            console.log('> ' + ret);
            this.bc.postMessage({"usb_data": ret, "dir": "in"});

            if (this.callback_queue.length) {
                this.last_callback = Date.now();
                this.callback_queue[0][0](ret);     // call resolve
                this.callback_queue = this.callback_queue.slice(1);
            }
        }
    }

    send(cmd){
        let data = new TextEncoder('utf-8').encode(cmd + '\n');

        if (this.usb_device) {
            return new Promise((resolve, reject) => {
                console.log("Sending " + cmd);

                if (this.callback_queue.length === 0) this.last_callback = Date.now();
                this.callback_queue.push([resolve, reject]);

                this.bc.postMessage({"usb_data": cmd, "dir": "out"});
                this.usb_device.transferOut(this.endpointOut, data);
            });
        }
    }

    watchdog() {
        if (this.callback_queue.length && !this.watchdog_running) {
            this.watchdog_running = true;
            setTimeout(WatchDog, 10000);
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

    async onDisconnected() {
        console.log("USB DISCONNECTED");
        this.bc.postMessage("usb_disconnected");
        this.die();
    }

    die(e) {
        for (let i = 0; i < this.callback_queue.length; i++) this.callback_queue[i][1](e);
        this.callback_queue = [];
    }
}

