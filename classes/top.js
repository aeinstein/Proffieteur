
export const top_structure = {
    "ENABLE_SERIAL": {
        type: "boolean",
        default: false,
        desc: "Enable Bluetooth",
        group: "Extras"
    },

    "ENABLE_I2C": {
        type: "boolean",
        default: false,
        desc: "Enable I2C",
        group: "Extras"
    },

    "ENABLE_SSD1306": {
        type: "boolean",
        default: false,
        desc: "Enable OLED",
        group: "Extras"
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

export class TopConfig {
    constructor() {
        this.top_config = JSON.parse(localStorage.getItem('TOP')) || {};

        for(const item in top_structure){
            this.top_config[item] = this.top_config[item] || top_structure[item].default;
        }
    }

    generateTopConfig(){
        if(!localStorage.getItem("NUM_BLADES")) return "You have to create Blades first";

        let ret = "#define NUM_BLADES " + localStorage.getItem("NUM_BLADES") + "\n";

        ret += "const unsigned int maxLedsPerStrip = 500;\n";
        ret += "#define ENABLE_WS2811\n";
        ret += "#define NUM_BUTTONS " + this.top_config["NUM_BUTTONS"] + "\n";

        for(const item in this.top_config){
            if(item === "NUM_BUTTONS") continue;

            console.log(item, top_structure[item]);

            switch(top_structure[item].type){
                case "integer":
                case "float":
                    ret += "#define " + item + " " + this.top_config[item] + "\n";
                    break;

                case "boolean":
                    if(this.top_config[item]) ret += "#define " + item + "\n";
                    break;

                case "powerpins":
                    let content = this.top_config[item];
                    //content = content.replace("<", "&lt;");
                    //content = content.replace(">", "&gt;");
                    console.log(content);
                    ret += "#define " + item + " " + content + "\n";
                    break;
            }
        }

        this.save();

        return ret;
    }

    setItem(item, value){
        this.top_config[item] = value;
        this.generateTopConfig();
    }

    getItem(item){
        return this.top_config[item];
    }

    save(){
        localStorage.setItem("TOP", JSON.stringify(this.top_config));
    }
}
