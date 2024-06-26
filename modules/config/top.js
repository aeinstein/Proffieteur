let top_structure = {
    "NUM_BUTTONS": {
        type: "integer",
        default: 1,
        desc: "How many buttons",
        group: "Buttons"
    },

    "VOLUME": {
        type: "integer",
        default: 1000,
        desc: "Max. volume",
        group: "Audio"
    },

    "BOOT_VOLUME": {
        type: "integer",
        default: 450,
        desc: "Boot volume",
        group: "Audio"
    },

    "ENABLE_AUDIO": {
        type: "boolean",
        default: true,
        desc: "Enable Audio",
        group: "Audio"
    },

    "KILL_OLD_PLAYERS": {
        type: "boolean",
        default: true,
        desc: "Kill old audio players",
        group: "Audio"
    },

    "FILTER_CUTOFF_FREQUENCY": {
        type: "integer",
        default: 100,
        desc: "Filter cutoff freq. in Hz",
        group: "Audio"
    },

    "FILTER_ORDER":{
        type: "integer",
        default: 8,
        desc: "Filter order",
        group: "Audio"
    },

    "NO_REPEAT_RANDOM": {
        type: "boolean",
        default: true,
        desc: "No repeat random",
        group: "Audio"
    },

    "MOTION_TIMEOUT": {
        type: "integer",
        default: 120000,
        desc: "Motion timeout",
        group: "Standby"
    },

    "IDLE_OFF_TIME": {
        type: "integer",
        default: 60000,
        desc: "Idle timeout",
        group: "Standby"
    },

    "SHARED_POWER_PINS" :{
        type: "boolean",
        default: true,
        desc: "Shared power pins",
        group: "Standby"
    },

    "BLADE_ID_SCAN_MILLIS": {
        type: "integer",
        default: 2000,
        desc: "BladeID Scan every",
        group: "BladeID"
    },

    "BLADE_ID_TIMES": {
        type: "integer",
        default: 5,
        desc: "How often scan for value",
        group: "BladeID"
    },

    "ENABLE_POWER_FOR_ID":{
        type: "powerpins",
        default: "bladePowerPin2",
        desc: "What pins needed for BladeID",
        group: "BladeID"
    },

    "ENABLE_ALL_EDIT_OPTIONS":{
        type: "boolean",
        default: true,
        desc: "Enable all edit options",
        group: "General"
    },

    "SAVE_PRESET": {
        type: "boolean",
        default: true,
        desc: "Save Preset",
        group: "General"
    },

    "DISABLE_BASIC_PARSER_STYLES": {
        type: "boolean",
        default: true,
        desc: "Disable old parser styles",
        group: "General"
    },

    "ENABLE_DEVELOPER_COMMANDS": {
        type: "boolean",
        default: true,
        desc: "Enable developer commands",
        group: "General"
    },

    "COLOR_CHANGE_DIRECT": {
        type: "boolean",
        default: false,
        desc: "Direct color change",
        group: "General"
    },

    "CLASH_THRESHOLD_G":{
        type: "float",
        default: 3.0,
        desc: "Clash threshhold",
        group: "General"
    }
}


let top_config = {};


function buildGUI(){
    for(const item in top_structure){
        const group = top_structure[item].group;

        if(!group) continue;

        const fs = getOrAddFieldset(group);
        const content = fs.getElementsByTagName('table')[0];

        const newRow = content.insertRow();
        const newlabel = newRow.insertCell();
        const newinput = newRow.insertCell();

        newlabel.innerHTML = "<label for=\"" + item + "\">" + top_structure[item].desc + "</label>";

        let txt;

        switch(top_structure[item].type){
            case "integer":
            case "float":
                top_config[item] = top_config[item] || top_structure[item].default;
                newinput.innerHTML = "<input id='" + item  + "' type='number' value='" + top_config[item] + "'>";
                break;

            case "boolean":
                txt = "<input id='" + item  + "' type='checkbox'";
                top_config[item] = top_config[item] || top_structure[item].default;
                if(top_config[item]) txt += " checked";
                txt += ">";
                newinput.innerHTML = txt;
                break;

            case "powerpins":
                top_config[item] = top_config[item] || top_structure[item].default;
                txt = "<select style='height: fit-content' id='" + item  + "' multiple>";
                for(let i = 1; i<=6; i++){
                    txt += "<option value='bladePowerPin" + i + "'";
                    if(top_config[item].indexOf("bladePowerPin" + i) >= 0) txt += " selected";
                    txt += ">bladePowerPin" + i + "</option>";
                }
                txt += "</select>";

                newinput.innerHTML = txt;
                break;

            default:
                console.error(top_structure[item].type + " not implemented");
                break;
        }

        content.appendChild(newRow);
    }

    document.getElementById("topConfig").innerHTML= generateTopConfig();
}

function getOrAddFieldset(group){
    if(!group) return;

    let fs = document.getElementById("fld" + group.toLowerCase()) || false;

    if(!fs) {
        fs = document.createElement("FIELDSET");
        fs.id = "fld" + group.toLowerCase();
        fs.innerHTML = "<legend>" + group + "</legend><table></table>";
        document.getElementById("container").appendChild(fs);
    }

    return fs;
}

function init() {
    // load config from localStorage
    top_config = JSON.parse(localStorage.getItem('top')) || {};

    // Build GUI from template
    buildGUI();

    // Register changed listenr
    document.getElementById("container").addEventListener("change", changedValue);
}

function generateTopConfig(){
    if(!localStorage.getItem("NUM_BLADES")) return "You have to create Blades first";

    let ret = "#define NUM_BLADES " + localStorage.getItem("NUM_BLADES") + "\n";

    for(const item in top_config){
        switch(top_structure[item].type){
            case "integer":
            case "float":
                ret += "#define " + item + " " + top_config[item] + "\n";
                break;

            case "boolean":
                if(top_config[item]) ret += "#define " + item + "\n";
                break;
        }
    }

    return ret;
}

function save(){
    document.getElementById("topConfig").innerHTML= generateTopConfig();
    localStorage.setItem("top", JSON.stringify(top_config));
}

function changedValue(evt){
    const item = evt.target.id;

    switch(top_structure[item].type){
        case "boolean":
            top_config[item] = !!evt.target.checked;
            break;

        case "powerpins":
            top_config[item] = "PowerPins<" + getSelectValues(evt.target).join(",") + ">";
            break;

        case "float":
        case "integer":
            top_config[item] = evt.target.value * 1;
            break;

        default:
            top_config[item] = evt.target.value;
            break;
    }

    save();
}

function getSelectValues(select) {
    const result = [];
    const options = select && select.options;
    let opt;

    for (let i=0, iLen=options.length; i<iLen; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
}

window.addEventListener("load", init);


