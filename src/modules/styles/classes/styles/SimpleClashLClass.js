class SimpleClashLClass extends STYLE {
    constructor(T, CLASH, CLASH_MILLIS, EFFECT_ARG, STAB_SHAPE) {
        super("Implements the clash effect", Array.from(arguments));
        this.add_arg("CLASH", "COLOR", "Clash color");
        this.add_arg("CLASH_MILLIS", "INT", "How many MS to show the clash color for.", 40);
        this.add_arg("EFFECT", "EFFECT", "effect type", EFFECT(EFFECT_CLASH));
        this.add_arg("STAB_SHAPE", "FUNCTION", "Stab shape", SmoothStep(Int(16384), Int(24000)));
        this.effect_ = new OneshotEffectDetector(this.EFFECT);
        this.clash_ = false;
        this.stab_ = false;
    }

    run(blade) {
        super.run(blade);

        if (this.clash_ && micros() - this.effect_.last_detected_ > this.CLASH_MILLIS * 1000) {
            this.clash_ = false;
        }
        var e = this.effect_.Detect(blade);
        if (e) {
            this.clash_ = true;
            this.stab_ = this.EFFECT == EFFECT_CLASH && e.type == EFFECT_STAB && blade.num_leds() > 1;
        }
    }

    getColor(led) {
        var ret = Transparent();
        if (this.clash_) {
            var ret = this.CLASH.getColor(led);
            if (this.stab_) {
                ret = ret.multiply(this.STAB_SHAPE.getInteger(led) / 32768.0);
            }
        }
        return ret;
    }

    IS_RUNNING() {
        return this.clash_;
    }

    argify(state) {
        state.color_argument = effect_to_argument(this.EFFECT);
        console.log("STATE IN SIMPLECLASHL:");
        console.log(state);
        var ret = super.argify(state);
        state.color_argument = null;
        return ret;
    }
};

function SimpleClashL(T, CLASH, MILLIS, EF, SS) {
    return new SimpleClashLClass(T, CLASH, MILLIS, EF, SS);
}