class TrCenterWipeSparkClass extends MACRO {
    constructor(COLOR, MILLIS, POS) {
        super("WipeIn transition", arguments);
        this.add_arg("COLOR", "COLOR", "Color");
        this.add_arg("MILLIS", "INT", "Center Wipe time in milliseconds.");
        this.add_arg("POS", "INT", "Position", 16384);
        this.SetExpansion(TrJoin(TrCenterWipeX(Int(MILLIS), Int(this.POS)), TrWaveX(COLOR, Sum(Int(MILLIS), Int(MILLIS), Int(MILLIS), Int(MILLIS)), Int(200), Sum(Int(MILLIS), Int(MILLIS)), Int(this.POS))));
    }
}

function TrCenterWipeSpark(COLOR, MILLIS, POS) {
    return new TrCenterWipeSparkClass(COLOR, MILLIS, POS);
}