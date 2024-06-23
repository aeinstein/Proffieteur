class StyleStrobePtrClass extends MACRO {
    constructor(STROBE_COLOR, CLASH_COLOR, FREQUENCY, OUT_MS, IN_MS) {
        super("Rainbow style template", arguments);
        this.add_arg("STROBE_COLOR", "COLOR", "Strobe color");
        this.add_arg("CLASH_COLOR", "COLOR", "Clash color");
        this.add_arg("FREQUENCY", "INT", "frequency");
        this.add_arg("OUT_MS", "INT", "extension length in milliseconds");
        this.add_arg("IN_MS", "INT", "retraction length in milliseconds");

        const strobe = Strobe(BLACK.DOCOPY(), this.STROBE_COLOR, this.FREQUENCY, 1);
        const fast_strobe = Strobe(BLACK.DOCOPY(), this.STROBE_COLOR.DOCOPY(), this.FREQUENCY * 3, 1);
        let tmp = Lockup(strobe, fast_strobe);
        tmp = SimpleClash(tmp, this.CLASH_COLOR);
        this.SetExpansion(InOutHelper(tmp, this.OUT_MS, this.IN_MS));
    }
}

function StyleStrobePtr(strobe_color, clash_color, frequency, out_ms, in_ms) {
    return new StyleStrobePtrClass(strobe_color, clash_color, frequency, out_ms, in_ms);
}