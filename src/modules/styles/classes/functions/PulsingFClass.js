class PulsingFClass extends FUNCTION {
    constructor(PULSE_MILLIS) {
        super("Pulses between 0 and 32768 every M milliseconds", Array.from(arguments));
        this.add_arg("PULSE_MILLIS", "FUNCTION", "M");
    }

    run(blade) {
        super.run(blade)
        this.var_ = 0.5 + 0.5 * Math.sin(millis() * 3.1415 * 2.0 / this.PULSE_MILLIS.getInteger(0));
    }

    getInteger(led) {
        return this.var_ * 32768;
    }
}

function PulsingF(PULSE_MILLIS) {
    return new PulsingFClass(PULSE_MILLIS);
}