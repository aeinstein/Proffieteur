class BlastClass extends MACRO {
    constructor(BASE, BLAST, FADEOUT_MS, WAVE_SIZE, WAVE_MS, EFFECT_ARG) {
        super("Blast effect", Array.from(arguments));
        this.add_arg("BASE", "COLOR", "base color");
        this.add_arg("BLAST", "COLOR", "blast color");
        this.add_arg("FADEOUT_MS", "INT", "fadeout time in milliseconds", 200);
        this.add_arg("WAVE_SIZE", "INT", "wave size", 100);
        this.add_arg("WAVE_MS", "INT", "wave speed", 400);
        this.add_arg("EFFECT", "EFFECT", "effect type", EFFECT(EFFECT_BLAST));
        this.SetExpansion(Layers(BASE, BlastL(BLAST, FADEOUT_MS, WAVE_SIZE, WAVE_MS, EFFECT_ARG)));
    }
};

function Blast(BASE, BLAST, FADEOUT_MS, WAVE_SIZE, WAVE_MS, EFFECT) {
    return new BlastClass(BASE, BLAST, FADEOUT_MS, WAVE_SIZE, WAVE_MS, EFFECT);
}