class BlastLClass extends MACRO {
    constructor(BLAST, FADEOUT_MS, WAVE_SIZE, WAVE_MS, EFFECT_ARG) {
        super("Blast layer", Array.from(arguments));
        this.add_arg("BLAST", "COLOR", "blast color");
        this.add_arg("FADEOUT_MS", "INT", "fadeout time in milliseconds", 200);
        this.add_arg("WAVE_SIZE", "INT", "wave size", 100);
        this.add_arg("WAVE_MS", "INT", "wave speed", 400);
        this.add_arg("EFFECT", "EFFECT", "effect type", EFFECT(EFFECT_BLAST));
        this.SetExpansion(AlphaL(BLAST, BlastF(FADEOUT_MS, WAVE_SIZE, WAVE_MS, EFFECT_ARG)));
    }

    argify(state) {
        state.color_argument = BLAST_COLOR_ARG;
        var ret = super.argify(state);
        state.color_argument = null;
        return ret;
    }
};

function BlastL(BLAST, FADEOUT_MS, WAVE_SIZE, WAVE_MS, EFFECT) {
    return new BlastLClass(BLAST, FADEOUT_MS, WAVE_SIZE, WAVE_MS, EFFECT);
}