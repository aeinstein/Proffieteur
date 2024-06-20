class MultiTransitionEffectClass extends MACRO {
    constructor(T, EFFECT_COLOR, TRANSITION1, TRANSITION2, EFFECT, N) {
        super("Trigger transitions on an effect.", arguments);
        this.add_arg("T", "COLOR", "Base color.");
        this.add_arg("EFFECT_COLOR", "COLOR", "Effect color.");
        this.add_arg("TRANSITION1", "TRANSITION", "from T to EFFECT_COLOR");
        this.add_arg("TRANSITION2", "TRANSITION", "from EFFECT_COLOR T");
        this.add_arg("EFFECT", "EFFECT", "Effect type");
        this.add_arg("N", "INT", "Number of simultaneous effects.", 3);
        this.SetExpansion(Layers(this.T, MultiTransitionEffectL(TrConcat(this.TRANSITION1, this.EFFECT_COLOR, this.TRANSITION2), this.EFFECT, this.N)));
    }
};

function MultiTransitionEffect(T, EC, T1, T2, E, N) {
    return new MultiTransitionEffectClass(T, EC, T1, T2, E, N);
}
