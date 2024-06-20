class TrColorCycleXClass extends TRANSITION_BASE {
    constructor(MILLIS, START_RPM, END_RPM) {
        super("ColorCycle transition", arguments);
        this.add_arg("START_RPM", "INT", "RPM at the beginning of transition", 0);
        this.add_arg("END_RPM", "INT", "RPM at the end of transition", 6000);
        this.pos_ = 0.0;
        this.last_micros_ = 0.0;
    }

    run(blade) {
        super.run(blade);
        var now = micros();
        var delta = now - this.last_micros_;
        this.last_micros_ = now;
        if (delta > 1000000) delta = 1;

        this.fade_ = this.update(1.0);

        var current_rpm = this.START_RPM.getInteger(0) * (1 - this.fade_) + this.END_RPM.getInteger(0) * this.fade_;
        var current_percentage = 100.0 * this.fade_;
        this.pos_ = fract(this.pos_ + delta / 60000000.0 * current_rpm);
        this.num_leds_ = blade.num_leds();
        this.start_ = this.pos_ * this.num_leds_;
        if (current_percentage == 100.0) {
            this.start_ = 0;
            this.end_ = this.num_leds_;
        } else if (current_percentage == 0.0) {
            this.start_ = 0;
            this.end_ = 0;
        } else {
            this.end_ = fract(this.pos_ + current_percentage / 100.0) * this.num_leds_;
        }
    }

    getColor(A, B, led) {
        var led_range = new Range(led, led + 1);
        var mix = 0;
        if (this.start_ <= this.end_) {
            mix = (new Range(this.start_, this.end_).Intersect(led_range)).Size();
        } else {
            mix = (new Range(0, this.end_).Intersect(led_range)).Size() +
                (new Range(this.start_, this.num_leds_).Intersect(led_range)).Size();
        }
        return A.mix(B, mix);
    }
}

function TrColorCycleX(MILLIS, START_RPM, END_RPM) {
    return new TrColorCycleXClass(MILLIS, START_RPM, END_RPM);
}