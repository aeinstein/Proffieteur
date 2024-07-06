export class Props{
    current_props;

    BC_structure = {
        desc: "0 Buttons:\n" +
            "Activate Muted - None\n" +
            "Activate blade - forward or backward horizontal thrust movement or sharp swing movement (Swing On)\n" +
            "Play/Stop Music - hit the saber (perform clash event) holding the blade up while it's OFF\n" +
            "Turn the blade off - twist the saber like a bike handle holding the saber horizontally or blade down\n" +
            "Next Preset - slightly shake the saber like a soda can while blade is OFF (hold the saber vertically blade up in range up to 30 degrees tilt)\n" +
            "Previous Preset - None\n" +
            "Lockup - automatic by default (Battle Mode) - activates when clash happens and keeps active until swing is registered\n" +
            "Drag - None\n" +
            "Blaster Blocks - None\n" +
            "Force Effects - perform a \"push\" gesture holding the saber vertically or horizontally perpendicular to the arm\n" +
            "Enter Color Change mode - slightly shake the saber like a soda can while blade is ON (hold the saber vertically blade up in range up to 30 degrees tilt)\n" +
            "Confirm selected color and exit Color Change mode - while in Color Change mode hit the saber (perform clash event)\n" +
            "Melt - None\n" +
            "Lightning Block - None\n" +
            "Enter Multi-Block mode - None\n" +
            "\n" +
            "1 Button:\n" +
            "Activate Muted - fast double click while OFF\n" +
            "Activate blade - short click while OFF or forward thrust movement + hit or forward thrust movement or sharp swing movement (Swing On)\n" +
            "Play/Stop Music - hold 1 second and release while ON\n" +
            "Turn the blade off - hold and wait till blade is off while ON (like in Plecter boards) or twist the saber like a bike handle\n" +
            "Next Preset - hold 1 second and release while OFF\n" +
            "Previous Preset - hold and wait while OFF\n" +
            "Lockup - hold + hit clash while ON\n" +
            "Drag - hold + hit clash while ON pointing the blade tip down\n" +
            "Blaster Blocks - short click while ON\n" +
            "Force Effects - hold the button + perform \"push\" gesture holding the hilt vertically\n" +
            "Enter Color Change mode - hold the button + twist the hilt then release the button while ON\n" +
            "Confirm selected color and exit Color Change mode - hold the button until confirmation sound\n" +
            "Melt - hold the button + stab while ON\n" +
            "Lightning Block - fast double click + hold the button while ON\n" +
            "Enter Multi-Block mode - hold the button + swing the saber and release the button while ON (now swing the saber, blaster blocks will trigger automatically)\n" +
            "Exit Multi-Block mode - short click the button while ON\n" +
            "Enter Battle Mode - hold the button + use \"Gesture/Swing Ignition\" then release the button while OFF (blade will turn ON in Battle Mode)\n" +
            "Exit Battle Mode - turn the blade OFF\n" +
            "Enter Volume Menu - hold + clash while OFF\n" +
            "Volume DOWN - hold and release while in Volume Menu\n" +
            "Volume UP - short click while in Volume Menu\n" +
            "Exit Volume Menu - hold + clash while OFF and in Volume Menu\n" +
            "Battery Level - triple click while OFF\n" +
            "\n" +
            "2 Buttons:\n" +
            "Activate Muted - fast double click Activation button while OFF\n" +
            "Activate blade - short click Activation button while OFF or forward thrust movement + hit or forward thrust movement or sharp swing movement (Swing On)\n" +
            "Play/Stop Music - hold 1 second and release Activation button while OFF or ON\n" +
            "Turn the blade off - hold and wait till blade is off while ON (like in Plecter boards) or twist the saber like a bike handle\n" +
            "Next Preset - short click AUX button while OFF\n" +
            "Previous Preset - hold AUX and click Activation button while OFF\n" +
            "Lockup - hold AUX button while ON (like in Plecter boards)\n" +
            "Drag - hold AUX button while ON pointing the blade tip down\n" +
            "Blaster Blocks - short click AUX button while ON\n" +
            "Force Effects - short click Activation button while ON or perform \"push\" gesture holding the hilt vertically\n" +
            "Enter Color Change mode - hold AUX and quickly press and release Activation button while ON then release AUX button\n" +
            "Confirm selected color and exit Color Change mode - hold the button until confirmation sound\n" +
            "Melt - hold AUX (or Activation) button + perform stab action while ON\n" +
            "Lightning Block - hold Activation button + short click AUX button while ON\n" +
            "Enter Multi-Block mode - hold the Activation button + swing the saber and release the button while ON (now swing the saber, blaster blocks will trigger automatically)\n" +
            "Exit Multi-Block mode - short click AUX button while ON\n" +
            "Enter Battle Mode - hold the AUX button + swing the saber and release the button while ON or hold the Activation button + use \"Gesture/Swing Ignition\" then release the button while OFF (blade will turn ON in Battle Mode)\n" +
            "Exit Battle Mode - hold the AUX button + swing the saber and release the button while ON or turn the blade OFF\n" +
            "Enter Volume Menu - long click AUX button while OFF\n" +
            "Volume UP - short click Activation button while OFF and in Volume Menu\n" +
            "Volume DOWN - short click AUX button while OFF and in Volume Menu\n" +
            "Exit Volume Menu - long click AUX button while OFF and in Volume Menu\n" +
            "Battery level - hold AUX button while OFF\n" +
            "\n" +
            "\n" +
            "CUSTOM SOUNDS SUPPORTED (add to font to enable):\n" +
            "\n" +
            "On Demand Power Save - dim.wav\n" +
            "On Demand Battery Level - battery.wav\n" +
            "Battle Mode On (on toggle) - bmbegin.wav\n" +
            "Battle Mode Off (on toggle) - bmend.wav\n" +
            "Enter Volume Menu - vmbegin.wav\n" +
            "Exit Volume Menu - vmend.wav\n" +
            "Force Push - push.wav\n" +
            "Fast On (optional) - faston.wav\n" +
            "Multi-Blast Mode On - blstbgn.wav\n" +
            "Multi-Blast Mode Off - blstend.wav"
    }

    fett263_structure = {
        desc: "Fett263 Buttons for use with 1, 2 or 3 Button Sabers\n" +
            "\n" +
            "* 1 Button Controls based on SA22C prop\n" +
            "Includes Gesture Controls, Battle Mode 2.0, Edit Mode, Track Player, Quote/Force Player, Real Clash, Choreography Mode\n" +
            "   Dual Mode Ignition Sounds, Multi-Phase Control, Multi-Blast\n" +
            "\n" +
            " ProffieOS: Control software for lightsabers and other props.\n" +
            " http://fredrik.hubbe.net/lightsaber/teensy_saber.html\n" +
            " Copyright (c) 2016-2019 Fredrik Hubinette\n" +
            "\n" +
            " Fett263 Button (prop) file, \"Battle Mode 2.0\", \"Edit Mode\", \"Track Player\", \"Real Clash\", \"Choreography Mode\", \"Dual Mode Ignition\",\n" +
            " \"Multi-Phase\", \"Multi-Blast\"\n" +
            " Copyright (c) 2022-2023 Fernando da Rosa\n" +
            " Visit https://www.fett263.com/proffieOS7-fett263-prop-file.html for required set up and additional information\n" +
            " \n" +
            " Voice Prompts and sounds required for certain features and should be included in /common folder or /font folder on SD card.\n" +
            "   Free prompts (courtesy of Brian Conner) available here: http://fredrik.hubbe.net/lightsaber/sound/\n" +
            "\n" +
            " Track Player requires track files to be located in /font/tracks for font specific tracks or /common/tracks for universal (all presets) or a combination of the two.\n" +
            " \n" +
            "  ----- This prop enables the following EFFECTs for use in menus, Special Abilities* and/or chained effects controlled at the style level in each preset -----\n" +
            "  *requires FETT263_SPECIAL_ABILITIES define\n" +
            "\n" +
            "   EFFECT_BATTERY_LEVEL (to display/say* battery level) *requires FETT263_SAY_BATTERY_VOLTS or FETT263_SAY_BATTERY_PERCENT\n" +
            "   EFFECT_VOLUME_LEVEL (to display current volume level)\n" +
            "   EFFECT_POWERSAVE (blade dimming / powersave option)\n" +
            "   EFFECT_QUOTE (random quote* cannot be mixed with EFFECT_NEXT_QUOTE)\n" +
            "   EFFECT_NEXT_QUOTE (sequential quote)\n" +
            "   EFFECT_TRACK (plays previously selected Track (via Track Player) -or- preset's default track if \"tracks\" folder is not found)\n" +
            "   EFFECT_ALT_SOUND (enables Alt font selection from style)\n" +
            "   EFFECT_TRANSITION_SOUND (enable custom transition sounds)\n" +
            "   EFFECT_SOUND_LOOP (enable custom looped sound toggled on/off with each call)\n" +
            "   EFFECT_BEGIN_BATTLE_MODE (begin Battle Mode)\n" +
            "   EFFECT_END_BATTLE_MODE (end Battle Mode)\n" +
            "   EFFECT_BEGIN_AUTO_BLAST (begin Multi-Blast Mode)\n" +
            "   EFFECT_END_AUTO_BLAST (end Multi-Blast Mode)\n" +
            "   EFFECT_INTERACTIVE_PREON (allows prop to recognize Interactive Preon effects for primary control)\n" +
            "   EFFECT_INTERACTIVE_BLAST (allows prop to recognize Interactive Blast effects for primary control)\n" +
            "   EFFECT_ON (enable normal ignition from chained effect while OFF)\n" +
            "   EFFECT_FAST_ON (enable ignition without preon from chained effect while OFF)\n" +
            "   EFFECT_OFF (enable normal retraction from chained effect while ON)\n" +
            "   EFFECT_FAST_OFF (enable retraction without pstoff from chained effect while ON)\n" +
            "   EFFECT_SECONDARY_IGNITION (to enable separate \"secondary\" blade ignition control)\n" +
            "   EFFECT_SECONDARY_RETRACTION (to enable separate \"secondary\" blade retraction control)\n" +
            "\n" +
            "----- Available Mini Game EFFECTs -----\n" +
            "\n" +
            "    EFFECT_GAME_START (begin game effects)\n" +
            "    EFFECT_GAME_ACTION1 (game action 1)\n" +
            "    EFFECT_GAME_ACTION2 (game action 2)\n" +
            "    EFFECT_GAME_CHOICE (interactive choice based on action)\n" +
            "    EFFECT_GAME_RESPONSE1 (available response for action 1)\n" +
            "    EFFECT_GAME_RESPONSE2 (available response for action 2)\n" +
            "    EFFECT_GAME_RESULT1 (result of choice for action 1)\n" +
            "    EFFECT_GAME_RESULT2 (result of choice for action 2)\n" +
            "    EFFECT_GAME_WIN (end game with win)\n" +
            "    EFFECT_GAME_LOSE (end game with loss)\n" +
            "\n" +
            "---------- 2 / 3 Button Controls ----------\n" +
            "NOTE: \n" +
            "  Click = do short click\n" +
            "  Long Click = hold button for 1 second and release\n" +
            "  Hold = hold button down\n" +
            "  \n" +
            "Standard Controls While Blade is OFF\n" +
            "  Turn On / Ignite Saber* = Click PWR\n" +
            "    *If FETT263_MOTION_WAKE_POWER_BUTTON defined first Click will Wake up motion detection and boot sound will play\n" +
            "  Turn On / Ignite Saber (Muted) = Double Click PWR\n" +
            "  Change Preset (one at a time*) = Click AUX\n" +
            "    *if pointing down will go to previous\n" +
            "  NEW! Scroll Presets (using twist menu) = Long Click AUX\n" +
            "    Turn Right (Stepped) = Next Preset\n" +
            "      Increment by 5 = Hold PWR + Turn Right\n" +
            "    Turn Left (Stepped) = Previous Preset\n" +
            "      Increment by 5 = Hold PWR + Turn Left\n" +
            "    Click PWR = Select Preset\n" +
            "    NEW! Hold PWR = Select and Ignite Preset\n" +
            "    Click AUX = go to First Preset\n" +
            "  Play Track = Long Click PWR pointing up\n" +
            "  NEW! Track Player* = Long Click PWR parallel\n" +
            "  *requires tracks in either font/tracks/ or common/tracks/\n" +
            "  *if no tracks in font or common will \"Loop\" default track\n" +
            "    Turn Right (Stepped) = Next Track\n" +
            "    Turn Left (Stepped) = Previous Track\n" +
            "    Click PWR = Play Current Track Once\n" +
            "    Click AUX = Random (will play current track and then randomly select next tracks)\n" +
            "    Hold PWR + Turn Right = Rotate (will play current track and then next sequential tracks)\n" +
            "    Hold PWR + Turn Left = Loop Current Track\n" +
            "    Long Click PWR = Stop Track Player\n" +
            "  NEW! Force/Quote Player = Hold PWR \n" +
            "    If quotes exist in current font pointing straight down will toggle between Force/Quote and play\n" +
            "    *Quotes play sequentially 1,2,3...\n" +
            "    If parallel will do Force/Quote based on current mode\n" +
            "  NEW! Toggle Gesture Sleep* = Hold PWR + Clash\n" +
            "    *toggles gesture controls on/off\n" +
            "    *gestures sleep automatically if Blade Detect is enabled and blade is missing\n" +
            "  NEW! Toggle Spin Mode* = Hold PWR + Swing\n" +
            "    Disables Clash, Stab and Lockup effects to allow for spinning and flourishes\n" +
            "    Will play bmbegin.wav or force.wav when toggled ON/OFF\n" +
            "    *requires FETT263_SPIN_MODE define\n" +
            "  Special Abilities (Style Controlled) (requires FETT263_SPECIAL_ABILITIES)\n" +
            "    Hold PWR + Turn Right = Special Ability 5 (USER5)\n" +
            "    Hold PWR + Turn Left = Special Ability 6 (USER6)\n" +
            "    Hold AUX + Turn Right = Special Ability 7 (USER7)\n" +
            "    Hold Aux + Turn Left = Special Ability 8 (USER8)\n" +
            "  NEW Control! Volume Menu = Hold PWR, Click AUX\n" +
            "    Turn Right (Stepped) = Increase Volume (to max)\n" +
            "    Turn Left (Stepped) = Decrease Volume (to min)\n" +
            "    Click PWR or AUX = Exit\n" +
            "  Check Battery Level*  = Hold AUX, Click PWR\n" +
            "    *requires EFFECT_BATTERY_LEVEL style and/or FETT263_SAY_BATTERY_VOLTS or FETT263_SAY_BATTERY_PERCENT define\n" +
            "    *if using FETT263_BC_SAY_BATTERY_VOLTS_PERCENT\n" +
            "    Point down for volts, parallel or up for percent\n" +
            "  NEW! Change Font\n" +
            "    Next Font = Hold AUX + Long Click PWR (parallel or up)\n" +
            "    Previous Font= Hold AUX + Long Click PWR (down)\n" +
            "  NEW! Copy Preset = Hold PWR + Long Click AUX\n" +
            "\n" +
            "Optional Gesture Controls (if enabled and Gesture Sleep is deactivated)\n" +
            "  Ignite Saber\n" +
            "    Swing On\n" +
            "    Stab On\n" +
            "    Twist On\n" +
            "    Thrust On\n" +
            "\n" +
            "Standard Controls While Blade is ON\n" +
            "  Turn Off / Retract Blade* = Click PWR (Hold PWR**)\n" +
            "    *if PowerLock is disabled\n" +
            "    **using FETT263_HOLD_BUTTON_OFF define\n" +
            "  Turn Off / Retract Blade (PowerLock Mode) = Hold PWR + Hold AUX\n" +
            "  Blast Effect = Click Aux\n" +
            "  Multi-Blast Mode = Long Click Aux\n" +
            "    Each Swing in Multi-Blast Mode will deflect Blast effect\n" +
            "    To exit, click AUX or do Clash\n" +
            "  Clash Effect = Clash Saber\n" +
            "  Stab Effect = Stab (thrust and impact tip of blade on object)\n" +
            "  Lockup Effect = Hold PWR + Clash Saber (Hold AUX**)\n" +
            "      **using FETT263_HOLD_BUTTON_LOCKUP\n" +
            "      **Battle Mode changes to Hold AUX + Swing with this define\n" +
            "  Drag Effect = Hold AUX + Stab Down\n" +
            "  Melt Effect = Hold AUX + Stab Parallel or Up\n" +
            "  Lightning Block Effect = Hold PWR + click AUX\n" +
            "  NEW! Force/Quote = Long Click PWR (parallel or down)\n" +
            "    If quotes exist in current font pointing straight down will toggle between Force/Quote and play\n" +
            "    *Quotes play sequentially 1,2,3...\n" +
            "    If parallel will do Force/Quote based on current mode\n" +
            "  Start/Stop Tracks = Long Click PWR (pointing straight up)\n" +
            "    *default track only (use Track Player while OFF to select tracks or playback modes)\n" +
            "  Color Change = Hold AUX + Click PWR (parallel or down)\n" +
            "    Rotate Hilt to select color (unless ColorChange<> style is used with COLOR_CHANGE_DIRECT*)\n" +
            "      If styles use Edit Mode Color Editing styles, Color List is used\n" +
            "      If styles use ColorChange<> then colors within the style are used\n" +
            "        *if COLOR_CHANGE_DIRECT is defined then each click will change color instead of turn\n" +
            "      Otherwise ColorWheel is used per style set up.\n" +
            "    Click PWR to save\n" +
            "    Click AUX to revert\n" +
            "    NEW! Color Zoom* = Hold PWR, Release to Save\n" +
            "      *For Color List or ColorWheel you can Hold PWR down to zoom in color for easier selection\n" +
            "       Release PWR to save\n" +
            "  Power Save* = Hold AUX + Click PWR (pointing straight up)\n" +
            "    *requires EFFECT_POWERSAVE in style\n" +
            "  NEW! Change Style (All Blades)\n" +
            "    Next Style = Hold AUX + Long Click PWR (parallel or up)\n" +
            "    Previous Style = Hold AUX + Long Click PWR (down)\n" +
            "  Multi-Phase Preset Change*\n" +
            "    *requires FETT263_MULTI_PHASE define, cannot be used with FETT263_SPECIAL_ABILITIES\n" +
            "    Hold AUX + Twist =  Next Preset\n" +
            "    Hold PWR + Twist = Previous Preset\n" +
            "  Special Abilities (Style Controlled) (requires FETT263_SPECIAL_ABILITIES)\n" +
            "    Hold PWR + Turn Right = Special Ability 1 (USER1)\n" +
            "    Hold PWR + Turn Left = Special Ability 2 (USER2)\n" +
            "    Hold AUX + Turn Right = Special Ability 3 (USER3)\n" +
            "    Hold Aux + Turn Left = Special Ability 4 (USER4)\n" +
            "Optional Gesture Controls (if enabled)\n" +
            "  Retract Blade\n" +
            "    Twist Off\n" +
            "\n" +
            "\"Battle Mode\" Controls* - While ON\n" +
            "    *may vary by defines\n" +
            "  Enter/Exit Battle Mode = Hold AUX (Hold AUX + Swing**)\n" +
            "      **if FETT263_HOLD_BUTTON_LOCKUP defined\n" +
            "  Clash / Lockup = controlled by gesture\n" +
            "    Clash blade\n" +
            "      If blade swings through the clash it will do a \"glancing Clash\"\n" +
            "      If using FETT263_BM_CLASH_DETECT 6 define (Battle Mode 2.0) normal clash used for hits below the\n" +
            "        FETT263_BM_CLASH_DETECT value (1 ~ 8), if undefined or equal to 0 then Battle Mode 1.0 is used.\n" +
            "      If blade stops/slows on clash the saber will initiate Begin Lockup\n" +
            "      To perform a \"clash\" do an immediate Pull Away this will transition from Begin Lockup to End Lockup in quick succession\n" +
            "      To Lockup, steady the blade after Clash\n" +
            "      To end Lockup do Pull Away\n" +
            "  Drag / Melt = controlled by gesture\n" +
            "    Stab (thrust with impact at tip of blade)\n" +
            "      If pointing down Drag will initiate\n" +
            "      To end Drag pull blade up from floor at an angle\n" +
            "      If parallel or up Melt will initiate\n" +
            "      To end Melt pull blade away from object at an angle\n" +
            "  Blast Effect = Click AUX\n" +
            "    After Blast, swing within 2 seconds to enter Multi-Blast Mode\n" +
            "  Multi-Blast Mode = Long Click AUX\n" +
            "    Each Swing in Multi-Blast Mode will deflect Blast effect\n" +
            "    To exit, click AUX or do Clash\n" +
            "  Lightning Block = Hold PWR, Click AUX\n" +
            "  Force Push* = Push Saber\n" +
            "    *requires FETT263_FORCE_PUSH\n" +
            "  NEW! Force/Quote = Long Click PWR (parallel or down)\n" +
            "    If pointing down will toggle Force/Quote mode and do Force Effect or play Quote accordingly\n" +
            "    *Quote plays sequentially\n" +
            "    If parallel will do Force/Quote\n" +
            "  Start/Stop Tracks = Long Click PWR (pointing up)\n" +
            "    *default track only (use Track Player while OFF to select tracks or playback modes)\n" +
            "\n" +
            "Rehearsal / Choreography Modes*\n" +
            "  *requires FETT263_SAVE_CHOREOGRAPHY define, cannot be used with FETT263_SPECIAL_ABILITIES\n" +
            "  Begin Rehearsal** = While Off, Hold AUX + Twist\n" +
            "      **If a Saved Rehearsal Exists it will prompt you to \"Replace?\"\n" +
            "        To confirm Turn the hilt Right (Clockwise) to \"Accept\" and Click PWR to begin a new Rehearsal\n" +
            "        To keep saved rehearsal Click AUX and Rehearsal Mode will be cancelled.\n" +
            "    Saber will Ignite in Rehearsal Mode\n" +
            "    In Rehearsal Mode, standard Clash and Lockup controls are used to record sequence\n" +
            "  Clash = Clash\n" +
            "  Hold PWR + Clash = Lockup\n" +
            "    Rehearsal will also record the sound files used for each effect to repeat in Choreography\n" +
            "  Cancel Rehearsal Mode = Hold AUX\n" +
            "  Save Rehearsal = Hold PWR\n" +
            "  Begin Choreography = While Off, Hold AUX - or - Hold AUX + Swing\n" +
            "    During Choreography Mode Clashes, Lockups and sound files are replayed in sequence\n" +
            "    When recorded sequence completes the saber goes into Battle Mode automatically\n" +
            "    If no saved rehearsal is available for font saber will ignite in Battle Mode*\n" +
            "    *may vary by define\n" +
            "    During Choreography PWR button is disabled\n" +
            "  Turn Off = Hold AUX + Hold PWR\n" +
            "\n" +
            "Edit Mode*\n" +
            "    *requires FETT263_EDIT_MODE_MENU & ENABLE_ALL_EDIT_OPTIONS defines\n" +
            "    *requires /common folder with all menu prompt sounds\n" +
            "  Enter Edit Mode = While Off, Hold AUX + Hold PWR\n" +
            "    If menu prompt wav files are missing from preset you will get \"Error in Font Directory\" warning, refer to Edit Mode setup and requirements\n" +
            "\n" +
            "  While in Edit Mode controls are as follows:\n" +
            "    Rotate Forward, Increase Value, Confirm \"Yes\" = Turn Right (Stepped)\n" +
            "      Increment by 5 (Fonts, Tracks, Blade Length) = Hold PWR + Turn Right\n" +
            "      Increment by 500 (Ignition Time, Ignition Delay, Retraction Time, Retraction Delay) = Hold PWR + Turn Right\n" +
            "      Increment by 5000 (Ignition Option2, Retraction Option2) = Hold PWR + Turn Right\n" +
            "    Rotate Back, Decrease Value, Confirm \"No\" = Turn Left (Stepped)\n" +
            "      Increment by 5 (Fonts, Tracks, Blade Length) = Hold PWR + Turn Left\n" +
            "      Increment by 500 (Ignition Time, Ignition Delay, Retraction Time, Retraction Delay) = Hold PWR + Turn Left\n" +
            "      Increment by 5000 (Ignition Option2, Retraction Option2) = Hold PWR + Turn Left\n" +
            "    Select, Save, Enter = Click PWR\n" +
            "    Cancel, Revert, Go Back = Click AUX\n" +
            "    Go to Main Menu (from sub-menu) - Hold AUX\n" +
            "    Exit Edit Mode - Hold AUX (or rotate to \"Exit\") while in Main Menu\n" +
            "\n" +
            "  \"Edit Color\" Additional Control\n" +
            "    \"Color List\" and \"Adjust Color Hue\" Zoom Mode = Hold PWR while turning to Zoom color in, release to save\n" +
            "\n" +
            "Edit Settings* (Settings Only version of Edit Mode)\n" +
            "    *requires FETT263_EDIT_SETTINGS_MENU & ENABLE_ALL_EDIT_OPTIONS defines\n" +
            "    *requires /common folder with all menu prompt sounds\n" +
            "  Enter Edit Settings = While Off, Hold AUX + Hold PWR\n" +
            "    If menu prompt wav files are missing from preset you will get \"Error in Font Directory\" warning, refer to Edit Mode setup and requirements\n" +
            "\n" +
            "  While in Edit Mode controls are as follows:\n" +
            "    Rotate Forward, Increase Value, Confirm \"Yes\" = Turn Right (Stepped)\n" +
            "      Increment by 5 (Blade Length) = Hold PWR + Turn Right\n" +
            "    Rotate Back, Decrease Value, Confirm \"No\" = Turn Left (Stepped)\n" +
            "      Increment by 5 (Blade Length) = Hold PWR + Turn Left\n" +
            "    Select, Save, Enter = Click PWR\n" +
            "    Cancel, Revert, Go Back = Click AUX\n" +
            "    Exit Edit Settings - Hold AUX\n" +
            "\n" +
            "---------- 1 Button Controls (based on SA22C prop) ----------\n" +
            "NOTE: \n" +
            "  Click = do short click (so Double Click is two short clicks in quick succession)\n" +
            "  Long Click = hold button for 1 second and release\n" +
            "  Hold = hold button down\n" +
            "  Click and Hold = hold on Xth click (so Double Click and Hold would be click twice and hold on second)\n" +
            "  Click + Long Click = do X clicks then do long click (so Double Click + Long Click would be click twice then do a long click)\n" +
            "\n" +
            "Standard Controls While Blade is OFF\n" +
            "  Turn On / Ignite Saber* = Click PWR\n" +
            "    *If FETT263_MOTION_WAKE_POWER_BUTTON defined first Click will Wake up motion detection and boot sound will play  \n" +
            "  NEW Control! Turn On / Ignite Saber (Muted) = Click + Long Click PWR\n" +
            "  NEW Control! Start / Stop Tracks = Double Click PWR (pointing straight up)\n" +
            "  NEW! Track Player* = Double Click PWR (parallel or down)\n" +
            "    *if only default track exists in current preset, track will \"Loop\"\n" +
            "    Turn Right (Stepped) = Next Track\n" +
            "    Turn Left (Stepped) = Previous Track\n" +
            "    Click PWR = Play Current Track Once\n" +
            "    Hold PWR = Random (will play current track and then randomly select next tracks)\n" +
            "    Hold PWR + Turn Right = Rotate (will play current track and then next sequential tracks)\n" +
            "    Hold PWR + Turn Left = Loop Current Track\n" +
            "  NEW! Force/Quote Player - Triple Click PWR\n" +
            "    If quotes exist in current font pointing straight down will toggle between Force/Quote and play\n" +
            "    *Quotes play sequentially 1,2,3...\n" +
            "    If parallel will do Force/Quote based on current mode\n" +
            "  Special Abilities (Style Controlled) (requires FETT263_SPECIAL_ABILITIES)\n" +
            "    Hold PWR + Turn Right (parallel or up) = Special Ability 5 (USER5)\n" +
            "    Hold PWR + Turn Left (parallel or up) = Special Ability 6 (USER6)\n" +
            "    Hold PWR + Turn Right (pointing down) = Special Ability 7 (USER7)\n" +
            "    Hold PWR + Turn Left (pointing down) = Special Ability 8 (USER8)\n" +
            "  NEW! Toggle Spin Mode* = Hold PWR + Swing\n" +
            "    Disables Clash, Stab and Lockup effects to allow for spinning and flourishes\n" +
            "    Will play bmbegin.wav or force.wav when toggled ON/OFF\n" +
            "    *requires FETT263_SPIN_MODE define\n" +
            "  NEW! Toggle Gesture Sleep* = Hold PWR + Clash (pointing down)\n" +
            "    *toggles gesture controls on/off\n" +
            "    *gestures sleep automatically if Blade Detect is enabled and blade is missing\n" +
            "  Next Preset = Long Click PWR (parallel or up)\n" +
            "  NEW Control! Previous Preset = Long Click PWR (pointing down)\n" +
            "  NEW! Scroll Presets (using twist menu) = Hold PWR\n" +
            "    Turn Right (Stepped) = Next Preset\n" +
            "      Increment by 5 = Hold PWR + Turn Right\n" +
            "    Turn Left (Stepped) = Previous Preset\n" +
            "      Increment by 5 = Hold PWR + Turn Left\n" +
            "    Click PWR = Select Preset\n" +
            "    NEW! Hold PWR = Select and Ignite Preset\n" +
            "    Long Click PWR = First Preset\n" +
            "  NEW Control! Volume Menu = Hold PWR + Clash (parallel or up)\n" +
            "    Turn Right (Stepped) = Increase Volume (to max)\n" +
            "    Turn Left (Stepped) = Decrease Volume (to min)\n" +
            "    Click PWR = Exit\n" +
            "  NEW Control! Battery Level* = Double Click + Long Click PWR\n" +
            "    *requires EFFECT_BATTERY_LEVEL style and/or FETT263_SAY_BATTERY_PERCENT or FETT263_SAY_BATTERY_VOLTS define\n" +
            "    *if using FETT263_BC_SAY_BATTERY_VOLTS_PERCENT\n" +
            "    Point down for volts, parallel or up for percent\n" +
            "  NEW! Change Font\n" +
            "    Next Font = Triple Click + Long Click PWR (parallel or up)\n" +
            "    Previous Font = Triple Click + Long Click PWR (down)\n" +
            "  NEW! Copy Preset = Quadruple (Four) Click + Hold PWR\n" +
            "\n" +
            "Optional Gesture Controls (if enabled and Gesture Sleep is deactivated)\n" +
            "  Ignite Saber\n" +
            "    Swing On\n" +
            "    Stab On\n" +
            "    Twist On\n" +
            "    Thrust On\n" +
            "\n" +
            "Standard Controls While Blade is ON\n" +
            "  Turn Off / Retract Blade = Hold PWR\n" +
            "  Clash Effect = Clash Saber\n" +
            "  Lockup Effect = Hold PWR + Clash\n" +
            "  Stab Effect = Stab (thrust with impact at tip of blade)\n" +
            "  NEW Control! Drag Effect = Hold PWR + Stab (pointing straight down)\n" +
            "  Melt Effect = Hold PWR + Stab (parallel or up)\n" +
            "  Lightning Block = Double Click and Hold PWR\n" +
            "  Blast Effect = Click / Double Click / Triple Click PWR\n" +
            "  Multi-Blast Mode = Hold PWR + Swing\n" +
            "    Each Swing in Multi-Blast Mode will deflect Blast effect\n" +
            "    To exit, click PWR or do Clash\n" +
            "  NEW! Force/Quote = Long Click PWR\n" +
            "    If pointing down will toggle Force/Quote mode and do Force Effect or play Quote accordingly\n" +
            "    *Quote plays sequentially\n" +
            "    If parallel will do Force/Quote\n" +
            "  NEW! Stop Track* - Double Click PWR\n" +
            "    *if track is playing while ON\n" +
            "    To start/select track saber must be OFF\n" +
            "  NEW Control! Color Change = 4 Clicks PWR (parallel or down)\n" +
            "    Rotate Hilt to select color (unless ColorChange<> style is used with COLOR_CHANGE_DIRECT*)\n" +
            "      If styles use Edit Mode Color Editing styles, Color List is used\n" +
            "      If styles use ColorChange<> then colors within the style are used\n" +
            "        *if COLOR_CHANGE_DIRECT is defined then each click will change color instead of turn\n" +
            "      Otherwise ColorWheel is used per style set up.\n" +
            "    Click PWR to save\n" +
            "    NEW! Color Zoom* = Double Click and Hold PWR, Release to Save\n" +
            "      *For Color List or ColorWheel you can Hold PWR down to zoom in color for easier selection\n" +
            "       Release PWR to save\n" +
            "  NEW! Power Save* = 4 Clicks PWR (pointing straight up)\n" +
            "    *requires EFFECT_POWERSAVE in style\n" +
            "  Multi-Phase Preset Change*\n" +
            "    *requires FETT263_MULTI_PHASE define, cannot be used with FETT263_SPECIAL_ABILITIES\n" +
            "    Hold PWR + Twist (parallel or up) =  Next Preset \n" +
            "    Hold PWR + Twist (pointing down) = Previous Preset\n" +
            "  Special Abilities (Style Controlled) (requires FETT263_SPECIAL_ABILITIES)\n" +
            "    Hold PWR + Turn Right (parallel or up) = Special Ability 1 (USER1)\n" +
            "    Hold PWR + Turn Left (parallel or up) = Special Ability 2 (USER2)\n" +
            "    Hold PWR + Turn Right (pointing down) = Special Ability 3 (USER3)\n" +
            "    Hold PWR + Turn Left (pointing down) = Special Ability 4 (USER4)\n" +
            "  NEW! Change Style (All Blades)\n" +
            "    Next Style = Triple Click + Long Click PWR (parallel or up)\n" +
            "    Previous Style = Triple Click + Long Click PWR (down)\n" +
            "\n" +
            "Optional Gesture Controls (if enabled)\n" +
            "  Retract Blade\n" +
            "    Twist Off\n" +
            "\n" +
            "\"Battle Mode\" Controls* - While ON\n" +
            "    *may vary by defines\n" +
            "  Enter/Exit Battle Mode = Triple Click and Hold PWR\n" +
            "  Clash / Lockup = controlled by gesture\n" +
            "    Clash blade\n" +
            "      If blade swings through the clash it will do a \"glancing Clash\"\n" +
            "      If using FETT263_BM_CLASH_DETECT 6 define (Battle Mode 2.0) normal clash used for hits below the\n" +
            "        FETT263_BM_CLASH_DETECT value (1 ~ 8), if undefined or equal to 0 then Battle Mode 1.0 is used.\n" +
            "      If blade stops/slows on clash the saber will initiate Begin Lockup\n" +
            "      To perform a \"clash\" do an immediate Pull Away this will transition from Begin Lockup to End Lockup in quick succession\n" +
            "      To Lockup, steady the blade after Clash\n" +
            "      To end Lockup do Pull Away\n" +
            "  Drag / Melt = controlled by gesture\n" +
            "    Stab (thrust with impact at tip of blade)\n" +
            "      If pointing down Drag will initiate\n" +
            "      To end Drag pull blade up from floor at an angle\n" +
            "      If parallel or up Melt will initiate\n" +
            "      To end Melt pull blade away from object at an angle\n" +
            "  Blast Effect = Click PWR\n" +
            "    After Blast, swing within 2 seconds to enter Multi-Blast Mode\n" +
            "  Lightning Block = Double Click and Hold PWR\n" +
            "  Force Push* = Push Saber\n" +
            "    *requires FETT263_FORCE_PUSH\n" +
            "\n" +
            "Rehearsal / Choreography Modes*\n" +
            "  *requires FETT263_SAVE_CHOREOGRAPHY define\n" +
            "  Begin Rehearsal** = While Off, Triple Click and Hold PWR\n" +
            "      **If a Saved Rehearsal Exists it will prompt you to \"Replace?\"\n" +
            "        To confirm Turn the hilt Right (Clockwise) to \"Accept\" and Click PWR to begin a new Rehearsal\n" +
            "        To keep saved rehearsal Click AUX and Rehearsal Mode will be cancelled.\n" +
            "    Saber will Ignite in Rehearsal Mode\n" +
            "    In Rehearsal Mode, standard Clash and Lockup controls are used to record sequence\n" +
            "  Clash = Clash\n" +
            "  Hold PWR + Clash = Lockup\n" +
            "    Rehearsal will also record the sound files used for each effect to repeat in Choreography\n" +
            "  Cancel Rehearsal Mode = Triple Click and Hold PWR\n" +
            "  Save Rehearsal = Hold PWR\n" +
            "  Begin Choreography = While Off, Hold PWR + Swing\n" +
            "    During Choreography Mode Clashes, Lockups and sound files are replayed in sequence\n" +
            "    When recorded sequence completes the saber goes into Battle Mode automatically\n" +
            "    If no saved rehearsal is available for font saber will ignite in Battle Mode*\n" +
            "    *may vary by define\n" +
            "  End Choreography = Hold PWR\n" +
            "\n" +
            "Edit Mode*\n" +
            "    *requires FETT263_EDIT_MODE_MENU & ENABLE_ALL_EDIT_OPTIONS defines\n" +
            "    *requires /common folder with all menu prompt sounds\n" +
            "  Enter Edit Mode = While Off, Double Click and Hold PWR\n" +
            "    If menu prompt wav files are missing from preset you will get \"Error in Font Directory\" warning, refer to Edit Mode setup and requirements\n" +
            "\n" +
            "  While in Edit Mode controls are as follows:\n" +
            "    Rotate Forward, Increase Value, Confirm \"Yes\" = Turn Right (Stepped)\n" +
            "      Increment by 5 (Fonts, Tracks, Blade Length) = Hold PWR + Turn Right\n" +
            "      Increment by 500 (Ignition Time, Ignition Delay, Retraction Time, Retraction Delay) = Hold PWR + Turn Right\n" +
            "      Increment by 5000 (Ignition Option2, Retraction Option2) = Hold PWR + Turn Right\n" +
            "    Rotate Back, Decrease Value, Confirm \"No\" = Turn Left (Stepped)\n" +
            "      Increment by 5 (Fonts, Tracks, Blade Length) = Hold PWR + Turn Left\n" +
            "      Increment by 500 (Ignition Time, Ignition Delay, Retraction Time, Retraction Delay) = Hold PWR + Turn Left\n" +
            "      Increment by 5000 (Ignition Option2, Retraction Option2) = Hold PWR + Turn Left   \n" +
            "    Select, Save, Enter = Click PWR\n" +
            "    Cancel, Revert, Go Back = Long Click PWR\n" +
            "    Go to Main Menu (from sub-menu) - Hold PWR\n" +
            "    Exit Edit Mode - Hold PWR (or rotate to \"Exit\") while in Main Menu\n" +
            "\n" +
            "  \"Edit Color\" Additional Control\n" +
            "    \"Color List\" and \"Adjust Color Hue\" Zoom Mode = Double Click and Hold PWR while turning to Zoom color in, release to save\n" +
            "\n" +
            "Edit Settings* (Settings Only version of Edit Mode)\n" +
            "    *requires FETT263_EDIT_SETTINGS_MENU & ENABLE_ALL_EDIT_OPTIONS defines\n" +
            "    *requires /common folder with all menu prompt sounds\n" +
            "  Enter Edit Mode = While Off, Double Click and Hold PWR\n" +
            "    If menu prompt wav files are missing from preset you will get \"Error in Font Directory\" warning, refer to Edit Mode setup and requirements\n" +
            "\n" +
            "  While in Edit Mode controls are as follows:\n" +
            "    Rotate Forward, Increase Value, Confirm \"Yes\" = Turn Right (Stepped)\n" +
            "      Increment by 5 (Blade Length) = Hold PWR + Turn Right\n" +
            "    Rotate Back, Decrease Value, Confirm \"No\" = Turn Left (Stepped)\n" +
            "      Increment by 5 (Blade Length) = Hold PWR + Turn Left    \n" +
            "    Select, Save, Enter = Click PWR\n" +
            "    Cancel, Revert, Go Back = Long Click PWR\n" +
            "    Exit Edit Settings - Hold PWR\n" +
            "\n" +
            "---------- || ----------\n" +
            "\n" +
            "OPTIONAL DEFINES (added to CONFIG_TOP in config.h file)\n" +
            "\n" +
            "  FETT263_EDIT_MODE_MENU\n" +
            "  Enable Edit Mode Menu System\n" +
            "  Requires ENABLE_ALL_EDIT_OPTIONS\n" +
            "\n" +
            "  FETT263_EDIT_SETTINGS_MENU\n" +
            "  Enable Edit Settings Menu (Volume, Clash Threshold, Blade Length, Gestures/Controls, Brightness)\n" +
            "  I recommend setting USB Type = \"Serial + WebUSB\" under Arduino > Tools to allow for style, font, track, color editing via ProffieOS Workbench\n" +
            "  Cannot be combined with FETT263_EDIT_MODE_MENU\n" +
            "  Requires ENABLE_ALL_EDIT_OPTIONS\n" +
            "\n" +
            "  FETT263_SAVE_CHOREOGRAPHY\n" +
            "  Enables Enhanced Battle Mode with Saved Choreography, cannot be used with FETT263_SPECIAL_ABILITIES\n" +
            "\n" +
            "  FETT263_DUAL_MODE_SOUND\n" +
            "  Enables odd/even out.wav ignition sound selection based on blade angle\n" +
            "  Up = odd number sounds, Down = even numbered sounds\n" +
            "\n" +
            "  FETT263_CLASH_STRENGTH_SOUND\n" +
            "  Enables selection of clash, stab and lockup sounds based on clash strength\n" +
            "  Light clash = 01.wav, Hard clash = highest number.wav\n" +
            "\n" +
            "  FETT263_MAX_CLASH 16\n" +
            "  The value for hardest clash level to select clash sound\n" +
            "  Range 8 ~ 16\n" +
            "  \n" +
            "  FETT263_QUICK_SELECT_ON_BOOT\n" +
            "  Enables Preset Selection Menu on Boot (when power is first applied)\n" +
            "  Use Dial Menu to turn to desired preset, click PWR to select or hold PWR to select and ignite\n" +
            "\n" +
            "  FETT263_SAY_COLOR_LIST\n" +
            "  Spoken Color Names replace default sounds during Color List Mode (requires .wav files)\n" +
            "  \n" +
            "  FETT263_SAY_COLOR_LIST_CC\n" +
            "  Spoken Color Names replace default sounds during Color Change \"CC\" Color List Mode (requires .wav files)\n" +
            "\n" +
            "  FETT263_SAY_BATTERY_VOLTS\n" +
            "  Spoken Battery Level as volts during On Demand Battery Level effect (requires .wav files)\n" +
            "  \n" +
            "  FETT263_SAY_BATTERY_PERCENT\n" +
            "  Spoken Battery Level as percent during On Demand Battery Level effect (requires .wav files)\n" +
            "\n" +
            "  == BATTLE MODE OPTIONS ==\n" +
            "    Battle Mode is enabled via controls by default in this prop, you can customize further with these defines\n" +
            "\n" +
            "    FETT263_BATTLE_MODE_ALWAYS_ON - Battle Mode is always on, toggle controls deactivated\n" +
            "      This will disable traditional Clash and Stab effects (cannot be used with FETT263_BATTLE_MODE_START_ON)\n" +
            "\n" +
            "    FETT263_BATTLE_MODE_START_ON - Battle Mode is active with each ignition by default but can be toggled using Aux + Swing control\n" +
            "      (cannot be used with FETT263_BATTLE_MODE_ALWAYS_ON)\n" +
            "\n" +
            "    FETT263_LOCKUP_DELAY 200\n" +
            "      This is the \"delay\" in millis to determine Clash vs Lockup\n" +
            "\n" +
            "    FETT263_BM_CLASH_DETECT 6\n" +
            "      The max value to use clashes in Battle Mode 2.0, clashes used on clash strength below this value\n" +
            "      This allows light clashes to produce clash effects instead of using Begin/End Lockup\n" +
            "      (above this value Clash is performed by quick pull away using Begin/End Lockup sounds and effect)\n" +
            "      Range 0 ~ 8 (note 0 will use Battle Mode 1.0 with all clashes being Begin/End Lockup)\n" +
            "\n" +
            "    FETT263_BM_DISABLE_OFF_BUTTON\n" +
            "      During Battle Mode Power Button Retraction is disabled for normal 2 button control\n" +
            "\n" +
            "  == Swing On ==\n" +
            "    Gesture Ignition via Swing\n" +
            "    You can use one of the following defines to enable swing on:\n" +
            "\n" +
            "      FETT263_SWING_ON - To enable Swing On Ignition control (automatically enters Battle Mode, uses Fast On)\n" +
            "\n" +
            "      FETT263_SWING_ON_PREON - Disables Fast On ignition for Swing On so Preon is used (cannot be used with FETT263_SWING_ON)\n" +
            "\n" +
            "    FETT263_SWING_ON_NO_BM - To enable Swing On Ignition control but not activate Battle Mode\n" +
            "        (Combine with FETT263_SWING_ON or FETT263_SWING_ON_PREON,\n" +
            "        cannot be used with FETT263_BATTLE_MODE_ALWAYS_ON or FETT263_BATTLE_MODE_START_ON)\n" +
            "\n" +
            "    FETT263_SWING_ON_SPEED 250\n" +
            "      Adjust Swing Speed required for Ignition 250 ~ 500 recommended\n" +
            "\n" +
            "  == Twist Off ==\n" +
            "    Gesture Retraction via Twist (back and forth)\n" +
            "\n" +
            "    FETT263_TWIST_OFF\n" +
            "    To enable Twist Off Retraction control\n" +
            "\n" +
            "    FETT263_TWIST_OFF_NO_POSTOFF\n" +
            "    To enable Twist Off Retraction control, skips Postoff\n" +
            "\n" +
            "  == Twist On ==\n" +
            "    Gesture Ignition via Twist (back and forth)\n" +
            "    You can use one of the following defines to enable twist on:\n" +
            "\n" +
            "      FETT263_TWIST_ON - To enable Twist On Ignition control (automatically enters Battle Mode, uses Fast On)\n" +
            "\n" +
            "      FETT263_TWIST_ON_PREON - Disables Fast On ignition for Twist On so Preon is used (cannot be used with FETT263_TWIST_ON)\n" +
            "\n" +
            "    FETT263_TWIST_ON_NO_BM - To enable Twist On Ignition control but not activate Battle Mode\n" +
            "      (Combine with FETT263_TWIST_ON or FETT263_TWIST_ON_PREON,\n" +
            "      cannot be used with FETT263_BATTLE_MODE_ALWAYS_ON or FETT263_BATTLE_MODE_START_ON)\n" +
            "\n" +
            "  == Stab On ==\n" +
            "    Gesture Ignition via Stab (linear movement + clash at tip of blade)\n" +
            "    You can use one of the following defines to enable stab on:\n" +
            "\n" +
            "      FETT263_STAB_ON - To enable Stab On Ignition control (automatically enters Battle Mode, uses Fast On)\n" +
            "\n" +
            "      FETT263_STAB_ON_PREON - Disables Fast On ignition for Stab On so Preon is used (cannot be used with FETT263_STAB_ON)\n" +
            "\n" +
            "    FETT263_STAB_ON_NO_BM - To enable Stab On Ignition control but not activate Battle Mode\n" +
            "    (Combine with FETT263_STAB_ON or FETT263_STAB_ON_PREON,\n" +
            "    cannot be used with FETT263_BATTLE_MODE_ALWAYS_ON or FETT263_BATTLE_MODE_START_ON)\n" +
            "\n" +
            "  == Thrust On ==\n" +
            "    Gesture Ignition via Thrust (linear movement)\n" +
            "    You can use one of the following defines to enable thrust on:\n" +
            "\n" +
            "      FETT263_THRUST_ON - To enable Thrust On Ignition control (automatically enters Battle Mode, uses Fast On)\n" +
            "\n" +
            "      FETT263_THRUST_ON_PREON - Disables Fast On ignition for Thrust On so Preon is used (cannot be used with FETT263_THRUST_ON)\n" +
            "\n" +
            "    FETT263_THRUST_ON_NO_BM - To enable Thrust On Ignition control but not activate Battle Mode\n" +
            "      (Combine with FETT263_THRUST_ON or FETT263_THRUST_ON_PREON,\n" +
            "      cannot be used with FETT263_BATTLE_MODE_ALWAYS_ON or FETT263_BATTLE_MODE_START_ON)\n" +
            "\n" +
            "  == Gesture Sleep ==\n" +
            "  Toggle Gesture Ignition and Retraction detection to disable or enable gesture options\n" +
            "\n" +
            "  FETT263_SAVE_GESTURE_OFF - Save \"Gesture Sleep\" setting to turn gesture ignitions and retractions off on boot\n" +
            "\n" +
            "  == Force Push ==\n" +
            "    Push movement triggers push.wav (or force.wav if push.wav is not present)\n" +
            "    You can use one of the following defines to enable force push:\n" +
            "\n" +
            "      FETT263_FORCE_PUSH - To enable gesture controlled Force Push during Battle Mode\n" +
            "        (will use push.wav or force.wav if not present)\n" +
            "\n" +
            "      FETT263_FORCE_PUSH_ALWAYS_ON - To enable gesture controlled Force Push full time\n" +
            "        (will use push.wav or force.wav if not present)\n" +
            "\n" +
            "    FETT263_FORCE_PUSH_LENGTH 5 - Allows for adjustment to Push gesture length in millis needed to trigger Force Push\n" +
            "      Recommended range 1 ~ 10, 1 = shortest, easiest to trigger, 10 = longest\n" +
            "\n" +
            "  FETT263_SPECIAL_ABILITIES\n" +
            "  This enables 8 \"Special Ability\" controls (style controlled), 4 while ON, 4 while OFF.\n" +
            "  Special Abilities are controlled by the style and can vary in every preset, they are \"user\" defined effects/capabilities.\n" +
            "  Allows \"Multi-Phase\" to be style based, replaces FETT263_MULTI_PHASE.\n" +
            "  Cannot be used with FETT263_MULTI_PHASE or FETT263_SAVE_CHOREOGRAPHY\n" +
            "\n" +
            "  FETT263_SPIN_MODE\n" +
            "  Enables toggle for \"Spin\" Mode* which disables all clash/stab/lockup effects to allow for spinning and flourishes.\n" +
            "  Cannot be used with FETT263_SAVE_CHOREOGRAPHY or FETT263_HOLD_BUTTON_LOCKUP\n" +
            "  *Not the same as ENABLE_SPINS\n" +
            "\n" +
            "  FETT263_MULTI_PHASE\n" +
            "  This will enable a preset change while ON to create a \"Multi-Phase\" saber effect\n" +
            "\n" +
            "  MOTION_TIMEOUT 60 * 15 * 1000\n" +
            "  This extends the motion timeout to 15 minutes to allow gesture ignition to remain active\n" +
            "  Increase/decrease the \"15\" value as needed\n" +
            "  \n" +
            "  FETT263_MOTION_WAKE_POWER_BUTTON\n" +
            "  Enables a click on POWER Button to Wake Up Gestures after MOTION_TIMEOUT without igniting blade.  \n" +
            "  Saber will play boot sound and gestures will be active.\n" +
            "  \n" +
            "  FETT263_QUOTE_PLAYER_START_ON\n" +
            "  This will set Force / Quote Player to play Quote by default (if in font)\n" +
            "  \n" +
            "  FETT263_RANDOMIZE_QUOTE_PLAYER\n" +
            "  This will set Quote Player to randomly select quote.wav instead of playing sequentially\n" +
            "  \n" +
            "  FETT263_CIRCULAR_VOLUME_MENU\n" +
            "  Changes Volume Menu to Circular Control\n" +
            "\n" +
            "  FETT263_CIRCULAR_DIM_MENU\n" +
            "  Changes Brightness Menu to Circular Control\n" +
            "  \n" +
            "== Disable Features ==\n" +
            "  DISABLE_TALKIE - saves memory by replacing spoken error messages with beep sequences - \n" +
            "\n" +
            "  FETT263_DISABLE_CHANGE_FONT - Disables the \"on-the-fly\" Change Font option\n" +
            "  \n" +
            "  FETT263_DISABLE_CHANGE_STYLE - Disables the \"on-the-fly\" Change Style option\n" +
            "  \n" +
            "  FETT263_DISABLE_COPY_PRESET - Disables the \"on-the-fly\" Copy Preset option\n" +
            "  \n" +
            "  FETT263_DISABLE_BM_TOGGLE - Disable button control for Battle Mode, use gesture ignition or Special Abilities and/or style to toggle.\n" +
            "  \n" +
            "  FETT263_DISABLE_MULTI_BLAST_TOGGLE - Disable button control for Multi-Blast Mode, use Special Abilities and/or style to toggle.\n" +
            "  \n" +
            "  FETT263_DISABLE_MULTI_BLAST - Disables \"Multi-Blast\" Mode\n" +
            "\n" +
            "  FETT263_TRACK_PLAYER_NO_PROMPTS - Disables spoken voice prompts in Track Player\n" +
            "  \n" +
            "  FETT263_DISABLE_QUOTE_PLAYER - Disables Force/Quote player, only uses Force. This will allow Quotes to be controlled by style.\n" +
            "    Use FETT263_SPECIAL_ABILITIES to set EFFECT_QUOTE or EFFECT_NEXT_QUOTE in style\n" +
            "    Cannot be used with FETT263_RANDOMIZE_QUOTE_PLAYER and FETT263_QUOTE_PLAYER_START_ON\n" +
            "\n" +
            "== SA22C 2 Button Variations ==\n" +
            "  FETT263_HOLD_BUTTON_OFF - Changes to Hold PWR to turn Off / Retract\n" +
            "  \n" +
            "  FETT263_HOLD_BUTTON_LOCKUP - Enables Hold AUX for Lockup*\n" +
            "    Cannot be used with FETT263_SAVE_CHOREOGRAPHY\n" +
            "    *Clash Strength / Clash Impact effects and sounds for Lockup negated\n" +
            "    *Battle Mode control changes to hold AUX + Swing\n" +
            "    \n" +
            "== BC Variations ==\n" +
            "  FETT263_USE_BC_MELT_STAB\n" +
            "  Allows MELT to be gesture controlled full-time, uses Thrust for Stab effect\n" +
            "\n" +
            "  FETT263_BC_SAY_BATTERY_VOLTS_PERCENT\n" +
            "  Spoken Battery Level in volts and percent (point down for volts, parallel or up for percent)\n" +
            "\n" +
            "CUSTOM SOUNDS SUPPORTED (add to font to enable):\n" +
            "\n" +
            "  On Demand Power Save - dim.wav\n" +
            "  On Demand Battery Level - battery.wav\n" +
            "  Battle Mode On (on toggle) - bmbegin.wav\n" +
            "  Battle Mode Off (on toggle) - bmend.wav\n" +
            "  Enter Volume Menu - vmbegin.wav\n" +
            "  Exit Volume Menu - vmend.wav\n" +
            "  Force Push - push.wav\n" +
            "  Fast On (optional) - faston.wav\n" +
            "  Multi-Blast Mode On - blstbgn.wav\n" +
            "  Multi-Blast Mode Off - blstend.wav\n" +
            "  Quotes - quote01.wav\n" +
            "  Transition Sound - tr.wav\n" +
            "  Transition Sound Loop trloop.wav\n"
    }

    sa22c_structure = {
        desc: "sa22c props file, includes 1,2 and 3 button modes.  Incorporates multi-blast,\n" +
            "battle mode and gesture ignitions from fett263 plus  on-the-fly volume\n" +
            "controls and full access to all features with 1,2 or 3 button sabers\n" +
            "\n" +
            "New #define SA22C_NO_LOCKUP_HOLD\n" +
            "reverts to lockup being triggered only by clash + aux in 2-button mode\n" +
            "Also sets multi-blast to trigger while holding aux and swinging, rather than\n" +
            "double click and hold\n" +
            "\n" +
            "Gesture Controls\n" +
            "There are four gesture types: swing, stab, twist and thrust.  For simplicity,\n" +
            "using gesture ignition will automatically skip the preon effect.\n" +
            "Below are the options to add to the config to enable\n" +
            "the various gestures\n" +
            "\n" +
            "#define SA22C_STAB_ON\n" +
            "#define SA22C_SWING_ON\n" +
            "#define SA22C_TWIST_ON\n" +
            "#define SA22C_THRUST_ON\n" +
            "#define SA22C_TWIST_OFF\n" +
            "#define SA22C_FORCE_PUSH\n" +
            "\n" +
            "#define SA22C_FORCE_PUSH_LENGTH 5\n" +
            "Allows for adjustment to Push gesture length in millis needed to trigger Force Push\n" +
            "Recommended range 1 ~ 10, 1 = shortest, easiest to trigger, 10 = longest\n" +
            "\n" +
            "If you want the gesture ignition to ALSO enter battle mode automatically\n" +
            "on ignition, add this define\n" +
            "\n" +
            "#define GESTURE_AUTO_BATTLE_MODE\n" +
            "\n" +
            "Battle mode by fett263\n" +
            "\n" +
            "Once you enter battle mode, button functions will be disabled for lockup\n" +
            "stab, melt, etc.  Blaster blocks and lightning block will continue to be\n" +
            "triggered by button controls.  Automatic lockup/clash detection works\n" +
            "by measuring delay of the saber blade pulling back from the clash.\n" +
            "If you clash the blade and it does not pull back during the delay period,\n" +
            "it is assumed to be a lockup and the lockup effect will show on the blade.\n" +
            "If you clash the blade and pull away, only the bgn/end lockup effects will show.\n" +
            "\n" +
            "You can adjust the threshold of this detection by using\n" +
            "#define SA22C_LOCKUP_DELAY  (insert number here)\n" +
            "Default value is 200\n" +
            "\n" +
            "Battle mode features automatic clash and lockup detection plus a new\n" +
            "force push mode that will play a force or force push sound with a controlled\n" +
            "pushing gesture.  Automatic clash/lockup uses the pre and post lock effects\n" +
            "so your blade style and font MUST have those capabilities to support\n" +
            "battle mode.  Kudos to fett263 for his very impressive additions for OS 5\n" +
            "\n" +
            "Tightened click timings\n" +
            "I've shortened the timeout for short and double click detection from 500ms\n" +
            "to 300ms.  I think it feels more responsive this way but still gives enough\n" +
            "timeout to ensure all button actions can be achieved consistently\n" +
            "I've included all button timings so they can be easily tweaked to suit\n" +
            "individual tastes.\n" +
            "\n" +
            "Button configs:\n" +
            "\n" +
            "1 Button:\n" +
            "Activate Muted - double click and hold while OFF\n" +
            "Activate - short click while OFF\n" +
            "Play/Stop Music - double click while OFF\n" +
            "Turn off blade - hold and wait till blade is off while ON\n" +
            "Next Preset - hold and release while OFF\n" +
            "Prev Preset - hold and wait while OFF\n" +
            "Lockup - hold + hit clash while ON\n" +
            "Stab - thrust forward clash while ON\n" +
            "Lightning Block - double click and hold while ON\n" +
            "Melt - hold + thust forward clash while ON\n" +
            "Drag - hold + hit clash while ON pointing the blade tip down\n" +
            "Blaster Blocks - short click/double click/triple click while on\n" +
            "Multi-Blast - hold while swinging for one second and release\n" +
            "              to trigger blaster block, swing saber while in multi-blast mode\n" +
            "              to exit, hold while swinging for one second and release\n" +
            "Battle Mode - triple-click and hold while on\n" +
            "Force Effects - hold + twist the hilt while ON (while pointing up)\n" +
            "Color Change mode - hold + twist the hilt while ON (pointing down)\n" +
            "Enter Volume - Menu hold + clash while OFF\n" +
            "Volume UP - hold and release while in Volume Menu\n" +
            "Volume DOWN - click while in Volume Menu\n" +
            "Exit Volume Menu - Menu hold + clash while OFF\n" +
            "Battery Level - triple click while OFF\n" +
            "\n" +
            "\n" +
            "2 Button:\n" +
            "POWER\n" +
            "Activate Muted - double click and hold while OFF\n" +
            "Activate - short click while OFF\n" +
            "Play/Stop Music - hold and release while OFF\n" +
            "Turn off blade - hold and wait till blade is off while ON\n" +
            "Force Effects - double click while ON\n" +
            "Volume UP - short click while OFF and in VOLUME MENU\n" +
            "Prev Preset - hold and wait while OFF\n" +
            "Color Change mode - hold + toggle AUX while ON\n" +
            "Lightning Block - double click and hold while ON\n" +
            "Melt - hold while stabbing (clash with forward motion, horizontal)\n" +
            "Battle Mode - triple-click and hold for half a second while on\n" +
            "AUX\n" +
            "Blaster blocks - short click/double click/triple click while ON\n" +
            "Multi-Blast - double-click and hold for half a second\n" +
            "              to trigger blaster block, swing saber while in multi-blast mode\n" +
            "              to exit, double-click and hold for half a second\n" +
            "Next Preset - short click while OFF\n" +
            "Lockup - hold while ON\n" +
            "Drag - hold while ON pointing the blade tip down\n" +
            "Enter VOLUME MENU - long click while OFF\n" +
            "Volume down - short click while OFF and in VOLUME MENU\n" +
            "Battery level - hold while off\n" +
            "\n" +
            "3 Button: Same as two button except for the following\n" +
            "\n" +
            "AUX2\n" +
            "Lightning Block - hold while ON\n" +
            "Battle Mode - double-click and hold while on\n" +
            "Previous Preset - short click while OFF\n"
    }

    shtok_structure = {
        desc: "0 Buttons:\n" +
            "Activate Muted - None\n" +
            "Activate blade - forward or backward horizontal thrust movement or sharp swing movement (Swing On)\n" +
            "Play/Stop Music - hit the saber (perform clash event) holding the blade up while it's OFF\n" +
            "Turn the blade off - twist the saber like a bike handle holding the saber horizontally or blade down\n" +
            "Next Preset - slightly shake the saber like a soda can while blade is OFF (hold the saber vertically blade up in range up to 30 degrees tilt)\n" +
            "Previous Preset - None\n" +
            "Lockup - automatic by default (Battle Mode) - activates when clash happens and keeps active until swing is registered\n" +
            "Drag - None\n" +
            "Blaster Blocks - None\n" +
            "Force Effects - perform a \"push\" gesture holding the saber vertically or horizontally perpendicular to the arm\n" +
            "Enter Color Change mode - slightly shake the saber like a soda can while blade is ON (hold the saber vertically blade up in range up to 30 degrees tilt)\n" +
            "Confirm selected color and exit Color Change mode - while in Color Change mode hit the saber (perform clash event)\n" +
            "Melt - None\n" +
            "Lightning Block - None\n" +
            "Enter Multi-Block mode - None\n" +
            "\n" +
            "1 Button:\n" +
            "Activate Muted - fast double click while OFF\n" +
            "Activate blade - short click while OFF or forward thrust movement + hit or forward thrust movement or sharp swing movement (Swing On)\n" +
            "Play/Stop Music - hold 1 second and release while ON\n" +
            "Turn the blade off - hold and wait till blade is off while ON (like in Plecter boards) or twist the saber like a bike handle\n" +
            "Next Preset - hold 1 second and release while OFF\n" +
            "Previous Preset - hold and wait while OFF\n" +
            "Lockup - hold + hit clash while ON\n" +
            "Drag - hold + hit clash while ON pointing the blade tip down\n" +
            "Blaster Blocks - short click while ON\n" +
            "Force Effects - hold the button + perform \"push\" gesture holding the hilt vertically\n" +
            "Enter Color Change mode - hold the button + twist the hilt then release the button while ON\n" +
            "Confirm selected color and exit Color Change mode - hold the button until confirmation sound\n" +
            "Melt - hold the button + stab while ON\n" +
            "Lightning Block - fast double click + hold the button while ON\n" +
            "Enter Multi-Block mode - hold the button + swing the saber and release the button while ON (now swing the saber, blaster blocks will trigger automatically)\n" +
            "Exit Multi-Block mode - short click the button while ON\n" +
            "Enter Battle Mode - hold the button + use \"Gesture/Swing Ignition\" then release the button while OFF (blade will turn ON in Battle Mode)\n" +
            "Exit Battle Mode - turn the blade OFF\n" +
            "Enter Volume Menu - hold + clash while OFF\n" +
            "Volume DOWN - hold and release while in Volume Menu\n" +
            "Volume UP - short click while in Volume Menu\n" +
            "Exit Volume Menu - hold + clash while OFF and in Volume Menu\n" +
            "Battery Level - triple click while OFF\n" +
            "\n" +
            "2 Buttons:\n" +
            "Activate Muted - fast double click Activation button while OFF\n" +
            "Activate blade - short click Activation button while OFF or forward thrust movement + hit or forward thrust movement or sharp swing movement (Swing On)\n" +
            "Play/Stop Music - hold 1 second and release Activation button while OFF or ON\n" +
            "Turn the blade off - hold and wait till blade is off while ON (like in Plecter boards) or twist the saber like a bike handle\n" +
            "Next Preset - short click AUX button while OFF\n" +
            "Previous Preset - hold AUX and click Activation button while OFF\n" +
            "Lockup - hold AUX button while ON (like in Plecter boards)\n" +
            "Drag - hold AUX button while ON pointing the blade tip down\n" +
            "Blaster Blocks - short click AUX button while ON\n" +
            "Force Effects - short click Activation button while ON or perform \"push\" gesture holding the hilt vertically\n" +
            "Enter Color Change mode - hold AUX and quickly press and release Activation button while ON then release AUX button\n" +
            "Confirm selected color and exit Color Change mode - hold the button until confirmation sound\n" +
            "Melt - hold AUX (or Activation) button + perform stab action while ON\n" +
            "Lightning Block - hold Activation button + short click AUX button while ON\n" +
            "Enter Multi-Block mode - hold the Activation button + swing the saber and release the button while ON (now swing the saber, blaster blocks will trigger automatically)\n" +
            "Exit Multi-Block mode - short click AUX button while ON\n" +
            "Enter Battle Mode - hold the AUX button + swing the saber and release the button while ON or hold the Activation button + use \"Gesture/Swing Ignition\" then release the button while OFF (blade will turn ON in Battle Mode)\n" +
            "Exit Battle Mode - hold the AUX button + swing the saber and release the button while ON or turn the blade OFF\n" +
            "Enter Volume Menu - long click AUX button while OFF\n" +
            "Volume UP - short click Activation button while OFF and in Volume Menu\n" +
            "Volume DOWN - short click AUX button while OFF and in Volume Menu\n" +
            "Exit Volume Menu - long click AUX button while OFF and in Volume Menu\n" +
            "Battery level - hold AUX button while OFF\n" +
            "\n" +
            "\n" +
            "CUSTOM SOUNDS SUPPORTED (add to font to enable):\n" +
            "\n" +
            "On Demand Power Save - dim.wav\n" +
            "On Demand Battery Level - battery.wav\n" +
            "Battle Mode On (on toggle) - bmbegin.wav\n" +
            "Battle Mode Off (on toggle) - bmend.wav\n" +
            "Enter Volume Menu - vmbegin.wav\n" +
            "Exit Volume Menu - vmend.wav\n" +
            "Force Push - push.wav\n" +
            "Fast On (optional) - faston.wav\n" +
            "Multi-Blast Mode On - blstbgn.wav\n" +
            "Multi-Blast Mode Off - blstend.wav\n"
    }



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