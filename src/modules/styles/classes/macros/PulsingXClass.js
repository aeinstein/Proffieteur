class PulsingXClass extends MACRO {
    constructor(COLOR1, COLOR2, PULSE_MILLIS) {
        super("Pulses between A and B every M milliseconds", Array.from(arguments));
        this.add_arg("COLOR1", "COLOR", "A");
        this.add_arg("COLOR2", "COLOR", "B");
        this.add_arg("PULSE_MILLIS", "FUNCTION", "M");
        this.SetExpansion(Layers(COLOR1, PulsingL(COLOR2, PULSE_MILLIS)));
    }
}

function PulsingX(COLOR1, COLOR2, PULSE_MILLIS) {
    return new PulsingXClass(COLOR1, COLOR2, PULSE_MILLIS);
}