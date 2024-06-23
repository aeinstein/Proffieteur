class TrCenterWipeInXClass extends TRANSITION_BASE {
    constructor(MILLIS, POS) {
        super("Center Wipe-in transition", arguments);
        this.add_arg("POS", "FUNCTION", "Position", Int(16384));
    }

    run(blade) {
        super.run(blade);
        var center = (this.POS.getInteger(0) * blade.num_leds()) / 32768.0;
        var fade_top = this.update(blade.num_leds() - center);
        var fade_bottom = this.update(center);
        var top = clamp(blade.num_leds() - fade_top, center, blade.num_leds());
        var bottom = clamp(fade_bottom, 0, center);
        this.range = new Range(bottom, top);
    }

    getColor(A, B, led) {
        var mix = this.range.Intersect(new Range(led, (led + 1))).Size();
        return B.mix(A, mix);
    }
}

function TrCenterWipeInX(MILLIS, POS) {
    return new TrCenterWipeInXClass(MILLIS, POS);
}