class SparkleFClass extends FUNCTION {
    constructor(SPARK_CHANCE_PROMILLE, SPARK_INTENSITY) {
        super("Sparkles!!", Array.from(arguments));
        this.add_arg("SPARK_CHANCE_PROMILLE", "INT", "Chance of new sparks.", 300);
        this.add_arg("SPARK_INTENSITY", "INT", "Initial spark intensity", 1024);
        this.sparks = new Uint16Array(144 + 4);
        this.last_update = 0;
    }

    run(blade) {
        super.run(blade);
        const m = millis();

        if (m - this.last_update >= 10) {
            this.last_update = m;
            let fifo = 0;
            const N = blade.num_leds();

            for (let i = 2; i <= N + 2; i++) {
                const x = ((this.sparks[i - 1] + this.sparks[i + 1]) * 200 + this.sparks[i] * 570) / 1024;
                this.sparks[i - 1] = fifo;
                fifo = x;
            }
            this.sparks[N] = fifo;
            if (random(1000) < this.SPARK_CHANCE_PROMILLE) {
                this.sparks[random(blade.num_leds()) + 2] += this.SPARK_INTENSITY;
            }
        }
    }

    getInteger(led) {
        return clamp(this.sparks[led + 2], 0, 255) << 7;
    }
}

function SparkleF(SPARK_CHANCE_PROMILLE, SPARK_INTENSITY) {
    return new SparkleFClass(SPARK_CHANCE_PROMILLE, SPARK_INTENSITY);
}