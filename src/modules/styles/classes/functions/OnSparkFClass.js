
class OnSparkFClass extends FUNCTION {
    constructor(T, SPARK_COLOR, MILLIS) {
        super("Returns 32768 on startup and then fades out for 'MILLIS' milliseconds on startup.", arguments);
        this.add_arg("MILLIS", "FUNCTION", "Millis", 200);
        this.on_ = false;
        this.on_millis_ = 0;
    }

    run(blade) {
        super.run(blade);
        const ms = this.MILLIS.getInteger(0);

        const m = millis();
        if (blade.is_on() !== this.on_) {
            this.on_ = blade.is_on();
            if (this.on_) this.on_millis_ = m;
        }
        const t = m - this.on_millis_;
        if (t < ms) {
            this.mix_ = 1.0 - t / ms;
        } else {
            this.mix_ = 0.0;
        }
    }

    getInteger(led) {
        return this.mix_ * 32768;
    }
}

function OnSparkF(MILLIS) {
    return new OnSparkFClass(MILLIS);
}