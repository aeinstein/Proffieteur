
class OriginalBlastLClass extends MACRO {
    constructor(BLAST, EFFECT_ARG) {
        super("Original blast effect", Array.from(arguments));
        this.add_arg("BLAST", "COLOR", "blast color");
        this.add_arg("EFFECT", "EFFECT", "effect type", EFFECT(EFFECT_BLAST));
        this.SetExpansion(AlphaL(BLAST, OriginalBlastF(this.EFFECT)));
    }
};

function OriginalBlastL(BLAST, EFFECT) {
    return new OriginalBlastLClass(BLAST, EFFECT);
}