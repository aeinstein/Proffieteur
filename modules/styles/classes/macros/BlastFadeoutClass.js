class BlastFadeoutClass extends MACRO {
    constructor(BASE, BLAST, FADEOUT_MS, EFFECT_ARG) {
        super("BlastFadeout effect", Array.from(arguments));
        this.add_arg("BASE", "COLOR", "base color");
        this.add_arg("BLAST", "COLOR", "blast color");
        this.add_arg("FADEOUT_MS", "INT", "fadeout time in milliseconds", 200);
        this.add_arg("EFFECT", "EFFECT", "effect type", EFFECT(EFFECT_BLAST));
        this.SetExpansion(Layers(BASE, BlastFadeoutL(BLAST, FADEOUT_MS, EFFECT_ARG)));
    }
};

function BlastFadeout(BASE, BLAST, FADEOUT_MS, EFFECT) {
    return new BlastFadeoutClass(BASE, BLAST, FADEOUT_MS, EFFECT);
}