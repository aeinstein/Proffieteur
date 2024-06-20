class StrobeClass extends MACRO {
    constructor(T, STROBE_COLOR, STROBE_FREQUENCY, STROBE_MILLIS) {
        super("Stroboscope effect", arguments);
        this.add_arg("T", "COLOR", "Base color");
        this.add_arg("STROBE_COLOR", "COLOR", "Strobe color");
        this.add_arg("STROBE_FREQUENCY", "INT", "Strobe frequency.");
        this.add_arg("STROBE_MILLIS", "INT", "Pulse length in milliseconds.");
        this.SetExpansion(StrobeX(T, STROBE_COLOR, Int(STROBE_FREQUENCY), Int(STROBE_MILLIS)));
    }
}

function Strobe(T, STROBE_COLOR, STROBE_FREQUENCY, STROBE_MILLIS) {
    return new StrobeClass(T, STROBE_COLOR, STROBE_FREQUENCY, STROBE_MILLIS);
}