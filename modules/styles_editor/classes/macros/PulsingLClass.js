class PulsingLClass extends MACRO {
    constructor(COLOR2, PULSE_MILLIS) {
        super("Pulses between transparent and B every M milliseconds", Array.from(arguments));
        this.add_arg("COLOR2", "COLOR", "B");
        this.add_arg("PULSE_MILLIS", "FUNCTION", "M");
        this.SetExpansion(AlphaL(COLOR2, PulsingF(PULSE_MILLIS)));
    }
}

function PulsingL(COLOR2, PULSE_MILLIS) {
    return new PulsingLClass(COLOR2, PULSE_MILLIS);
}