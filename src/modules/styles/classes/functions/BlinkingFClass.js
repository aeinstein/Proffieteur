class BlinkingFClass extends FUNCTION {
    constructor(BLINK_MILLIS, BLINK_PROMILLE) {
        super("Blinks between 0 and 32768", Array.from(arguments));
        this.add_arg("BLINK_MILLIS", "FUNCTION", "milliseconds between blinks");
        this.add_arg("BLINK_PROMILLE", "FUNCTION", "0 = off, 1000 = on");
        this.on_ = false;
        this.pulse_start_micros_ = 0;
    }

    run(blade) {
        super.run(blade);
        var now = micros();
        var pulse_millis = this.BLINK_MILLIS.getInteger(0);
        if (pulse_millis <= 0) return;
        var pulse_progress_micros = now - this.pulse_start_micros_;
        if (pulse_progress_micros > pulse_millis * 1000) {
            // Time to start a new pulse
            if (pulse_progress_micros < pulse_millis * 2000) {
                this.pulse_start_micros_ += pulse_millis * 1000;
            } else {
                this.pulse_start_micros_ = now;
            }
            pulse_progress_micros = now - this.pulse_start_micros_;
        }
        var pulse_progress_promille = pulse_progress_micros / pulse_millis;
        this.value_ = pulse_progress_promille <= this.BLINK_PROMILLE.getInteger(0) ? 0 : 32768;
    }

    getInteger(led) {
        return this.value_;
    }
};

function BlinkingF(BM, BP) {
    return new BlinkingFClass(BM, BP);
}