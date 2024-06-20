class TrSparkXClass extends TRANSITION {
    constructor(COLOR, SPARK_SIZE, SPARK_MS, SPARK_CENTER) {
        super("Spark wave transition", arguments);
        this.add_arg("COLOR", "COLOR", "Color.");
        this.add_arg("SPARK_SIZE", "FUNCTION", "Spark size.", Int(100));
        this.add_arg("SPARK_MS", "TIME_FUNCTION", "Spark MS", Int(100));
        this.add_arg("SPARK_CENTER", "FUNCTION", "Spark center.", Int(16384));
        this.millis = new TRANSITION_BASE("millis", [this.SPARK_MS]);
    }

    begin() {
        this.millis.begin();
    }

    run(blade) {
        super.run(blade);
        if (this.millis.restart()) {
            this.center = this.SPARK_CENTER.getInteger(0);
            this.size = this.SPARK_SIZE.getInteger(0);
        }
        this.millis.run(blade);
        this.num_leds = blade.num_leds();
        this.offset = this.millis.update(32768);
    }

    done() {
        return this.millis.done();
    }

    getColor(A, B, led) {
        var dist = Math.abs(this.center - led * 32768 / this.num_leds);
        var N = Math.abs(dist - this.offset) * this.size >> 15;
        var mix;
        if (N <= 32) {
            mix = blast_hump[N] << 7;
        } else {
            mix = 0;
        }
        return A.mix(this.COLOR.getColor(led), mix / 32768.0);
    }
};

function TrSparkX(COLOR, SPARK_SIZE, SPARK_MS, SPARK_CENTER) {
    return new TrSparkXClass(COLOR, SPARK_SIZE, SPARK_MS, SPARK_CENTER);
}