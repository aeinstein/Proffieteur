let callback_queue = [];

class USB {
    usbProductId = 0x6668;
    usbVendorId = 0x1209;

    filters = [
        {
            'usbVendorId': this.usbVendorId,
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
            console.log(ev);

            if (ev.data.send_usb) this.send(ev.data.send_usb);

            if(ev.data.play_track) this.send("play_track " + ev.data.play_track);

            if(ev.data.describe_named_style) {
                this.describeNamedStyle(ev.data.describe_named_style)
            }

            switch (ev.data) {
            case "connect_usb":
                this.connect();
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

        navigator.usb.ondisconnect = this.onDisconnected;

        await this.usb_device.claimInterface(interfaceNumber);
        await this.usb_device.selectAlternateInterface(interfaceNumber, 0);
        await this.usb_device.controlTransferOut({
            'requestType': 'class',
            'recipient': 'interface',
            'request': 0x22,
            'value': 0x01,
            'index': interfaceNumber
        });


        this.bc.postMessage({currentDevice: this.currentDevice});

        this.usb_device.transferOut(this.endpointOut, new TextEncoder('utf-8').encode("\n\n"));

        setTimeout(()=>{
            this.runLoop();
        }, 10);

    }

    async runLoop() {
        this.bc.postMessage("usb_connected");

        while (true) {
            const data = await this.usb_device.transferIn(this.endpointIn, 64);
            this.onData(data.data);
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
    }

    async listNamedStyles() {
        let style_lines = await this.getList("list_named_styles");
        this.bc.postMessage({"named_styles": style_lines});
    }

    async describeNamedStyle(style){
        let desc = await this.getList("describe_named_style " + style);

        console.log("style", desc);
        this.bc.postMessage({"named_style": style, desc: desc});
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
    }

    async onDisconnected() {
        console.log("USB DISCONNECTED");
        this.bc.postMessage("usb_disconnected");
        Die();
    }
}

