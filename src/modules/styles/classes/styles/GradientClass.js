class GradientClass extends STYLE {
    constructor(COLORS) {
        super("COLOR2 at base, COLOR2 at tip, smooth gradient in between.", COLORS);
        this.COLORS = COLORS;
        for (let i = 0; i < this.COLORS.length; i++)
            this.add_arg("COLOR" + (i + 1), "COLOR", "COLOR " + (i + 1));
    }

    run(blade) {
        for (let i = 0; i < this.COLORS.length; i++)
            this.COLORS[i].run(blade);
        this.num_leds_ = 1.0 * blade.num_leds();
    }

    getColor(led) {
        const pos = led / this.num_leds_ * (this.COLORS.length - 1);
        const N = min(this.COLORS.length - 2, Math.floor(pos));
        return this.COLORS[N].getColor(led).mix(this.COLORS[N + 1].getColor(led), pos - N);
    }
}

function Gradient(A, B, C, D) {
    return new GradientClass(Array.from(arguments));
}