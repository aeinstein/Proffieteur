class BlinkingXClass extends MACRO {
    constructor(COLOR1, COLOR2, BLINK_MILLIS, BLINK_PROMILLE) {
        super("Blinks between A and B", Array.from(arguments));
        this.add_arg("COLOR1", "COLOR", "A");
        this.add_arg("COLOR2", "COLOR", "B");
        this.add_arg("BLINK_MILLIS", "FUNCTION", "milliseconds between blinks");
        this.add_arg("BLINK_PROMILLE", "FUNCTION", "0 = off, 1000 = on");
        this.SetExpansion(Layers(COLOR1, BlinkingL(COLOR2, BLINK_MILLIS, BLINK_PROMILLE)));
    }
};

function BlinkingX(A, B, BM, BP) {
    return new BlinkingXClass(A, B, BM, BP);
}