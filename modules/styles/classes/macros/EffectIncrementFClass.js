class EffectIncrementFClass extends MACRO {
    constructor(EFFECT, MAX, I) {
        super("Increase by I every time F > V.", arguments);
        this.add_arg("EFFECT", "EFFECT", "Effect to trigger increment.");
        this.add_arg("MAX", "FUNCTION", "Max value.", Int(32768));
        this.add_arg("I", "FUNCTION", "Increment", Int(1));
        this.SetExpansion(IncrementModuloF(EffectPulseF(this.EFFECT), this.MAX, this.I));
    }
};

function EffectIncrementF(EFFECT, MAX, I) {
    return new EffectIncrementFClass(EFFECT, MAX, I);
}