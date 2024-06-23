class StyleNormalPtrClass extends MACRO {
    constructor(base_color, clash_color, out_ms, in_ms, lockup_flicker_color, blast_color) {
        super("Blade to color.", arguments);
        this.add_arg("BASE_COLOR", "COLOR", "Main color");
        this.add_arg("CLASH_COLOR", "COLOR", "Clash color");
        this.add_arg("OUT_MS", "INT", "extension length in milliseconds");
        this.add_arg("IN_MS", "INT", "retraction length in milliseconds");
        this.add_arg("LOCKUP_FLICKER_COLOR", "COLOR", "lockup flicker color", WHITE.DOCOPY());
        this.add_arg("BLAST_COLOR", "COLOR", "Blast color", WHITE.DOCOPY());

        var tmp = AudioFlicker(this.BASE_COLOR, this.LOCKUP_FLICKER_COLOR);
        var tmp2 = Blast(this.BASE_COLOR.DOCOPY(), this.BLAST_COLOR);
        tmp = Lockup(tmp2, tmp);
        tmp = SimpleClash(tmp, this.CLASH_COLOR);
        this.SetExpansion(InOutHelper(tmp, this.OUT_MS, this.IN_MS));
    }
}

function StyleNormalPtr(base_color, clash_color, out_ms, in_ms, lockup_flicker_color, blast_color) {
    return new StyleNormalPtrClass(base_color, clash_color, out_ms, in_ms, lockup_flicker_color, blast_color);
}