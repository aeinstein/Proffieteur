class BlastFadeoutFClass extends FUNCTION {
    constructor(FADEOUT_MS, EFFECT_ARG) {
        super("Fadeout on blast function", Array.from(arguments));
        this.add_arg("FADEOUT_MS", "INT", "fadeout time in milliseconds", 200);
        this.add_arg("EFFECT", "EFFECT", "effect type", EFFECT(EFFECT_BLAST));
    }

    run(blade) {
        super.run(blade);
        this.T = micros();
        this.effects_ = blade.GetEffects();
    }

    getInteger(led) {
        var b = 0.0;
        for (var i = 0; i < this.effects_.length; i++) {
            if (this.effects_[i].type != this.EFFECT) continue;
            var T = (this.T - this.effects_[i].start_micros);
            var M = 1000 - T / this.FADEOUT_MS;
            if (M > 0) {
                b += M / 1000.0;
            }
        }
        return clamp(b * 32768.0, 0, 32768.0);
    }
};

function BlastFadeoutF(FADEOUT_MS, EFFECT) {
    return new BlastFadeoutFClass(FADEOUT_MS, EFFECT);
}