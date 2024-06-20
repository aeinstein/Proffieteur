class SimpleClashClass extends MACRO {
    constructor(T, CLASH, CLASH_MILLIS, EFFECT_ARG, STAB_SHAPE) {
        super("Implements the clash effect", Array.from(arguments));
        this.add_arg("T", "COLOR", "base color");
        this.add_arg("CLASH", "COLOR", "Clash color");
        this.add_arg("CLASH_MILLIS", "INT", "How many MS to show the clash color for.", 40);
        this.add_arg("EFFECT", "EFFECT", "effect type", EFFECT(EFFECT_CLASH));
        this.add_arg("STAB_SHAPE", "FUNCTION", "Stab shape", SmoothStep(Int(16384), Int(24000)));
        this.SetExpansion(Layers(T, SimpleClashL(CLASH, this.CLASH_MILLIS, this.EFFECT, this.STAB_SHAPE)));
    }
};

function SimpleClash(T, CLASH, MILLIS, EF, SS) {
    return new SimpleClashClass(T, CLASH, MILLIS, EF, SS);
}