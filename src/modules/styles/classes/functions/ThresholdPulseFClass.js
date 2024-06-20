class ThresholdPulseFClass extends FUNCTION {
    constructor(F, THRESHOLD, HYST_PERCENT) {
        super("Generate a Pulse when F > THRESHOLD.", arguments);
        this.add_arg("F", "FUNCTION", "Input");
        this.add_arg("THRESHOLD", "FUNCTION", "Threshold", Int(32768));
        this.add_arg("HYST_PERCENT", "FUNCTION", "Hysteresis percent", Int(66));
        this.value = 0;
        this.triggered = 0;
    }

    run(blade) {
        super.run(blade);
        var f = this.F.getInteger(0);
        var threshold = this.THRESHOLD.getInteger(0);
        this.value = 0;
        if (this.triggered) {
            if (f < threshold * this.HYST_PERCENT.getInteger(0) / 100) {
                this.triggered = false;
            }
        } else {
            if (f >= threshold) {
                this.triggered = true;
                this.value = 32768;
            }
        }
    }

    getInteger(led) {
        return this.value;
    }
}

function ThresholdPulseF(F, THRESHOLD, HYST_PERCENT) {
    return new ThresholdPulseFClass(F, THRESHOLD, HYST_PERCENT);
}