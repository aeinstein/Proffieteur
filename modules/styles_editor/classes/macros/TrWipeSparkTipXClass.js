class TrWipeSparkTipXClass extends MACRO {
    constructor(SPARK_COLOR, MILLIS, SIZE) {
        super("TrWipe with sparktip", arguments);
        this.add_arg("SPARK_COLOR", "COLOR", "Spark color");
        this.add_arg("MILLIS", "TIME_FUNCTION", "wipe milliseconds");
        this.add_arg("SIZE", "FUNCTION", "Size of spark.", Int(400));
        this.SetExpansion(TrJoin(TrWipeX(MILLIS), TrSparkX(SPARK_COLOR, this.SIZE, MILLIS, Int(0))));
    }
};

function TrWipeSparkTipX(C, M, S) {
    return new TrWipeSparkTipXClass(C, M, S);
}