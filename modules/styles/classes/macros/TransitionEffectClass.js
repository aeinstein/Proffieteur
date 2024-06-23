class TransitionEffectClass extends MACRO {
    constructor(T, EFFECT_COLOR, TRANSITION1, TRANSITION2, EFFECT_ARG) {
        super("Trigger transitions on an effect.", arguments);
        this.add_arg("T", "COLOR", "Base color.");
        this.add_arg("EFFECT_COLOR", "COLOR", "Effect color.");
        this.add_arg("TRANSITION1", "TRANSITION", "from T to EFFECT_COLOR");
        this.add_arg("TRANSITION2", "TRANSITION", "from EFFECT_COLOR T");
        this.add_arg("EFFECT", "EFFECT", "Effect type");
        this.SetExpansion(Layers(this.T, TransitionEffectL(TrConcat(this.TRANSITION1, this.EFFECT_COLOR, this.TRANSITION2), this.EFFECT)));
    }
};

function TransitionEffect(T, EC, T1, T2, E) {
    return new TransitionEffectClass(T, EC, T1, T2, E);
}