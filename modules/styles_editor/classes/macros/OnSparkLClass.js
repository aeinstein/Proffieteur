class OnSparkLClass extends MACRO {
    constructor(SPARK_COLOR, MILLIS) {
        super("Shows the spark color for 'MILLIS' milliseconds on startup.", arguments);
        this.add_arg("SPARK_COLOR", "COLOR", "Spark color", WHITE.DOCOPY());
        this.add_arg("MILLIS", "FUNCTION", "Millis", Int(200));
        this.SetExpansion(AlphaL(this.SPARK_COLOR, OnSparkF(this.MILLIS)));
    }
}

function OnSparkL(SPARK_COLOR, MILLIS) {
    return new OnSparkLClass(SPARK_COLOR, MILLIS);
}