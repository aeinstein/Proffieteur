class ColorCycleClass extends STYLE {
    constructor(COLOR, percentage, rpm,
                ON_COLOR, on_percentage, on_rpm,
                fade_time_millis) {
        super();
        this.COLOR = ColorArg(COLOR);
        this.percentage = IntArg(percentage);
        this.rpm = IntArg(rpm);
        this.ON_COLOR = ColorArg(ON_COLOR, COLOR.DOCOPY());
        this.on_percentage = IntArg(on_percentage, percentage);
        this.on_rpm = IntArg(on_rpm, rpm);
        this.fade_time_millis = IntArg(fade_time_millis, 1);
        this.last_micros_ = 0;
        this.fade_ = 0.0;
        this.pos_ = 0.0;
    }

    run(blade) {
        this.COLOR.run(blade);
        this.ON_COLOR.run(blade);
        var now = millis();
        var delta = now - this.last_micros_;
        this.last_micros_ = now;
        if (delta > 1000) delta = 1;
        var fade_delta = delta / this.fade_time_millis;
        if (!blade.is_on()) fade_delta = -fade_delta;
        this.fade_ = Math.max(0.0, Math.min(1.0, this.fade_ + fade_delta));
        var rpm = this.rpm * (1.0 - this.fade_) + this.on_rpm * this.fade_;
        var percentage = this.percentage * (1.0 - this.fade_) + this.on_percentage * this.fade_;
        this.fraction_ = percentage / 100.0;
        this.pos_ = ((this.pos_ + delta / 60000.0 * rpm) % 1.0);
    }

    getColor(led) {
        var led_range = new Range(led / 144.0, (led + 1) / 144.0);
        var black_mix = 0.0;
        if (this.pos_ + this.fraction_ < 1.0) {
            black_mix = new Range(this.pos_, this.pos_ + this.fraction_).Intersect(led_range).Size();
        } else {
            black_mix = new Range(this.pos_, 1.0).Intersect(led_range).Size() +
                new Range(0.0, (this.pos_ + this.fraction_) % 1.0).Intersect(led_range).Size();
        }
        black_mix *= 144.0;
        var c = this.COLOR.getColor(led);
        var on_c = this.ON_COLOR.getColor(led);
        c = c.mix(on_c, this.fade_);
        c = BLACK.mix(c, black_mix);
        return c;
    }

    pp() {
        return this.PP("ColorCycle", "Rotating beam",
            this.COLOR, "beam color",
            this.percentage, "percentage of blade lit",
            this.rpm, "rotation speed",
            this.ON_COLOR, "beam color when on",
            this.on_percentage, "percentage of blade lit when on",
            this.on_rpm, "rotation speed when on",
            this.fade_time_millis, "time to transition to/from on state");
    }
};

function ColorCycle(COLOR, percentage, rpm,
                    ON_COLOR, on_percentage, on_rpm,
                    fade_time_millis) {
    return new ColorCycleClass(COLOR, percentage, rpm,
        ON_COLOR, on_percentage, on_rpm,
        fade_time_millis);
}