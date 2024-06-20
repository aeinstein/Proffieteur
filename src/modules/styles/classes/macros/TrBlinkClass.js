class TrBlinkClass extends MACRO {
    constructor(MILLIS, N, WIDTH) {
        super("Blink N times", arguments);
        this.add_arg("MILLIS", "INT", "Transition length in milliseconds.")
        this.add_arg("N", "INT", "How many times to blink.");
        this.add_arg("WIDTH", "INT", "Blink pulse width, 16384 = 50%", 16384);
        this.SetExpansion(TrBlinkX(Int(MILLIS), N, Int(this.WIDTH)));
    }
}

function TrBlink(MILLIS, N, WIDTH) {
    return new TrBlinkClass(MILLIS, N, WIDTH);
}