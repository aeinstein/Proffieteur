class TrCenterWipeInClass extends MACRO {
    constructor(MILLIS, POS) {
        super("WipeIn transition", arguments);
        this.add_arg("MILLIS", "INT", "Center Wipe time in milliseconds.");
        this.add_arg("POS", "INT", "Position", 16384);
        this.SetExpansion(TrCenterWipeInX(Int(MILLIS), Int(this.POS)));
    }
}

function TrCenterWipeIn(MILLIS, POS) {
    return new TrCenterWipeInClass(MILLIS, POS);
}