export class Props{
    current_props;

    caiwyn_structure = {
        desc: "Caiwyn's Lightsaber Controls\n" +
            "This config is designed to provide fast, low-latency response to button\n" +
            "presses for the most basic functions (blaster blocks, lockups, and clashes)\n" +
            "by omitting, or limiting non-critical features.\n" +
            "\n" +
            "At least 2 buttons are required.  A third button can be added, but is not\n" +
            "necessary.\n" +
            "\n" +
            "While saber is OFF:\n" +
            "              Next Preset: Hold Aux for 1 second when track is not playing\n" +
            "            Check Battery: Double-click and hold Aux for 1 second when\n" +
            "                           track is not playing\n" +
            "         Start/Stop Track: Click Aux\n" +
            "               Next Track: Hold Aux for 1 second while track is playing\n" +
            "                           | Tracks must be stored in <font>/tracks/*.wav\n" +
            "                           | and will be selected in alphabetical order.\n" +
            "        Track Player Mode: Double-click and hold Aux for 1 second while\n" +
            "                           track is playing\n" +
            "                           | This cycles through three playback modes:\n" +
            "                           | 1. Play a single track and stop (default)\n" +
            "                           | 2. Repeat a single track in a loop\n" +
            "                           | 3. Repeat all tracks in a loop\n" +
            "            Turn Saber On: Press Power\n" +
            "    Turn On & Start Track: Hold Aux or Aux2 and press Power\n" +
            "\n" +
            "While saber is ON:\n" +
            "            Blaster Block: Click Aux\n" +
            "                   Lockup: Hold Aux or Aux2 during impact\n" +
            "                     Drag: Hold Aux or Aux2 during impact with blade pointed\n" +
            "                           down.\n" +
            "                     Melt: Hold Aux or Aux2 and stab\n" +
            "          Lightning Block: Click/Hold Power\n" +
            "\n" +
            "        Enter Volume Menu: Double-click and hold Aux for 1 second\n" +
            "                           | Be aware that the first click will trigger a\n" +
            "                           | blaster block.\n" +
            "          Increase Volume: Rotate hilt right while in Volume Menu\n" +
            "          Decrease Volume: Rotate hilt left while in Volume Menu\n" +
            "  Save & Exit Volume Menu: Click Power\n" +
            " Reset & Exit Volume Menu: Click Aux\n" +
            "\n" +
            "  Enter Color Change Mode: Triple-click and hold Aux for 1 second\n" +
            "                           | Be aware that the first two clicks will\n" +
            "                           | trigger blaster blocks.\n" +
            "             Change Color: Rotate hilt while in Color Change Mode\n" +
            "               Color Zoom: Press & Hold Power and Rotate hilt\n" +
            "                           | This will fine-tune the selected color before\n" +
            "                           | saving your change.\n" +
            " Save & Exit Color Change: Release Power while in Color Zoom\n" +
            "Reset & Exit Color Change: Click Aux\n" +
            "\n" +
            "           Turn Saber Off: Hold Aux or Aux2 and press Power\n" +
            "\n" +
            "If CAIWYN_BUTTON_LOCKUP and/or CAIWYN_BUTTON_CLASH is defined:\n" +
            "  Non-impact Clash/Lockup: Click/Hold Power\n" +
            "                           | This generates a clash/lockup effect with no\n" +
            "                           | impact to the blade; quick press for a short\n" +
            "                           | clash, hold for a lockup.  This effect\n" +
            "                           | replaces the Lightning Block for sabers with\n" +
            "                           | only 2 buttons.\n" +
            "          Lightning Block: Hold Aux2 and press Aux (requires 3 buttons)\n" +
            "\n" +
            "You will need the following sound files in order for menus to work properly:\n" +
            "vmbegin.wav              - Enter Volume Change Menu\n" +
            "vmend.wav                - Save Volume Change\n" +
            "volmax.wav               - Reset to Maximum Volume\n" +
            "monce.wav                - Set Track Player to play a single track one time\n" +
            "mloop.wav                - Set Track Player to repeat a single track\n" +
            "mrotate.wav              - Set Track Player to repeat all tracks\n" +
            "ccbegin.wav              - Enter Color Change Mode\n" +
            "ccend01.wav              - Save Color and Exit Color Change Mode\n" +
            "ccend02.wav              - Reset Color and Exit Color Change Mode\n" +
            "battlevl.wav             - Announce Current Battery Level\n" +
            "mnum1.wav to mnum20.wav  - Individually Spoken Numbers\n" +
            "thirty.wav to ninety.wav\n" +
            "hundred.wav              - \"Hundred\"\n" +
            "mpercent.wav             - \"Percent\"\n" +
            "mselect.wav              - Beep to confirm menu selections (can be omitted)\n" +
            "You can download a package containing all of these files here:\n" +
            "https:drive.google.com/file/d/1cSBirX5STOVPanOkOlIeb0eofjx-qFmj/view",

        "CAIWYN_BUTTON_CLASH": {
            type: "boolean",
            desc: "Enables a clash to be triggered without impact to the blade by pressing the power" +
                "button.  This effect replaces lightning blocks for two-button sabers, but if a saber has three buttons, the lightning" +
                "block can be triggered by holding AUX2 and pressing AUX",
            group: "Clash"
        },

        "CAIWYN_BUTTON_LOCKUP": {
            type: "boolean",
            desc: "Enables a lockup to be triggered without impact to the blade by pressing and holding" +
                "the power button. If both CAIWYN_BUTTON_LOCKUP and CAIWYN_BUTTON_CLASH are defined, pressing" +
                "the power button triggers a lockup, but a clash sound is overlayed on top of the" +
                "lockup sounds to smooth out the transition from bgnlock and endlock sounds for quick clashes. I recommend this configuration",
            group: "Clash"
        },

        "CAIWYN_SAVE_TRACKS": {
            type: "boolean",
            desc: "Automatically saves the selected track for" +
                "each preset. Any time the user holds the" +
                "Aux button for one second to change the" +
                "active track, the preset is updated to" +
                "default to that track. This ONLY happens" +
                "when the user selects the track directly;" +
                "if the Track Player Mode is set to repeat" +
                "all tracks, the saved track is not updated" +
                "when the next track is automatically" +
                "played." +
                "If SAVE_STATE is defined, then this will" +
                "automatically be defined as well."
        },

        "CAIWYN_SAVE_TRACK_MODE": {
            type: "boolean",
        },

        "DISABLE_COLOR_CHANGE": {
            type: "boolean",
            desc: "Disables the color change menu"
        },
    };

    setPropFile(prop){
        this.current_props = this[prop + "_structure"];
        console.log(this.current_props);
    }

    getReadme(){
        return this.current_props.desc;
    }
}