class TrFadeXClass extends TRANSITION_BASE {
    constructor(MILLIS) {
        super("Fading transition", arguments);
    }

    run(blade) {
        super.run(blade);
        this.fade_ = this.update(1.0);
    }

    getColor(A, B, led) {
        return A.mix(B, this.fade_);
    }
};

function TrFadeX(MILLIS) {
    return new TrFadeXClass(MILLIS);
}