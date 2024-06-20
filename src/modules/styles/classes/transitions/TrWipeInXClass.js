class TrWipeInXClass extends TRANSITION_BASE {
    constructor(MILLIS) {
        super("WipeIn transition", arguments);
    }

    run(blade) {
        super.run(blade);
        this.num_leds_ = blade.num_leds();
        this.fade_ = new Range(this.num_leds_ -
            this.update(this.num_leds_),
            this.num_leds_);
    }

    getColor(A, B, led) {
        var mix = this.fade_.Intersect(new Range(led, (led + 1))).Size();
        return A.mix(B, mix);
    }
}

function TrWipeInX(MILLIS) {
    return new TrWipeInXClass(MILLIS);
}