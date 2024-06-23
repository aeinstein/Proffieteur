class StrobeFClass extends FUNCTION {
    constructor(T, STROBE_COLOR, STROBE_FREQUENCY, STROBE_MILLIS) {
        super("Stroboscope effect", arguments);
        this.add_arg("STROBE_FREQUENCY", "FUNCTION", "Strobe frequency.");
        this.add_arg("STROBE_MILLIS", "FUNCTION", "Pulse length in milliseconds.");
        this.strobe_ = false;
        this.strobe_start_ = 0;
    }

    run(blade) {
        super.run(blade);
        const m = millis();
        const strobe_millis = this.STROBE_MILLIS.getInteger(0);
        const strobe_frequency = this.STROBE_FREQUENCY.getInteger(0);
        const timeout = this.strobe_ ? strobe_millis : (1000 / strobe_frequency);
        if (m - this.strobe_start_ > timeout) {
            this.strobe_start_ += timeout;
            if (m - this.strobe_start_ > strobe_millis + (1000 / strobe_frequency))
                this.strobe_start_ = m;
            this.strobe_ = !this.strobe_;
        }
    }

    getInteger(led) {
        return this.strobe_ ? 32768 : 0;
    }
}

function StrobeF(STROBE_FREQUENCY, STROBE_MILLIS) {
    return new StrobeFClass(STROBE_FREQUENCY, STROBE_MILLIS);
}