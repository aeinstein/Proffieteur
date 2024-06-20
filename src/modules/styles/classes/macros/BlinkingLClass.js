class BlinkingLClass extends MACRO {
    constructor(COLOR, BLINK_MILLIS, BLINK_PROMILLE) {
        super("Blinks transparent/opaque COLOR", Array.from(arguments));
        this.add_arg("COLOR", "COLOR", "COLOR");
        this.add_arg("BLINK_MILLIS", "FUNCTION", "milliseconds between blinks");
        this.add_arg("BLINK_PROMILLE", "FUNCTION", "0 = off, 1000 = on");
        this.SetExpansion(AlphaL(COLOR, BlinkingF(BLINK_MILLIS, BLINK_PROMILLE)));
    }
};

function BlinkingL(A, B, BM, BP) {
    return new BlinkingLClass(A, B, BM, BP);
}