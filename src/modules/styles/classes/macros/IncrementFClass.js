class IncrementFClass extends MACRO {
    constructor(F, V, MAX, I, HYST_PERCENT) {
        super("Increase by I every time F > V.", arguments);
        this.add_arg("F", "FUNCTION", "Input");
        this.add_arg("V", "FUNCTION", "Compare value.", Int(32768));
        this.add_arg("MAX", "FUNCTION", "Max value.", Int(32768));
        this.add_arg("I", "FUNCTION", "Increment", Int(1));
        this.add_arg("HYST_PERCENT", "FUNCTION", "Hysteresis percent", Int(66));
        this.SetExpansion(IncrementModuloF(ThresholdPulseF(this.F, this.V, this.HYST_PERCENT), this.MAX, this.I));
    }
};

function IncrementF(F, V, MAX, I, HYST_PERCENT) {
    return new IncrementFClass(F, V, MAX, I, HYST_PERCENT);
}