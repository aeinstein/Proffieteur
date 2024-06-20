class TrWipeXClass extends TRANSITION_BASE {
    constructor(MILLIS) {
        super("Wipe transition", arguments);
    }

    run(blade) {
        super.run(blade);
        this.num_leds_ = blade.num_leds();
        this.fade_ = this.update(this.num_leds_);
    }

    getColor(A, B, led) {
        var mix = (new Range(0, this.fade_).Intersect(new Range(led, (led + 1)))).Size();
        return A.mix(B, mix);
    }
}

function TrWipeX(MILLIS) {
    return new TrWipeXClass(MILLIS);
}