class StyleRainbowPtrClass extends MACRO {
    constructor(OUT_MS, IN_MS, CLASH_COLOR, LOCKUP_FLICKER_COLOR) {
        super("Rainbow style template", arguments);
        this.add_arg("OUT_MS", "INT", "extension length in milliseconds");
        this.add_arg("IN_MS", "INT", "retraction length in milliseconds");
        this.add_arg("CLASH_COLOR", "COLOR", "Clash color", WHITE.DOCOPY());
        this.add_arg("LOCKUP_FLICKER_COLOR", "COLOR", "lockup flicker color", WHITE.DOCOPY());

        var tmp = AudioFlicker(Rainbow(), this.LOCKUP_FLICKER_COLOR);
        tmp = Lockup(Rainbow(), tmp);
        tmp = SimpleClash(tmp, this.CLASH_COLOR);
        this.SetExpansion(InOutHelper(tmp, this.OUT_MS, this.IN_MS));
    }
};

function StyleRainbowPtr(out_ms, in_ms, clash_color, lockup_flicker_color) {
    return new StyleRainbowPtrClass(out_ms, in_ms, clash_color, lockup_flicker_color);
}
