class TrCenterWipeInSparkClass extends MACRO {
    constructor(COLOR, MILLIS, POS) {
        super("WipeIn transition", arguments);
        this.add_arg("COLOR", "COLOR", "Color");
        this.add_arg("MILLIS", "INT", "Center Wipe time in milliseconds.");
        this.add_arg("POS", "INT", "Position", 16384);
        this.SetExpansion(TrJoin(TrCenterWipeInX(Int(MILLIS), Int(this.POS)), TrJoin(TrWaveX(COLOR, Int(MILLIS), Int(200), Sum(Int(MILLIS), Int(MILLIS)), Int(0)), TrWaveX(COLOR, Int(MILLIS), Int(200), Sum(Int(MILLIS), Int(MILLIS)), Int(32768)))));
    }
}

function TrCenterWipeInSpark(COLOR, MILLIS, POS) {
    return new TrCenterWipeInSparkClass(COLOR, MILLIS, POS);
}