class TrBlinkXClass extends TRANSITION_BASE {
    constructor(MILLIS, N, WIDTH) {
        super("Blink N times", arguments);
        this.add_arg("N", "INT", "How many times to blink.");
        this.add_arg("WIDTH", "FUNCTION", "Blink pulse width, 16384 = 50%", Int(16384));
        this.blink = false
    }

    run(blade) {
        super.run(blade);
        this.blink = (this.update(32768 * this.N) & 0x7fff) < this.WIDTH.getInteger(0);
    }

    getColor(a, b, led) {
        if (this.blink) return a;
        return b;
    }
}

function TrBlinkX(MILLIS, N, WIDTH) {
    return new TrBlinkXClass(MILLIS, N, WIDTH);
}