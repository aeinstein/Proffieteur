class StrobeXClass extends MACRO {
    constructor(T, STROBE_COLOR, STROBE_FREQUENCY, STROBE_MILLIS) {
        super("Stroboscope effect", arguments);
        this.add_arg("T", "COLOR", "Base color");
        this.add_arg("STROBE_COLOR", "COLOR", "Strobe color");
        this.add_arg("STROBE_FREQUENCY", "FUNCTION", "Strobe frequency.");
        this.add_arg("STROBE_MILLIS", "FUNCTION", "Pulse length in milliseconds.");
        this.SetExpansion(Layers(T, StrobeL(STROBE_COLOR, STROBE_FREQUENCY, STROBE_MILLIS)));
    }
}

function StrobeX(T, STROBE_COLOR, STROBE_FREQUENCY, STROBE_MILLIS) {
    return new StrobeXClass(T, STROBE_COLOR, STROBE_FREQUENCY, STROBE_MILLIS);
}