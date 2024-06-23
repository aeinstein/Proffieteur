class Serial {
    usbProductId = 0x6668;
    usbVendorId = 0x1209;

    processes = {};
    topCalled = false;
    serial_port;
    bc;

    versionLoaded;
    reader;
    topPID;

    constructor() {
        this.bc = new BroadcastChannel('proffiediag');

        this.bc.onmessage = (ev)=> {
            console.log(ev);

            if(ev.data.send_serial) this.send(ev.data.send_serial);

            switch(ev.data){
                case "startTop":
                    this.startTop();
                    break;

                case "stopTop":
                    this.stopTop();
                    break;

                case "connect_serial":
                    this.connect();
                    break;
            }
        };
    }

    startTop(){
        this.topPID = window.setInterval(() => {
            this.topCalled = true;
            this.send("top");
        }, 5000);

        this.topCalled = true;
        this.send("top").then(()=>{
            this.bc.postMessage({"monitor": "started"});
        });
    }

    stopTop(){
        if(this.topPID >= 0) window.clearInterval(this.topPID);
        this.topPID = -1;
        this.bc.postMessage({"monitor": "stopped"});
    }

    async connect() {
        const ports = await navigator.serial.getPorts();

        if (ports.length === 1) {
            this.serial_port = ports[0];

        } else {
            console.log(filters);
            this.serial_port = await navigator.serial.requestPort({'filters': this.usbVendorId});
        }

        // Wait for the serial port to open.
        await this.serial_port.open({ baudRate: 9600 });


        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = this.serial_port.readable.pipeTo(textDecoder.writable);
        this.reader = textDecoder.readable
            .pipeThrough(new TransformStream(new LineBreakTransformer()))
            .getReader();

        setTimeout(()=>{
            this.runLoop();
        }, 10);

        this.send("version");

    }

    async runLoop() {
        this.bc.postMessage("serial_connected");

        // Listen to data coming from the serial device.
        while (true) {
            const {value, done} = await this.reader.read();

            if (done) {
                // Allow the serial port to be closed later.
                this.reader.releaseLock();
                break;
            }
            // value is a string.
            //console.log(value);
            this.onData(value);
        }
    }

    onData(data){
        console.log('> ' + data);

        this.bc.postMessage({"serial_data": data, "dir": "in"});

        if(data.match("Battery voltage: ")){
            let d = data.split(": ");
            this.bc.postMessage({"battery": d[1]});
        }

        if(!this.versionLoaded) {
            let matches = data.match("v([0-9])*\.([0-9]*)");

            if(matches){
                let version = matches[1] + "." + matches[2];
                this.bc.postMessage({"version": version});
            }

            if(data.indexOf(": ") > 0) {
                let d = data.split(": ");
                switch(d[0]){
                    case "prop":
                        this.bc.postMessage({"prop": d[1]});
                        break;

                    case "buttons":
                        this.bc.postMessage({"buttons": d[1]});
                        break;

                    case "installed":
                        this.bc.postMessage({"installdate": d[1]});
                        this.versionLoaded = true;
                        break;
                }
            }

            if(data.startsWith("config/")) this.bc.postMessage({"config": data});
        }

        if(this.topCalled){
            if(data.indexOf(": ") > 0) {
                let d = data.split(": ");
                this.processes[d[0]] = d[1];

                if(d[0] === "MonitorHelper loop") {
                    this.topCalled = false;
                    this.bc.postMessage({"processes": this.processes});
                }
            }
        }
    }

    async send(cmd) {
        const textEncoder = new TextEncoderStream();
        const writableStreamClosed = textEncoder.readable.pipeTo(this.serial_port.writable);

        const writer = textEncoder.writable.getWriter();

        this.bc.postMessage({"serial_data": cmd, "dir": "out"});

        await writer.write(cmd + "\r\n");
        await writer.close();
    }
}
