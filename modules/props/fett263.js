
export const fett263_settings = {
    "FETT263_EDIT_MODE_MENU": {
        type: "boolean",
        default: true,
        desc: "Enable on-board menu system for Edit Mode, requires \"Enable All Edit Options\"",
        group: "Features"
    },

    "FETT263_EDIT_SETTINGS_MENU": {
        type: "boolean",
        default: false,
        desc: "Enable Edit Settings Menu (Volume, Clash Threshold, Blade Length, Gestures/Controls, Brightness). I recommend setting USB Type = \"Serial + WebUSB\" under Arduino > Tools to allow for style, font, track, color editing via ProffieOS Workbench. Cannot be combined with FETT263_EDIT_MODE_MENU\n" +
            "  Requires ENABLE_ALL_EDIT_OPTIONS",
        group: "Features"
    },

    "FETT263_SPECIAL_ABILITIES": {
        type: "boolean",
        default: true,
        desc: "This enables 8 \"Special Ability\" controls (style controlled), 4 while ON, 4 while OFF. Special Abilities are controlled by the style and can vary in every preset, they are \"user\" defined effects/capabilities.\n" +
            "Allows \"Multi-Phase\" to be style based. Cannot be used with Multi-Phase or Choreography",
        group: "Features"
    },


    /* BattleMode Options */
    "FETT263_SPIN_MODE": {
        type: "boolean",
        default: false,
        desc: "Enables toggle for \"Spin\" Mode* which disables all clash/stab/lockup effects to allow for spinning and flourishes. Cannot be used with FETT263_SAVE_CHOREOGRAPHY or FETT263_HOLD_BUTTON_LOCKUP\n" +
            "  *Not the same as ENABLE_SPINS",
        group: "BattleMode"
    },

    "FETT263_MOTION_WAKE_POWER_BUTTON": {
        type: "boolean",
        default: true,
        desc: "Enables a click on POWER Button to Wake Up Gestures after MOTION_TIMEOUT without igniting blade. Saber will play boot sound and gestures will be active.",
        group: "BattleMode"
    },

    "FETT263_QUOTE_PLAYER_START_ON": {
        type: "boolean",
        default: false,
        desc: "This will set Force / Quote Player to play Quote by default (if in font)",
        group: "BattleMode"
    },

    "FETT263_MULTI_PHASE": {
        type: "boolean",
        default: false,
        desc: "This will enable a preset change while ON to create a \"Multi-Phase\" saber effect",
        group: "BattleMode"
    },

    "FETT263_BATTLE_MODE": {
        type: "enum",
        enums: {
            "": "Toggle On",
            "FETT263_BATTLE_MODE_START_ON": "Start On",
            "FETT263_BATTLE_MODE_ALWAYS_ON": "Always On"
        },
        default: true,
        desc: "Battle Mode is active with each ignition by default but can be toggled using control ON/OFF",
        group: "BattleMode"
    },

    "FETT263_LOCKUP_DELAY": {
        type: "int",
        default: 200,
        desc: "This is the \"delay\" in millis to determine Clash vs Lockup, longer delay provides a longer time to \"pull away\".",
        group: "BattleMode"
    },

    "FETT263_BM_CLASH_DETECT": {
        type: "int",
        default: 6,
        desc: "The max value to use clashes in Battle Mode 2.0, clashes used on clash strength below this value\n" +
            "This allows light clashes to produce clash effects instead of using Begin/End Lockup\n" +
            "(above this value Clash is performed by quick pull away using Begin/End Lockup sounds and effect)\n" +
            "Recommended Range 0 ~ 8 (note 0 will use Battle Mode 1.0 with all clashes being Begin/End Lockup, above 8 will make Battle Mode lockup very difficult)",
        group: "BattleMode"
    },

    "FETT263_BM_DISABLE_OFF_BUTTON": {
        type: "boolean",
        default: false,
        desc: "During Battle Mode Power Button Retraction is disabled to prevent accidental retraction, use gesture or exit Battle Mode to retract blade.",
        group: "BattleMode"
    },



    /* Gesture Options */
    "FETT263_TWIST_OFF": {
        type: "boolean",
        default: true,
        desc: "To enable Twist Off Ignition control",
        group: "Gesture"
    },

    "FETT263_TWIST_ON": {
        type: "boolean",
        default: false,
        desc: "To enable Twist On Ignition control (automatically enters Battle Mode, uses Fast On)",
        group: "Gesture"
    },

    "FETT263_TWIST_ON_NO_BM": {
        type: "boolean",
        default: false,
        desc: "To enable Twist On Ignition control but not activate Battle Mode. (Combine with FETT263_TWIST_ON or FETT263_TWIST_ON_PREON,\n" +
            "      cannot be used with FETT263_BATTLE_MODE_ALWAYS_ON or FETT263_BATTLE_MODE_START_ON)",
        group: "Gesture"
    },

    "FETT263_STAB_ON": {
        type: "boolean",
        default: false,
        desc: "To enable Stab On Ignition control (automatically enters Battle Mode, uses Fast On)",
        group: "Gesture"
    },

    "FETT263_THRUST_ON": {
        type: "boolean",
        default: false,
        desc: "To enable Thrust On Ignition control (automatically enters Battle Mode, uses Fast On)",
        group: "Gesture"
    },

    "FETT263_FORCE_PUSH": {
        type: "boolean",
        default: false,
        desc: "To enable gesture controlled Force Push during Battle Mode (will use push.wav or force.wav if not present)",
        group: "Gesture"
    },

    "FETT263_FORCE_PUSH_LENGTH": {
        type: "int",
        default: 5,
        desc: "Allows for adjustment to Push gesture length in millis needed to trigger Force Push. Recommended range 1 ~ 10, 1 = shortest, easiest to trigger, 10 = longest",
        group: "Gesture"
    },

    "FETT263_SAVE_GESTURE_OFF": {
        type: "boolean",
        default: false,
        desc: "Save \"Gesture Sleep\" setting to turn gesture ignitions and retractions off on boot",
        group: "Gesture"
    },




    /* Disable Options */
    "FETT263_DISABLE_CHANGE_FONT": {
        type: "boolean",
        default: false,
        desc: "Disables the \"on-the-fly\" Change Font feature",
        group: "Disable"
    },

    "FETT263_DISABLE_CHANGE_STYLE": {
        type: "boolean",
        default: false,
        desc: "Disables the \"on-the-fly\" Change Style feature",
        group: "Disable"
    },
    "FETT263_DISABLE_COPY_PRESET": {
        type: "boolean",
        default: false,
        desc: "Disables the \"on-the-fly\" Copy Preset feature",
        group: "Disable"
    },
    "FETT263_DISABLE_BM_TOGGLE": {
        type: "boolean",
        default: false,
        desc: "Disable button control for Battle Mode, use gesture ignition or Special Abilities and/or style to toggle",
        group: "Disable"
    },

    "FETT263_DISABLE_MULTI_BLAST_TOGGLE": {
        type: "boolean",
        default: true,
        desc: "Disable button control for Multi-Blast Mode, use Special Abilities and/or style to toggl",
        group: "Disable"
    },

    "FETT263_DISABLE_QUOTE_PLAYER": {
        type: "boolean",
        default: true,
        desc: "Disables Force/Quote player, only uses Force.\n" +
            "This will allow Quotes to be controlled by style. Use FETT263_SPECIAL_ABILITIES to set EFFECT_QUOTE or EFFECT_NEXT_QUOTE in style\n" +
            "Cannot be used with FETT263_RANDOMIZE_QUOTE_PLAYER and FETT263_QUOTE_PLAYER_START_ON",
        group: "Disable"
    },




    /* Sound Options */
    "FETT263_DUAL_MODE_SOUND": {
        type: "boolean",
        default: true,
        desc: "Enables odd/even out.wav ignition sound selection based on blade angle. Up = odd number sounds, Down = even numbered sounds",
        group: "Sound"
    },

    "FETT263_CLASH_STRENGTH_SOUND": {
        type: "boolean",
        default: true,
        desc: "Enables selection of clash, stab and lockup sounds based on clash strength. Light clash = 01.wav, Hard clash = highest number.wav",
        group: "Sound"
    },

    "FETT263_MAX_CLASH": {
        type: "int",
        default: 8,
        desc: "The value for hardest clash level to select clash sound. Range 8 ~ 16",
        group: "Sound"
    },

    "FETT263_SAY_COLOR_LIST": {
        type: "boolean",
        default: false,
        desc: "Spoken Color Names replace default sounds during Color List Mode (requires .wav files)",
        group: "Sound"
    },

    "FETT263_RANDOMIZE_QUOTE_PLAYER": {
        type: "boolean",
        default: false,
        desc: "This will set Quote Player to randomly select quote.wav instead of playing sequentially",
        group: "Sound"
    },

    "FETT263_TRACK_PLAYER_NO_PROMPTS": {
        type: "boolean",
        default: true,
        desc: "Disables spoken voice prompts in Track Player",
        group: "Sound"
    },

    "FETT263_SAY_COLOR_LIST_CC": {
        type: "boolean",
        default: false,
        desc: "Spoken Color Names replace default sounds during Color Change \"CC\" Color List Mode (requires .wav files)",
        group: "Sound"
    },

    "FETT263_SAY_BATTERY_VOLTS": {
        type: "boolean",
        default: false,
        desc: "Spoken Battery Level as volts during On Demand Battery Level effect (requires .wav files)",
        group: "Sound"
    },

    "FETT263_SAY_BATTERY_PERCENT": {
        type: "boolean",
        default: false,
        desc: "Spoken Battery Level as percent during On Demand Battery Level effect (requires .wav files)",
        group: "Sound"
    }

}