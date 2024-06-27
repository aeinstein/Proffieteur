class TrDelayXClass extends TRANSITION_BASE {
    constructor(MILLIS) {
        super("Delay transition", arguments);
    }

    run(blade) {
        super.run(blade);
        this.update(1.0);
    }

    getColor(A, B, led) {
        if (this.done()) return B;
        return A;
    }
}

function TrDelayX(MILLIS) {
    return new TrDelayXClass(MILLIS);
}