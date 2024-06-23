class TrCenterWipeClass extends MACRO {
    constructor(MILLIS, POS) {
        super("WipeIn transition", arguments);
        this.add_arg("MILLIS", "INT", "Center Wipe time in milliseconds.");
        this.add_arg("POS", "INT", "Position", 16384);
        this.SetExpansion(TrCenterWipeX(Int(MILLIS), Int(this.POS)));
    }
}

function TrCenterWipe(MILLIS, POS) {
    return new TrCenterWipeClass(MILLIS, POS);
}