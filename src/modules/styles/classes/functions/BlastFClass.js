class BlastFClass extends FUNCTION {
    constructor(FADEOUT_MS, WAVE_SIZE, WAVE_MS, EFFECT_ARG) {
        super("Blast effect function", Array.from(arguments));
        this.add_arg("FADEOUT_MS", "INT", "fadeout time in milliseconds", 200);
        this.add_arg("WAVE_SIZE", "INT", "wave size", 100);
        this.add_arg("WAVE_MS", "INT", "wave speed", 400);
        this.add_arg("EFFECT", "EFFECT", "effect type", EFFECT(EFFECT_BLAST));
    }

    run(blade) {
        this.T = micros();
        this.num_leds_ = 1.0 * blade.num_leds();
        this.effects_ = blade.GetEffects();
    }

    getInteger(led) {
        var b = 0.0;
        for (var i = 0; i < this.effects_.length; i++) {
            if (this.effects_[i].type != this.EFFECT) continue;
            var T = (this.T - this.effects_[i].start_micros);
            var M = 1000 - T / this.FADEOUT_MS;
            if (M > 0) {
                var dist = Math.abs(this.effects_[i].location - led / this.num_leds_);
                var N = Math.floor(Math.abs(dist - T / (this.WAVE_MS * 1000.0)) * this.WAVE_SIZE);
                if (N < 32) {
                    b += blast_hump[N] * M / 1000.0 / 255.0;
                }
            }
        }
        return clamp(b * 32768, 0, 32768);
    }
};

function BlastF(FADEOUT_MS, WAVE_SIZE, WAVE_MS, EFFECT) {
    return new BlastFClass(FADEOUT_MS, WAVE_SIZE, WAVE_MS, EFFECT);
}