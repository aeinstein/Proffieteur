class StripesXClass extends STYLE {
    constructor(ARGS) {
        super("Configurable rainbow", ARGS);
        this.add_arg("WIDTH", "FUNCTION", "Stripe width");
        this.add_arg("SPEED", "FUNCTION", "Scroll speed");
        this.COLORS = ARGS.slice(2);
        for (let i = 1; i < this.COLORS.length + 1; i++)
            this.add_arg("COLOR" + i, "COLOR", "COLOR " + i);
        this.last_micros = 0;
        this.m = 0;
    }

    run(blade) {
        super.run(blade);
        const now_micros = micros();
        const delta_micros = now_micros - this.last_micros;
        this.last_micros = now_micros;
        this.m = MOD((this.m + delta_micros * this.SPEED.getInteger(0) / 333), (this.COLORS.length * 341 * 1024))
        this.mult = (50000 * 1024 / this.WIDTH.getInteger(0));
    }

    GET_COLOR(N, led, p, ret) {
        if (N >= this.COLORS.length || p < 0) return;
        if (p > 0 && p < 512) {
            var tmp = this.COLORS[N].getColor(led);
            var mul = sin(p * Math.PI / 512.0);
            ret.r += tmp.r * mul;
            ret.g += tmp.g * mul;
            ret.b += tmp.b * mul;
        }
        this.GET_COLOR(N + 1, led, p - 341, ret);
    }

    getColor(led) {
        const p = ((this.m + led * this.mult) >> 10) % (this.COLORS.length * 341);
        const ret = Rgb(0, 0, 0);
        this.GET_COLOR(0, led, p, ret);
        this.GET_COLOR(0, led, p + 341 * this.COLORS.length, ret);
        return ret;
    }
}

function StripesX(W, S, C) {
    return new StripesXClass(Array.from(arguments));
}