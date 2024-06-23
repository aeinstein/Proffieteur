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

    constructor() {
        this.bc = new BroadcastChannel('proffiediag');

        this.bc.onmessage = async (ev) => {
            console.log(ev);

            if (ev.data.send_usb) this.send(ev.data.send_usb);

            switch (ev.data) {
                case "connect_ble":
                    await this.connect();
                    this.
                    break;
            }
        };
    }

    async connect() {
        if (!this.device) {
            const filters = [];
            for (const uuid in this.UARTs) {
                filters.push({services: [uuid]});
            }

            this.device = await navigator.bluetooth.requestDevice({
                //     acceptAllDevices: true,
                optionalServices: [serviceUuid],
                //     filters: [{services: [serviceUuid]}]
                filters: filters,
            });

            console.log(device);
        }

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

    async runLoop() {
        this.bc.postMessage("ble_connected");

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

        this.bc.postMessage({"presets": preset});
    }
}