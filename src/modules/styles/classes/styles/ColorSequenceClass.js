class ColorSequenceClass extends STYLE {
    constructor(ARGS) {
        super("Pre-defined sequence", ARGS);
        this.add_arg("MILLIS_PER_COLOR", "INT", "Milliseconds before moving to next color.");
        this.COLORS = Array.from(ARGS).slice(1);
        for (let i = 1; i < this.COLORS.length + 1; i++)
            this.add_arg("COLOR" + i, "COLOR", "COLOR " + i);
        this.last_micros = 0;
        this.n = 0;
    }

    run(blade) {
        super.run(blade);
        const now = micros();
        const millis_per_color = this.MILLIS_PER_COLOR.getInteger(0);
        if (now - this.last_micros > millis_per_color * 1000) {
            if (now - this.last_micros > millis_per_color * 10000) {
                this.n = 0;
                this.last_micros = now;
            } else {
                this.n = (this.n + 1) % this.COLORS.length;
                this.last_micros += millis_per_color * 1000;
            }
        }
    }

    getColor(led) {
        return this.COLORS[this.n].getColor(led);
    }
}

function ColorSequence(MPC, C) {
    return new ColorSequenceClass(Array.from(arguments));
}