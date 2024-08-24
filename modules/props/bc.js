export const bc_settings = {
    "BC_SWING_ON":{
        type: "boolean",
        default: false,
        desc: "Swing On",
        group: "Gesture"
    },

    "BC_STAB_ON":{
        type: "boolean",
        default: false,
        desc: "Stab On",
        group: "Gesture"
    },

    "BC_THRUST_ON":{
        type: "boolean",
        default: false,
        desc: "Thrust On",
        group: "Gesture"
    },

    "BC_TWIST_ON":{
        type: "boolean",
        default: true,
        desc: "Twist On",
        group: "Gesture"
    },

    "BC_TWIST_OFF":{
        type: "boolean",
        default: true,
        desc: "Twist Off",
        group: "Gesture"
    },

    "NO_BLADE_NO_GEST_ONOFF":{
        type: "boolean",
        default: true,
        desc: "Swing On",
        group: "Gesture"
    },

    "BC_FORCE_PUSH":{
        type: "boolean",
        default: true,
        desc: "This mode plays a force sound (or force push sound if the font contains it) with\n" +
            "  a controlled pushing gesture, and is always available, not just in Battle Mode",
        group: "Sound"
    },

    "BC_NO_BM":{
        type: "boolean",
        default: false,
        desc: "Disable battle mode features",
        group: "Battle Mode"
    },

    "BC_LOCKUP_DELAY":{
        type: "int",
        default: 200,
        desc: "Lockup delay",
        group: "Gesture"
    }
}