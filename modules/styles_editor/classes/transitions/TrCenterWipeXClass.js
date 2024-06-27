class TrCenterWipeXClass extends TRANSITION_BASE {
    constructor(MILLIS, POS) {
        super("Center Wipe transition", arguments);
        this.add_arg("POS", "TIME_FUNCTION", "Position", Int(16384));
    }

    run(blade) {
        super.run(blade);
        var center = (this.POS.getInteger(0) * blade.num_leds()) / 32768.0;
        var fade_top = this.update(blade.num_leds() - center);
        var fade_bottom = this.update(center);
        var top = clamp(center + fade_top, center, blade.num_leds());
        var bottom = clamp(center - fade_bottom, 0, center);
        this.range = new Range(bottom, top);
    }

    getColor(A, B, led) {
        const mix = this.range.Intersect(new Range(led, (led + 1))).Size();
        return A.mix(B, mix);
    }
}

function TrCenterWipeX(MILLIS, POS) {
    return new TrCenterWipeXClass(MILLIS, POS);
}