class InOutTrLClass extends STYLE {
    isEffect() {
        return true;
    }

    constructor(OUT_TR, IN_TR, OFF, AD) {
        super("In-out based on transitions", arguments);
        this.add_arg("OUT_TR", "TRANSITION", "IN-OUT transition");
        this.add_arg("IN_TR", "TRANSITION", "OUT-IN transition");
        this.add_arg("OFF", "COLOR", "Color when off", BLACK.DOCOPY());
        this.add_arg("ALLOW_DISABLE", "INT", "allow disable?", 1);
        this.on_ = false;
        this.out_active_ = false;
        this.in_active_ = false;
    }

    run(blade) {
        this.OFF.run(blade);

        if (this.on_ != blade.is_on()) {
            this.on_ = blade.is_on();
            if (this.on_) {
                this.OUT_TR.begin();
                this.out_active_ = true;
            } else {
                this.IN_TR.begin();
                this.in_active_ = true;
            }
        }

        if (this.out_active_) {
            this.OUT_TR.run(blade);
            if (this.OUT_TR.done()) {
                this.out_active_ = false;
            }
        }

        if (this.in_active_) {
            this.IN_TR.run(blade);
            if (this.IN_TR.done()) {
                this.in_active_ = false;
            }
        }
    }

    runIn(A, B, led) {
        if (this.in_active_) {
            return this.IN_TR.getColor(A, B, led);
        } else {
            return B;
        }
    }

    runOut(A, B, led) {
        if (this.out_active_) {
            return this.OUT_TR.getColor(A, B, led);
        } else {
            return B;
        }
    }

    getColor(led) {
        if (!this.out_active_ && !this.in_active_) {
            if (this.on_) {
                return Transparent();
            } else {
                return this.OFF.getColor(led);
            }
        } else {
            var on = Transparent();
            var off = this.OFF.getColor(led);
            if (this.on_) {
                return this.runOut(this.runIn(on, off, led), on, led);
            } else {
                return this.runIn(this.runOut(off, on, led), off, led);
            }
        }
    }
};

function InOutTrL(OUT_TR, IN_TR, OFF, AD) {
    return new InOutTrLClass(OUT_TR, IN_TR, OFF, AD);
}