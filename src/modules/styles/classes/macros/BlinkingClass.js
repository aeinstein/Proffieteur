class BlinkingClass extends MACRO {
    constructor(COLOR1, COLOR2, BLINK_MILLIS, BLINK_PROMILLE) {
        super("Blinks between A and B", Array.from(arguments));
        this.add_arg("COLOR1", "COLOR", "A");
        this.add_arg("COLOR2", "COLOR", "B");
        this.add_arg("BLINK_MILLIS", "INT", "milliseconds between blinks");
        this.add_arg("BLINK_PROMILLE", "INT", "0 = off, 1000 = on");
        this.SetExpansion(BlinkingX(COLOR1, COLOR2, Int(BLINK_MILLIS), Int(BLINK_PROMILLE)));
    }
};

function Blinking(A, B, BM, BP) {
    return new BlinkingClass(A, B, BM, BP);
}