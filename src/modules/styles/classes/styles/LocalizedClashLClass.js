class LocalizedClashLClass extends STYLE {
    constructor(CLASH_COLOR, CLASH_MILLIS, CLASH_WIDTH_PERCENT, EFFECT_ARG) {
        super("Localized clash", arguments);
        this.add_arg("CLASH_COLOR", "COLOR", "Clash color", WHITE.DOCOPY());
        this.add_arg("CLASH_MILLIS", "INT", "Clash duration in milliseconds", 40);
        this.add_arg("CLASH_WIDTH_PERCENT", "INT", "Clash width in percent of entire blade", 50);
        this.add_arg("EFFECT", "EFFECT", "effect type", EFFECT(EFFECT_CLASH));
        this.effect_ = new OneshotEffectDetector(this.EFFECT);
    }

    run(blade) {
        super.run(blade);

        var m = millis();
        var clashing = 0;
        var e = this.effect_.Detect(blade);
        if (e) {
            this.clash = true;
            this.mult = blast_hump.length * 2 * 102400 / this.CLASH_WIDTH_PERCENT / blade.num_leds();
            this.clash_location = e.location * blade.num_leds() * this.mult;
        } else if (micros() - this.effect_.last_detected_ < this.CLASH_MILLIS.getInteger(0) * 1000) {
            this.clash = true;
        } else {
            this.clash = false;
        }
    }

    getColor(led) {
        var ret = Transparent();
        if (this.clash) {
            var dist = Math.floor(Math.abs(led * this.mult - this.clash_location) / 1024);
            if (dist < blast_hump.length) {
                var ret = this.CLASH_COLOR.getColor(led);
                ret = ret.multiply(blast_hump[dist] / 255.0);
            }
        }
        return ret;
    }

    IS_RUNNING() {
        return this.clash;
    }

    argify(state) {
        state.color_argument = effect_to_argument(this.EFFECT);
        var ret = super.argify(state);
        state.color_argument = null;
        return ret;
    }
}

function LocalizedClashL(CLASH_COLOR, CLASH_MILLIS, CLASH_WIDTH_PERCENT, EF) {
    return new LocalizedClashLClass(CLASH_COLOR, CLASH_MILLIS, CLASH_WIDTH_PERCENT, EF);
}
