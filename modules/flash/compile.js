import {TopConfig} from "../../classes/top.js";
import {Presets} from "../../classes/presets.js";
import {BladeConfig} from "../../classes/blades.js";
import {Buttons} from "../../classes/buttons.js";
import {Styles} from "../../classes/styles.js";
import {Flasher} from "../../classes/flasher.js";

const COMPILE_SERVER = "https://vdev.cust.itnox.de/proffieteur/server/";

let currentDevice = JSON.parse(localStorage.getItem("CURRENT_DEVICE"));
let top_config = new TopConfig();
let presetConfig = new Presets();
let bladeConfig = new BladeConfig();
let buttons = new Buttons();
let styles = new Styles();

export async function uploadConfigFiles() {
    let formData = new FormData();

    formData.append("top.h", new File([getTopConfig()], "top.h", {type: "text/plain"}));
    formData.append("config.h", new File([getMainConfig()], "config.h", {type: "text/plain"}));
    formData.append("presets.h", new File([getPresets()], "presets.h", {type: "text/plain"}));
    formData.append("blades.h", new File([getBladeConfig()], "blades.h", {type: "text/plain"}));
    formData.append("buttons.h", new File([getButtonConfig()], "buttons.h", {type: "text/plain"}));
    formData.append("styles.h", new File([getStyleConfig()], "styles.h", {type: "text/plain"}));

    await fetch(COMPILE_SERVER + 'endpoint.php?cmd=upload&serial=' + currentDevice.serialNumber, {
        method: "POST",
        body: formData
    })
        .then(res => res.text())
        .then((res)=>{
            let l = res.split("\n");
            const tab = document.getElementById("uploads");

            for(let i = 0; i < l.length; i++){
                let line = l[i];
                if(line === "") continue;

                let p = line.split(" ");

                let newRow = tab.insertRow();
                let filename = newRow.insertCell();
                let status = newRow.insertCell();

                filename.innerHTML = p[0];
                status.innerHTML = p[1];
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    ;
}

export async function compile() {
    const output = document.getElementById("compileOutput");
    output.innerHTML = "starting compile";

    await fetch(COMPILE_SERVER + 'endpoint.php?cmd=compile&serial=' + currentDevice.serialNumber)
        .then(res => res.text())
        .then(async (res) => {
            console.log(res);

            let ret = "";

            let lines = res.split("\n");

            for (let i = 0; i < lines.length; i++) {
                ret += colorize(lines[i]) + "<br>";
            }

            output.innerHTML = ret;

            await download();
        })
    ;
}

async function download() {
    await fetch("../../server/tmp/ProffieOS.ino.dfu")
        .then(res => res.blob())
        .then(async (blob) => {
            const firmwareFile = await blob.arrayBuffer();
            displayStatus("Firmware downloaded: " + firmwareFile.byteLength);
            localStorage.setItem("firmwareFile", ab2str(firmwareFile));
            init();
        })
}

function deleteStoredFirmware(){
    localStorage.removeItem("firmwareFile");
    init();
}

function getMainConfig(){
    const propFile = localStorage.getItem("PROPS");
    return "#ifdef CONFIG_TOP\n" +
        "#include \"../../proffieboard_v3_config.h\"\n" +
        "#include \"top.h\"\n" +
        "#endif\n" +
        "\n" +
        "\n" +
        "#ifdef CONFIG_PROP\n" +
        "#include \"../../../props/saber_" + propFile + "_buttons.h\"\n" +
        "#endif\n" +
        "\n" +
        "#ifdef CONFIG_PRESETS\n" +
        "#include \"presets.h\"\n" +
        "#include \"blades.h\"\n" +
        "#endif\n" +
        "\n" +
        "#ifdef CONFIG_BUTTONS\n" +
        "#include \"buttons.h\"\n" +
        "#endif\n" +
        "\n" +
        "#ifdef CONFIG_STYLES\n" +
        "#include \"styles.h\"\n" +
        "#endif"
}

function getTopConfig(){
    return top_config.generateTopConfig()
}

function getPresets(){
    return presetConfig.getConfig();
}

function getBladeConfig(){
    return bladeConfig.getConfig();
}

function getButtonConfig(){
    return buttons.getConfg();
}

function getStyleConfig(){
    return styles.getConfig();
}

function init(){
    if(localStorage.getItem("firmwareFile")){
        let firmware = str2ab(localStorage.getItem("firmwareFile"));
        console.log("firmwareFile Size:" + firmware.byteLength);

        let t = "Stored Firmware:<br>" + niceSize(firmware.byteLength) + "<br>";
        t += "<button onclick='deleteStoredFirmware()'>Delete</button><br>";
        t += "<button onclick='downloadStoredFirmware()'>Download</button>";

        document.getElementById("txtCompiler").innerHTML = t;
    } else {
        document.getElementById("txtCompiler").innerHTML = "No cached firmware";
    }
}

function downloadStoredFirmware(){
    window.open("../../server/tmp/ProffieOS.ino.dfu", "_blank");
}

window.flasher = new Flasher();
window.compile = compile;
window.uploadConfigFiles = uploadConfigFiles;
window.deleteStoredFirmware = deleteStoredFirmware;
window.downloadStoredFirmware = downloadStoredFirmware;

window.addEventListener("load", init);
