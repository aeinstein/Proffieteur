
class StrobeLClass extends MACRO {
    constructor(STROBE_COLOR, STROBE_FREQUENCY, STROBE_MILLIS) {
        super("Stroboscope effect", arguments);
        this.add_arg("STROBE_COLOR", "COLOR", "Strobe color");
        this.add_arg("STROBE_FREQUENCY", "FUNCTION", "Strobe frequency.");
        this.add_arg("STROBE_MILLIS", "FUNCTION", "Pulse length in milliseconds.");
        this.SetExpansion(AlphaL(STROBE_COLOR, StrobeF(STROBE_FREQUENCY, STROBE_MILLIS)));
    }
}

function StrobeL(STROBE_COLOR, STROBE_FREQUENCY, STROBE_MILLIS) {
    return new StrobeLClass(STROBE_COLOR, STROBE_FREQUENCY, STROBE_MILLIS);
}