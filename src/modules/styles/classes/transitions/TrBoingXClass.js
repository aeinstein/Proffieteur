class TrBoingXClass extends TRANSITION_BASE {
    constructor(MILLIS, N) {
        super("Boing transition", arguments);
        this.add_arg("N", "INT", "Number of back-and-forth");
    }

    run(blade) {
        this.N.run(blade);
        super.run(blade);
        this.fade_ = this.update(2 * this.N.getInteger(0) + 1) % 2.0;
        if (this.fade_ > 1.0) {
            this.fade_ = 2.0 - this.fade_;
        }
    }

    getColor(A, B, led) {
        return A.mix(B, this.fade_);
    }
}

function TrBoingX(MILLIS, N) {
    return new TrBoingXClass(MILLIS, N);
}