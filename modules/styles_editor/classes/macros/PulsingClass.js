class PulsingClass extends MACRO {
    constructor(COLOR1, COLOR2, PULSE_MILLIS) {
        super("Pulses between A and B every M milliseconds", Array.from(arguments));
        this.add_arg("COLOR1", "COLOR", "A");
        this.add_arg("COLOR2", "COLOR", "B");
        this.add_arg("PULSE_MILLIS", "INT", "M");
        this.SetExpansion(PulsingX(COLOR1, COLOR2, Int(PULSE_MILLIS)));
    }
}

function Pulsing(COLOR1, COLOR2, PULSE_MILLIS) {
    return new PulsingClass(COLOR1, COLOR2, PULSE_MILLIS);
}