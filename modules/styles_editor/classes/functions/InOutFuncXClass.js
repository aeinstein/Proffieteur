class InOutFuncXClass extends FUNCTION {
    constructor(OUT_MILLIS, IN_MILLIS) {
        super("0 when off, 32768 when on, OUT_MILLIS/IN_MILLIS determines speed in between.", arguments);
        this.add_arg("OUT_MILLIS", "FUNCTION", "millis to ramp up");
        this.add_arg("IN_MILLIS", "FUNCTION", "millis to ramp down");
        this.last_micros = 0;
        this.extension = 0.0;
    }

    run(blade) {
        super.run(blade);
        var now = micros();
        var delta = now - this.last_micros;
        if (delta < 0 || delta > 1000000) delta = 1;
        this.last_micros = now;
        if (blade.is_on()) {
            if (this.extension == 0.0) {
                this.extension = 0.00001;
            } else {
                this.extension += delta / (this.OUT_MILLIS.getInteger(0) * 1000.0);
                this.extension = Math.min(this.extension, 1.0);
            }
        } else {
            this.extension -= delta / (this.IN_MILLIS.getInteger(0) * 1000.0);
            this.extension = Math.max(this.extension, 0.0);
        }
        this.ret = this.extension * 32768;
    }

    getInteger(led) {
        return this.ret;
    }

    argify(status) {
        state.int_argument = IGNITION_TIME_ARG;
        this.OUT_MILLIS = this.OUT_MILLIS.argify(status);

        state.int_argument = RETRACTION_TIME_ARG;
        this.IN_MILLIS = this.IN_MILLIS.argify(status);

        return this;
    }
};

function InOutFuncX(O, I) {
    return new InOutFuncXClass(O, I);
}