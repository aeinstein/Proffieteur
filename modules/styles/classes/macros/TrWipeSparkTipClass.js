class TrWipeSparkTipClass extends MACRO {
    constructor(SPARK_COLOR, MILLIS, SIZE) {
        super("TrWipe with sparktip", arguments);
        this.add_arg("SPARK_COLOR", "COLOR", "Spark color");
        this.add_arg("MILLIS", "INT", "wipe milliseconds");
        this.add_arg("SIZE", "INT", "Size of spark.", 400);
        this.SetExpansion(TrJoin(TrWipe(MILLIS), TrSparkX(SPARK_COLOR, Int(this.SIZE), Int(MILLIS), Int(0))));
    }
};

function TrWipeSparkTip(C, M, S) {
    return new TrWipeSparkTipClass(C, M, S);
}