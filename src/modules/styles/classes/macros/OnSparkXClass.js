class OnSparkXClass extends MACRO {
    constructor(T, SPARK_COLOR, MILLIS) {
        super("Shows the spark color for 'MILLIS' milliseconds on startup.", arguments);
        this.add_arg("T", "COLOR", "Base color");
        this.add_arg("SPARK_COLOR", "COLOR", "Spark color", WHITE.DOCOPY());
        this.add_arg("MILLIS", "FUNCTION", "Millis", Int(200));
        this.SetExpansion(Layers(T, OnSparkL(this.SPARK_COLOR, this.MILLIS)));
    }
}

function OnSparkX(T, SPARK_COLOR, MILLIS) {
    return new OnSparkXClass(T, SPARK_COLOR, MILLIS);
}