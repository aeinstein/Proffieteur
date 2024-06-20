class TrCenterWipeInSparkXClass extends MACRO {
    constructor(COLOR, MILLIS, POS) {
        super("WipeIn transition", arguments);
        this.add_arg("COLOR", "COLOR", "Color");
        this.add_arg("MILLIS", "TIME_FUNCTION", "Center Wipe time in milliseconds.");
        this.add_arg("POS", "INT", "Position", Int(16384));
        this.SetExpansion(TrJoin(TrCenterWipeInX(MILLIS, this.POS), TrJoin(TrWaveX(COLOR, MILLIS.DOCOPY(), Int(200), Sum(MILLIS, MILLIS), Int(0)), TrWaveX(COLOR, MILLIS, Int(200), Sum(MILLIS, MILLIS), Int(32768)))));

    }
}

function TrCenterWipeInSparkX(COLOR, MILLIS, POS) {
    return new TrCenterWipeInSparkXClass(COLOR, MILLIS, POS);
}