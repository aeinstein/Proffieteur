import {dfu} from "./dfu.js";
import {dfuse} from "./dfuse.js"

export class Flasher{
    device;
    bc;
    transferSize = 1024;
    manifestationTolerant = true;
    maxSize = -1;
    dfuDisplay;
    statusDisplay;
    infoDisplay;
    firmwareFile;

    constructor() {
        this.bc = new BroadcastChannel('proffiediag');

        this.dfuDisplay = document.getElementById("dfuDisplay");
        this.statusDisplay = document.getElementById("statusDisplay");
        this.infoDisplay = document.getElementById("infoDisplay");
        this.downloadLog = document.getElementById("downloadLog");
        this.dnloadButton = document.getElementById("btnDownload");
        this.connectButton = document.getElementById("btnConnect");
    }

    async downloadFirmware() {
        await fetch("../../server/tmp/ProffieOS.ino.dfu")
            .then(res => res.blob())
            .then(async (blob) => {
                this.firmwareFile = await blob.arrayBuffer();
                displayStatus("Firmware downloaded: " + this.firmwareFile.byteLength);
            })
    }

    onDisconnect(reason) {
        displayStatus("Error: " + reason);

        if (reason) {
            this.statusDisplay.textContent = reason;
        }

        this.connectButton.textContent = "Program";
        this.infoDisplay.textContent = "";
        this.dfuDisplay.textContent = "";

    }

    getDFUDescriptorProperties(device) {
        // Attempt to read the DFU functional descriptor
        // TODO: read the selected configuration's descriptor
        return device.readConfigurationDescriptor(0).then(
            data => {
                console.log(data);
                let configDesc = dfu.parseConfigurationDescriptor(data);
                let funcDesc = null;
                let configValue = device.settings.configuration.configurationValue;

                if (configDesc.bConfigurationValue === configValue) {
                    for (let desc of configDesc.descriptors) {
                        if (desc.bDescriptorType === 0x21 && desc.hasOwnProperty("bcdDFUVersion")) {
                            funcDesc = desc;
                            break;
                        }
                    }
                }

                if (funcDesc) {
                    return {
                        WillDetach:            ((funcDesc.bmAttributes & 0x08) !== 0),
                        ManifestationTolerant: ((funcDesc.bmAttributes & 0x04) !== 0),
                        CanUpload:             ((funcDesc.bmAttributes & 0x02) !== 0),
                        CanDnload:             ((funcDesc.bmAttributes & 0x01) !== 0),
                        TransferSize:          funcDesc.wTransferSize,
                        DetachTimeOut:         funcDesc.wDetachTimeOut,
                        DFUVersion:            funcDesc.bcdDFUVersion
                    };
                } else {
                    return {};
                }
            },
            error => {}
        );
    }

    connect(){
        this.bc.postMessage("disconnect_all");

        if(!localStorage.getItem("firmwareFile")){
            displayError("No Firmware found, pls Compile");
            return;
        }

        // Clear logs
        this.clearLog(this.downloadLog);

        if (this.device) {
            this.device.close().then(this.onDisconnect);
            this.device = null;

        } else {
            let filters = [];
            filters.push({ 'vendorId': 0x483, 'productId':0xdf11 });
            filters.push({ 'vendorId': 0x1209, 'productId':0x6668 });

            navigator.usb.requestDevice({ 'filters': filters }).then(
                async selectedDevice => {
                    if (selectedDevice.vendorId === 0x1209) {
                        await selectedDevice.open();

                        console.log("device opened");

                        if (selectedDevice.configuration === null) {
                            selectedDevice.selectConfiguration(1);
                        }

                        console.log("config selected");

                        let interfaceNumber = -1;
                        let endpointOut;
                        let endpointIn;

                        selectedDevice.configuration.interfaces.forEach(element => {
                            element.alternates.forEach(elementalt => {
                                console.log(elementalt);
                                if (elementalt.interfaceClass === 0xff) {
                                    elementalt.endpoints.forEach(elementendpoint => {
                                        interfaceNumber = element.interfaceNumber;
                                        if (elementendpoint.direction === "out") {
                                            endpointOut = elementendpoint.endpointNumber;
                                        }
                                        if (elementendpoint.direction === "in") {
                                            endpointIn = elementendpoint.endpointNumber;
                                        }
                                    })
                                }
                            })
                        })

                        console.log("Endpoints: ", endpointIn, endpointOut);

                        if (interfaceNumber === -1) {
                            this.statusDisplay.textContent = "No WebUSB interface, unable to reset device, please press BOOT+RESET.";

                        } else {
                            console.log("claim");
                            await selectedDevice.claimInterface(interfaceNumber);

                            console.log("select alt");
                            await selectedDevice.selectAlternateInterface(interfaceNumber, 0);

                            console.log("controlTransferOut");
                            await selectedDevice.controlTransferOut({
                                'requestType': 'class',
                                'recipient': 'interface',
                                'request': 0x22,
                                'value': 0x01,
                                'index': interfaceNumber});

                            console.log("transferOut");
                            selectedDevice.transferOut(endpointOut, new TextEncoder('utf-8').encode("\nRebootDFU\n"));

                            this.statusDisplay.textContent = "Proffieboard is rebooting into bootloader mode, please click 'Program' again. (If this doesn't work, please press BOOT+RESET)";
                            this.connectButton.textContent = "Program";

                        }

                    } else {
                        console.log("looking for dfu");
                        console.log(selectedDevice);

                        let interfaces = dfu.findDeviceDfuInterfaces(selectedDevice);

                        if (interfaces.length === 0) {
                            this.statusDisplay.textContent = "The selected device does not have any USB DFU interfaces.";

                        } else {
                            console.log("fix names");

                            // STM32L433 has 4 interfaces, select the first one.
                            await this.fixInterfaceNames(selectedDevice, interfaces);

                            console.log("connect");
                            this.device = await this.write(new dfu.Device(selectedDevice, interfaces[0]));
                        }
                    }
                }
            ).catch(error => {
                this.statusDisplay.textContent = error;
                console.log(error);
            });
        }
    }

    async fixInterfaceNames(device_, interfaces) {
        // Check if any interface names were not read correctly
        if (interfaces.some(intf => (intf.name == null))) {
            // Manually retrieve the interface name string descriptors
            let tempDevice = new dfu.Device(device_, interfaces[0]);
            console.log(tempDevice);

            await tempDevice.device_.open();
            console.log("opened");

            let mapping = await tempDevice.readInterfaceNames();
            console.log("readed");

            await tempDevice.close();
            console.log("closed");

            for (let intf of interfaces) {
                console.log("intf:", intf);

                if (intf.name === null) {
                    let configIndex = intf.configuration.configurationValue;
                    let intfNumber = intf["interface"].interfaceNumber;
                    let alt = intf.alternate.alternateSetting;
                    intf.name = mapping[configIndex][intfNumber][alt];
                }
            }
        }
    }

    async write(device) {
        try {
            await device.open();
            console.log("opened");

        } catch (error) {
            this.onDisconnect(error);
            throw error;
        }

        // Attempt to parse the DFU functional descriptor
        let desc = {};

        try {
            desc = await this.getDFUDescriptorProperties(device);
            console.log(desc);

        } catch (error) {
            this.onDisconnect(error);
            throw error;
        }

        let memorySummary = "";

        console.log("start download");

        if (desc && Object.keys(desc).length > 0) {
            device.properties = desc;

            let info = `WillDetach=${desc.WillDetach}, ManifestationTolerant=${desc.ManifestationTolerant}, CanUpload=${desc.CanUpload}, CanDnload=${desc.CanDnload}, TransferSize=${desc.TransferSize}, DetachTimeOut=${desc.DetachTimeOut}, Version=${this.hex4(desc.DFUVersion)}`;

            this.dfuDisplay.textContent += "\n" + info;
            this.transferSize = desc.TransferSize;

            if (desc.CanDnload) this.manifestationTolerant = desc.ManifestationTolerant;

            if (device.settings.alternate.interfaceProtocol === 0x02) {
                if (!desc.CanDnload) {
                   this.dnloadButton.disabled = true;
                }
            }

            if (desc.DFUVersion === 0x011a && device.settings.alternate.interfaceProtocol === 0x02) {
                device = new dfuse.Device(device.device_, device.settings);

                if (device.memoryInfo) {
                    let totalSize = 0;

                    for (let segment of device.memoryInfo.segments) {
                        totalSize += segment.end - segment.start;
                    }

                    memorySummary = `Selected memory region: ${device.memoryInfo.name} (${niceSize(totalSize)})`;

                    for (let segment of device.memoryInfo.segments) {
                        let properties = [];

                        if (segment.readable) properties.push("readable");
                        if (segment.erasable) properties.push("erasable");
                        if (segment.writable) properties.push("writable");

                        let propertySummary = properties.join(", ");

                        if (!propertySummary) propertySummary = "inaccessible";

                        memorySummary += `\n${this.hexAddr8(segment.start)}-${this.hexAddr8(segment.end-1)} (${propertySummary})`;
                    }
                }
            }
        }

        // Bind logging methods
        device.logDebug = (msg)=>{
            displayStatus(msg);
        };
        device.logInfo = displayStatus;
        device.logWarning = displayError;
        device.logError = displayError;
        device.logProgress = displayStatus;

        // Clear logs
        this.clearLog(this.downloadLog);

        // Display basic USB information
        this.statusDisplay.textContent = '';
        this.connectButton.textContent = 'Disconnect';
        this.infoDisplay.textContent = (
            "Name: " + device.device_.productName + "<br>" +
            "MFG: " + device.device_.manufacturerName + "<br>" +
            "Serial: " + device.device_.serialNumber + "<br>"
        );

        // Display basic dfu-util style info
        this.dfuDisplay.textContent = this.formatDFUSummary(device) + "<br>" + memorySummary;

        if (device.memoryInfo) {
            let segment = device.getFirstWritableSegment();
            if (segment) {
                device.startAddress = segment.start;
                this.maxSize = device.getMaxReadSize(segment.start);
            }
        }


        this.setLogContext(this.downloadLog);
        this.clearLog(this.downloadLog);


        this.firmwareFile = str2ab(localStorage.getItem("firmwareFile"));

        //await this.downloadFirmware();

        if (device && this.firmwareFile != null) {
            this.setLogContext(this.statusDisplay);
            this.clearLog(this.statusDisplay);

            try {
                console.log("getStatus");

                let status = await device.getStatus();
                if (status.state === dfu.dfuERROR) {
                    await device.clearStatus();
                }
            } catch (error) {
                device.logWarning("Failed to clear status");
            }

            console.log("writeFirmware");


            await device.writeFirmware(this.transferSize, this.firmwareFile, this.manifestationTolerant).then(() => {
                    this.logInfo("Done!");
                    this.setLogContext(null);
                    if (!this.manifestationTolerant) {
                        device.waitDisconnected(5000).then(
                            dev => {
                                this.onDisconnect();
                                device = null;
                            },
                            error => {
                                // It didn't reset and disconnect for some reason...
                                console.log("Device unexpectedly tolerated manifestation.");
                            }
                        );
                    }
                },
                error => {
                    displayStatus(error, true);
                    this.setLogContext(null);
                    throw error
                }
            )
        }

        return device;
    }

    hex4(n) {
        let s = n.toString(16)

        while (s.length < 4) {
            s = '0' + s;
        }
        return s;
    }

    hexAddr8(n) {
        let s = n.toString(16)

        while (s.length < 8) {
            s = '0' + s;
        }
        return "0x" + s;
    }



    formatDFUSummary(device) {
        const vid = this.hex4(device.device_.vendorId);
        const pid = this.hex4(device.device_.productId);
        const name = device.device_.productName;

        let mode = "Unknown"

        if (device.settings.alternate.interfaceProtocol === 0x01) {
            mode = "Runtime";
        } else if (device.settings.alternate.interfaceProtocol === 0x02) {
            mode = "DFU";
        }

        const cfg = device.settings.configuration.configurationValue;
        const intf = device.settings["interface"].interfaceNumber;
        const alt = device.settings.alternate.alternateSetting;
        const serial = device.device_.serialNumber;

        return `${mode}: [${vid}:${pid}] cfg=${cfg}, intf=${intf}, alt=${alt}, name="${name}" serial="${serial}"`;
    }

    setLogContext(div) {
        this.logContext = div;
    }

    clearLog(context) {
        if (typeof context === 'undefined') {
            context = this.logContext;
        }
        if (context) {
            context.innerHTML = "";
        }
    }
}
