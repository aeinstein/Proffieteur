class SparkleClass extends MACRO {
    constructor(BASE, SPARKLE_COLOR, SPARK_CHANCE_PROMILLE, SPARK_INTENSITY) {
        super("Sparkles!!", Array.from(arguments));
        this.add_arg("BASE", "COLOR", "Normal blade color");
        this.add_arg("SPARKLE_COLOR", "COLOR", "Spark color", Rgb(255, 255, 255));
        this.add_arg("SPARK_CHANCE_PROMILLE", "INT", "Chance of new sparks.", 300);
        this.add_arg("SPARK_INTENSITY", "INT", "Initial spark intensity", 1024);
        this.SetExpansion(Layers(BASE, SparkleL(this.SPARKLE_COLOR, this.SPARK_CHANCE_PROMILLE, this.SPARK_INTENSITY)));
    }
}

function Sparkle(BASE, SPARKLE_COLOR, SPARK_CHANCE_PROMILLE, SPARK_INTENSITY) {
    return new SparkleClass(BASE, SPARKLE_COLOR, SPARK_CHANCE_PROMILLE, SPARK_INTENSITY);
}