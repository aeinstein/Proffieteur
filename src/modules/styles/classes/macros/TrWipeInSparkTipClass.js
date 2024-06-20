class TrWipeInSparkTipClass extends MACRO {
    constructor(SPARK_COLOR, MILLIS, SIZE) {
        super("TrWipeIn with sparktip", arguments);
        this.add_arg("SPARK_COLOR", "COLOR", "Spark color");
        this.add_arg("MILLIS", "INT", "wipe milliseconds");
        this.add_arg("SIZE", "INT", "Size of spark.", 400);
        this.SetExpansion(TrJoin(TrWipeIn(MILLIS), TrSparkX(SPARK_COLOR, Int(this.SIZE), Int(MILLIS), Int(32768))));
    }
};

function TrWipeInSparkTip(C, M, S) {
    return new TrWipeInSparkTipClass(C, M, S);
}