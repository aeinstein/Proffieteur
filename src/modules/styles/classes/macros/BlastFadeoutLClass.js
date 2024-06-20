class BlastFadeoutLClass extends MACRO {
    constructor(BLAST, FADEOUT_MS, EFFECT_ARG) {
        super("BlastFadeout layers", Array.from(arguments));
        this.add_arg("BLAST", "COLOR", "blast color");
        this.add_arg("FADEOUT_MS", "INT", "fadeout time in milliseconds", 200);
        this.add_arg("EFFECT", "EFFECT", "effect type", EFFECT(EFFECT_BLAST));
        this.SetExpansion(AlphaL(BLAST, BlastFadeoutF(FADEOUT_MS, EFFECT_ARG)));
    }
};

function BlastFadeoutL(BLAST, FADEOUT_MS, EFFECT) {
    return new BlastFadeoutLClass(BLAST, FADEOUT_MS, EFFECT);
}