class TrWipeInSparkTipXClass extends MACRO {
    constructor(SPARK_COLOR, MILLIS, SIZE) {
        super("TrWipeIn with sparktip", arguments);
        this.add_arg("SPARK_COLOR", "COLOR", "Spark color");
        this.add_arg("MILLIS", "TIME_FUNCTION", "wipe milliseconds");
        this.add_arg("SIZE", "FUNCTION", "Size of spark.", Int(400));
        this.SetExpansion(TrJoin(TrWipeInX(MILLIS), TrSparkX(SPARK_COLOR, this.SIZE, MILLIS, Int(32768))));
    }
};

function TrWipeInSparkTipX(C, M, S) {
    return new TrWipeInSparkTipXClass(C, M, S);
}