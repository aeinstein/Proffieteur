class InOutSparkTipClass extends STYLE {
    constructor(T, OUT_MILLIS, IN_MILLIS, OFF_COLOR) {
        super("Implements extention/retraction", arguments);
        this.add_arg("T", "COLOR", "base color");
        this.add_arg("OUT_MILLIS", "INT", "extentions length in ms");
        this.add_arg("IN_MILLIS", "INT", "retraction length in ms");
        this.add_arg("SPARK_COLOR", "COLOR", "color of spark tip", WHITE.DOCOPY());
        this.last_micros_ = 0;
        this.extension = 0;
    }

    run(blade) {
        this.T.run(blade);
        this.SPARK_COLOR.run(blade);

        var now = micros();
        var delta = now - this.last_micros_;
        this.last_micros_ = now;
        if (blade.is_on()) {
            if (this.extension == 0.0) {
                // We might have been off for a while, so delta might
                // be insanely high.
                this.extension = 0.00001;
            } else {
                this.extension += delta / (this.OUT_MILLIS * 1000.0);
                this.extension = Math.min(this.extension, 1.0);
            }
        } else {
            this.extension -= delta / (this.IN_MILLIS * 1000.0);
            this.extension = Math.max(this.extension, 0.0);
        }
        var thres = this.extension * (blade.num_leds() + 5) * 256;
        this.thres1 = Math.floor(thres);
        if (blade.is_on()) {
            this.thres2 = Math.floor(thres) - 1024;
        } else {
            this.thres2 = Math.floor(thres) + 1024;
        }
    }

    getColor(led) {
        var x1 = led + 1 - this.thres1 / 256.0;
        x1 = min(x1, 1.0);
        x1 = max(x1, 0.0);
        var x2 = led + 1 - this.thres2 / 256.0;
        x2 = min(x2, 1.0);
        x2 = max(x2, 0.0);
        var c = this.T.getColor(led);
        var spark_color = this.SPARK_COLOR.getColor(led);
        var off = Rgb(0, 0, 0);
        return c.mix(spark_color, x2).mix(off, x1);
    }
};

function InOutSparkTip(T, I, O, S) {
    return new InOutSparkTipClass(T, I, O, S);
}