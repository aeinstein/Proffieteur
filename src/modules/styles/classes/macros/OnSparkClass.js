class OnSparkClass extends MACRO {
    constructor(T, SPARK_COLOR, MILLIS) {
        super("Shows the spark color for 'MILLIS' milliseconds on startup.", arguments);
        this.add_arg("T", "COLOR", "Base color");
        this.add_arg("SPARK_COLOR", "COLOR", "Spark color", WHITE.DOCOPY());
        this.add_arg("MILLIS", "INT", "Millis", 200);
        this.SetExpansion(OnSparkX(T, this.SPARK_COLOR, Int(this.MILLIS)));
    }
}

function OnSpark(T, SPARK_COLOR, MILLIS) {
    return new OnSparkClass(T, SPARK_COLOR, MILLIS);
}