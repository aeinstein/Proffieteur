class TrCenterWipeSparkXClass extends MACRO {
    constructor(COLOR, MILLIS, POS) {
        super("WipeIn transition", arguments);
        this.add_arg("COLOR", "COLOR", "Color");
        this.add_arg("MILLIS", "FUNCTION", "Center Wipe time in milliseconds.");
        this.add_arg("POS", "INT", "Position", Int(16384));
        this.SetExpansion(TrJoin(TrCenterWipeX(MILLIS, this.POS), TrWaveX(COLOR, Sum(MILLIS, MILLIS, MILLIS, MILLIS), Int(200), Sum(MILLIS, MILLIS), this.POS)));
    }
}

function TrCenterWipeSparkX(COLOR, MILLIS, POS) {
    return new TrCenterWipeSparkXClass(COLOR, MILLIS, POS);
}