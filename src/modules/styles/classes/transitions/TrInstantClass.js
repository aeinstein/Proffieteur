class TrInstantClass extends TRANSITION {
    constructor() {
        super("Instant transition");
    }

    run(blade) {
    }

    begin() {
    }

    done() {
        return true;
    }

    getColor(A, B, led) {
        return B;
    }
};

function TrInstant() {
    return new TrInstantClass();
}