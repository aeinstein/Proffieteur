class AudioFlickerLClass extends MACRO {
    constructor(COLOR) {
        super("Audio flicker layer, higher volumes means less transparent.", arguments);
        this.add_arg("COLOR", "COLOR", "COLOR");
        this.SetExpansion(AlphaL(this.COLOR, NoisySoundLevelCompat()));
    }
}

function AudioFlickerL(B) {
    return new AudioFlickerLClass(B);
}