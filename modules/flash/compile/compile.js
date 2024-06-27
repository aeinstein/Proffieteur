import {TopConfig} from "../../../classes/top.js";

let currentDevice = JSON.parse(localStorage.getItem("CURRENT_DEVICE"));
let top_config = new TopConfig();

export async function uploadConfigFiles() {
    let formData = new FormData();

    formData.append("top.h", new File([getTopConfig()], "top.h", {type: "text/plain"}));
    formData.append("config.h", new File([getMainConfig()], "config.h", {type: "text/plain"}));

    await fetch('https://vdev.cust.itnox.de/testarea/proffieteur/server/endpoint.php?cmd=upload&serial=' + currentDevice.serialNumber, {
        method: "POST",
        body: formData
    });
}

function getMainConfig(){
    return "#ifdef CONFIG_TOP\n" +
        "#include \"../proffieboard_v3_config.h\"\n" +
        "#include \"top.h\"\n" +
        "#endif\n" +
        "\n" +
        "\n" +
        "#ifdef CONFIG_PROP\n" +
        "#include \"../../props/saber_fett263_buttons.h\"\n" +
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

window.uploadConfigFiles = uploadConfigFiles;
