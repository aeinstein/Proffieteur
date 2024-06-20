class OriginalBlastFClass extends FUNCTION {
    constructor(BASE, BLAST, EFFECT_ARG) {
        super("Original blast effect", Array.from(arguments));
        this.add_arg("EFFECT", "EFFECT", "effect type", EFFECT(EFFECT_BLAST));
    }

    run(blade) {
        super.run(blade);
        this.T = micros();
        this.num_leds_ = 1.0 * blade.num_leds();
        this.effects_ = blade.GetEffects();
    }

    getInteger(led) {
        var b = 0.0;
        for (var i = 0; i < this.effects_.length; i++) {
            if (this.effects_[i].type != this.EFFECT) continue;
            var x = (this.effects_[i].location - led / this.num_leds_) * 30.0;
            var T = (this.T - this.effects_[i].start_micros);
            var t = 0.5 + T / 200000.0;
            if (x == 0.0) {
                b += 1.0 / (t * t);
            } else {
                b += sin(x / (t * t)) / x;
            }
        }
        return min(b, 1.0) * 32768;
    }
};

function OriginalBlastF(EFFECT) {
    return new OriginalBlastFClass(EFFECT);
}
