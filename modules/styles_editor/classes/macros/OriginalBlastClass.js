class OriginalBlastClass extends MACRO {
    constructor(BASE, BLAST, EFFECT_ARG) {
        super("Original blast effect", Array.from(arguments));
        this.add_arg("BASE", "COLOR", "base color");
        this.add_arg("BLAST", "COLOR", "blast color");
        this.add_arg("EFFECT", "EFFECT", "effect type", EFFECT(EFFECT_BLAST));
        this.SetExpansion(Layers(BASE, OriginalBlastL(BLAST, this.EFFECT)));
    }
};

function OriginalBlast(BASE, BLAST, EFFECT) {
    return new OriginalBlastClass(BASE, BLAST, EFFECT);
}