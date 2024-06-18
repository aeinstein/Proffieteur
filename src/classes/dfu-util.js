let device = null;

(function() {
    'use strict';

    function hex4(n) {
        let s = n.toString(16)

        while (s.length < 4) {
            s = '0' + s;
        }
        return s;
    }

    function hexAddr8(n) {
        let s = n.toString(16)

        while (s.length < 8) {
            s = '0' + s;
        }
        return "0x" + s;
    }

    function niceSize(n) {
        const gigabyte = 1024 * 1024 * 1024;
        const megabyte = 1024 * 1024;
        const kilobyte = 1024;

        if (n >= gigabyte) {
            return n / gigabyte + "GiB";
        } else if (n >= megabyte) {
            return n / megabyte + "MiB";
        } else if (n >= kilobyte) {
            return n / kilobyte + "KiB";
        } else {
            return n + "B";
        }
    }

    function formatDFUSummary(device) {
        const vid = hex4(device.device_.vendorId);
        const pid = hex4(device.device_.productId);
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

        let info = `${mode}: [${vid}:${pid}] cfg=${cfg}, intf=${intf}, alt=${alt}, name="${name}" serial="${serial}"`;

        return info;
    }

    function formatDFUInterfaceAlternate(settings) {
        let mode = "Unknown"
        if (settings.alternate.interfaceProtocol === 0x01) {
            mode = "Runtime";
        } else if (settings.alternate.interfaceProtocol === 0x02) {
            mode = "DFU";
        }

        const cfg = settings.configuration.configurationValue;
        const intf = settings["interface"].interfaceNumber;
        const alt = settings.alternate.alternateSetting;
        const name = (settings.name) ? settings.name : "UNKNOWN";

        return `${mode}: cfg=${cfg}, intf=${intf}, alt=${alt}, name="${name}"`;
    }

    async function fixInterfaceNames(device_, interfaces) {
        // Check if any interface names were not read correctly
        if (interfaces.some(intf => (intf.name == null))) {
            // Manually retrieve the interface name string descriptors
            let tempDevice = new dfu.Device(device_, interfaces[0]);
            await tempDevice.device_.open();
            let mapping = await tempDevice.readInterfaceNames();
            await tempDevice.close();

            for (let intf of interfaces) {
                if (intf.name === null) {
                    let configIndex = intf.configuration.configurationValue;
                    let intfNumber = intf["interface"].interfaceNumber;
                    let alt = intf.alternate.alternateSetting;
                    intf.name = mapping[configIndex][intfNumber][alt];
                }
            }
        }
    }

    function getDFUDescriptorProperties(device) {
        // Attempt to read the DFU functional descriptor
        // TODO: read the selected configuration's descriptor
        return device.readConfigurationDescriptor(0).then(
            data => {
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

    // Current log div element to append to
    let logContext = null;

    function setLogContext(div) {
        logContext = div;
    }

    function clearLog(context) {
        if (typeof context === 'undefined') {
            context = logContext;
        }
        if (context) {
            context.innerHTML = "";
        }
    }

    function logDebug(msg) {
        console.log(msg);
    }

    function logInfo(msg) {
        console.log(msg);
        if (logContext) {
            let info = document.createElement("p");
            info.className = "info";
            info.textContent = msg;
            logContext.appendChild(info);
        }
    }

    function logWarning(msg) {
        console.log(msg);
        if (logContext) {
            let warning = document.createElement("p");
            warning.className = "warning";
            warning.textContent = msg;
            logContext.appendChild(warning);
        }
    }

    function logError(msg) {
        console.log(msg);
        if (logContext) {
            let error = document.createElement("p");
            error.className = "error";
            error.textContent = msg;
            logContext.appendChild(error);
        }
    }

    function logProgress(done, total) {
        if (logContext) {
            let progressBar;

            if (logContext.lastChild.tagName.toLowerCase() === "progress") {
                progressBar = logContext.lastChild;
            }

            if (!progressBar) {
                progressBar = document.createElement("progress");
                logContext.appendChild(progressBar);
            }

            progressBar.value = done;
            if (typeof total !== 'undefined') {
                progressBar.max = total;
            }
        }
    }

    document.addEventListener('DOMContentLoaded', event => {
        let connectButton = document.querySelector("#connect");
        let statusDisplay = document.querySelector("#status");
        let infoDisplay = document.querySelector("#usbInfo");
        let dfuDisplay = document.querySelector("#dfuInfo");
        let vidField = document.querySelector("#vid");
        let interfaceDialog = document.querySelector("#interfaceDialog");
        let interfaceForm = document.querySelector("#interfaceForm");
        let interfaceSelectButton = document.querySelector("#selectInterface");

        let searchParams = new URLSearchParams(window.location.search);
        let fromLandingPage = false;
        let vid = 0;

        // Grab the serial number from the landing page
        let serial = "";

        if (searchParams.has("serial")) {
            serial = searchParams.get("serial");
            // Workaround for Chromium issue 339054
            if (window.location.search.endsWith("/") && serial.endsWith("/")) {
                serial = serial.substring(0, serial.length-1);
            }
            fromLandingPage = true;
        }

        let configForm = document.querySelector("#configForm");

        let transferSize = 1024;
        let maxSize = -1;

        let firmwareFile = null;

        let downloadLog = document.querySelector("#downloadLog");

        let manifestationTolerant = true;

        //let device;

        function onDisconnect(reason) {
            if (reason) {
                statusDisplay.textContent = reason;
            }

            connectButton.textContent = "Program";
            infoDisplay.textContent = "";
            dfuDisplay.textContent = "";
        }

        function onUnexpectedDisconnect(event) {
            if (device !== null && device.device_ !== null) {
                if (device.device_ === event.device) {
                    device.disconnected = true;
                    onDisconnect("Device disconnected");
                    device = null;
                }
            }
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function sendCompileRequest() {
            return new Promise(function(resolve, reject) {
                const conf = document.getElementById("configuration");
                const request = new XMLHttpRequest();

                request.onloadend = function(event) {
                    console.log(request.status);

                    if (request.status === 202) {
                        resolve(202);
                    }
                    if (request.status === 406) {
                        resolve(406);
                    }
                    if (request.status === 200) {
                        console.log(request.getResponseHeader("Content-Type"));
                        console.log(request.response);

                        if (request.getResponseHeader("Content-Type") === "binary/unknown") {
                            resolve(request.response);
                        } else {
                            resolve(406);
                        }
                    }
                    reject(request.status);
                }
                request.open("POST", "https://vdev.cust.itnox.de/proffie/compile");
                request.responseType = "arraybuffer";
                request.send("config="+escape(document.querySelector("#configuration").value));
            });
        }

        async function compile() {
            while (true) {
                const answer = await sendCompileRequest();

                if (answer === 202) {
                    await sleep(5000);
                    logInfo("Please wait, compiling.... (this may take a couple of minutes)");
                    continue;
                }
                if (answer === 406) {
                    logError("Compilation failed, please provide a valid configuration file.");
                    throw "Compilation failed"
                }
                console.log(typeof(answer));
                return answer;
            }
        }

        async function connect(device) {
            try {
                await device.open();
            } catch (error) {
                onDisconnect(error);
                throw error;
            }

            // Attempt to parse the DFU functional descriptor
            let desc = {};

            try {
                desc = await getDFUDescriptorProperties(device);
            } catch (error) {
                onDisconnect(error);
                throw error;
            }

            let memorySummary = "";

            if (desc && Object.keys(desc).length > 0) {
                device.properties = desc;

                let info = `WillDetach=${desc.WillDetach}, ManifestationTolerant=${desc.ManifestationTolerant}, CanUpload=${desc.CanUpload}, CanDnload=${desc.CanDnload}, TransferSize=${desc.TransferSize}, DetachTimeOut=${desc.DetachTimeOut}, Version=${hex4(desc.DFUVersion)}`;

                dfuDisplay.textContent += "\n" + info;
                transferSize = desc.TransferSize;

                if (desc.CanDnload) manifestationTolerant = desc.ManifestationTolerant;

                if (device.settings.alternate.interfaceProtocol === 0x02) {
                    if (!desc.CanDnload) {
                        dnloadButton.disabled = true;
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

                            memorySummary += `\n${hexAddr8(segment.start)}-${hexAddr8(segment.end-1)} (${propertySummary})`;
                        }
                    }
                }
            }

            // Bind logging methods
            device.logDebug = logDebug;
            device.logInfo = logInfo;
            device.logWarning = logWarning;
            device.logError = logError;
            device.logProgress = logProgress;

            // Clear logs
            clearLog(downloadLog);

            // Display basic USB information
            statusDisplay.textContent = '';
            connectButton.textContent = 'Disconnect';
            infoDisplay.textContent = (
                "Name: " + device.device_.productName + "\n" +
                "MFG: " + device.device_.manufacturerName + "\n" +
                "Serial: " + device.device_.serialNumber + "\n"
            );

            // Display basic dfu-util style info
            dfuDisplay.textContent = formatDFUSummary(device) + "\n" + memorySummary;

            if (device.memoryInfo) {
                let segment = device.getFirstWritableSegment();
                if (segment) {
                    device.startAddress = segment.start;
                    maxSize = device.getMaxReadSize(segment.start);
                }
            }


            setLogContext(downloadLog);
            clearLog(downloadLog);

            firmwareFile = await compile();

            if (device && firmwareFile != null) {
                try {
                    let status = await device.getStatus();
                    if (status.state === dfu.dfuERROR) {
                        await device.clearStatus();
                    }
                } catch (error) {
                    device.logWarning("Failed to clear status");
                }

                await device.do_download(transferSize, firmwareFile, manifestationTolerant).then(
                    () => {
                        logInfo("Done!");
                        setLogContext(null);
                        if (!manifestationTolerant) {
                            device.waitDisconnected(5000).then(
                                dev => {
                                    onDisconnect();
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
                        logError(error);
                        setLogContext(null);
                        throw error
                    }
                )
            }

            return device;
        }

        connectButton.addEventListener('click', function() {
            // Clear logs
            clearLog(downloadLog);

            if (device) {
                device.close().then(onDisconnect);
                device = null;

            } else {
                let filters = [];
                filters.push({ 'vendorId': 0x483, 'productId':0xdf11 });
                filters.push({ 'vendorId': 0x1209, 'productId':0x6668 });

                navigator.usb.requestDevice({ 'filters': filters }).then(
                    async selectedDevice => {
                        if (selectedDevice.vendorId === 0x1209) {

                            await selectedDevice.open();

                            if (selectedDevice.configuration === null) {
                                selectedDevice.selectConfiguration(1);
                            }

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

                            if (interfaceNumber === -1) {
                                statusDisplay.textContent = "No WebUSB interface, unable to reset device, please press BOOT+RESET.";

                            } else {
                                await selectedDevice.claimInterface(interfaceNumber);
                                await selectedDevice.selectAlternateInterface(interfaceNumber, 0);
                                await selectedDevice.controlTransferOut({
                                    'requestType': 'class',
                                    'recipient': 'interface',
                                    'request': 0x22,
                                    'value': 0x01,
                                    'index': interfaceNumber});
                                selectedDevice.transferOut(endpointOut,
                                    new TextEncoder('utf-8').encode("\nRebootDFU\n"));

                                statusDisplay.textContent = "Proffieboard is rebooting into bootloader mode, please click 'Program' again. (If this doesn't work, please press BOOT+RESET)";

                            }

                        } else {
                            let interfaces = dfu.findDeviceDfuInterfaces(selectedDevice);
                            if (interfaces.length === 0) {
                                console.log(selectedDevice);
                                statusDisplay.textContent = "The selected device does not have any USB DFU interfaces.";

                            } else {
                                // STM32L433 has 4 interfaces, select the first one.
                                await fixInterfaceNames(selectedDevice, interfaces);
                                device = await connect(new dfu.Device(selectedDevice, interfaces[0]));
                            }
                        }
                    }
                ).catch(error => {
                    statusDisplay.textContent = error;
                    console.log(error);
                });
            }
        });


        if(0) downloadButton.addEventListener('click', async function(event) {
            event.preventDefault();
            event.stopPropagation();

            if (!configForm.checkValidity()) {
                configForm.reportValidity();
                return false;
            }

            if (device && firmwareFile != null) {
                setLogContext(downloadLog);
                clearLog(downloadLog);

                try {
                    let status = await device.getStatus();
                    if (status.state === dfu.dfuERROR) {
                        await device.clearStatus();
                    }
                } catch (error) {
                    device.logWarning("Failed to clear status");
                }

                await device.do_download(transferSize, firmwareFile, manifestationTolerant).then(
                    () => {
                        logInfo("Done!");
                        setLogContext(null);
                        if (!manifestationTolerant) {
                            device.waitDisconnected(5000).then(
                                dev => {
                                    onDisconnect();
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
                        logError(error);
                        setLogContext(null);
                    }
                )
            }

            //return false;
        });

        // Check if WebUSB is available
        if (typeof navigator.usb !== 'undefined') {
            navigator.usb.addEventListener("disconnect", onUnexpectedDisconnect);

        } else {
            statusDisplay.textContent = 'WebUSB not available.'
            connectButton.disabled = true;
        }
    });
})();
