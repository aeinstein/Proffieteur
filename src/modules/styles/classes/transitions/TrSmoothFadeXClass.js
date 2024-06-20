class TrSmoothFadeXClass extends TRANSITION_BASE {
    constructor(MILLIS) {
        super("Smooth fading transition", arguments);
    }

    run(blade) {
        super.run(blade);
        this.fade_ = this.update(1.0);
        this.fade_ = this.fade_ * this.fade_ * (3 - 2 * this.fade_);
    }

    getColor(A, B, led) {
        return A.mix(B, this.fade_);
    }
};

function TrSmoothFadeX(MILLIS) {
    return new TrSmoothFadeXClass(MILLIS);
}