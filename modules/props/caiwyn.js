export const caiwyn_settings = {
    "CAIWYN_BUTTON_CLASH":{
        type: "boolean",
        default: false,
        desc: "Enables a clash to be triggered without impact to the blade by pressing the power button",
        group: "Options"
    },

    "CAIWYN_BUTTON_LOCKUP":{
        type: "boolean",
        default: false,
        desc: "Enables a lockup to be triggered without impact to the blade by pressing and holding the power button",
        group: "Options"
    },

    "CAIWYN_SAVE_TRACKS":{
        type: "boolean",
        default: false,
        desc: "Automatically saves the selected track for each preset",
        group: "Options"
    },

    "CAIWYN_SAVE_TRACK_MODE":{
        type: "boolean",
        default: false,
        desc: "Saves the selected track mode to a config file so that the setting is restored when Proffieboard boots up after the battery is recharged or replaced",
        group: "Options"
    },

    "DISABLE_COLOR_CHANGE":{
        type: "boolean",
        default: false,
        desc: "Disables the color change menu",
        group: "Options"
    },
}