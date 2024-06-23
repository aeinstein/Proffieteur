class MixClass extends STYLE {
    constructor(ARGS) {
        super("Mix between colors", ARGS);
        this.COLORS = Array.from(ARGS).slice(1);
        this.add_arg("F", "FUNCTION", "0=first color, 32768=last color");
        for (let i = 1; i < this.COLORS.length + 1; i++)
            this.add_arg("COLOR" + i, "COLOR", "COLOR " + i);
    }

    run(blade) {
        this.F.run(blade);
        for (let i = 0; i < this.COLORS.length; i++)
            this.COLORS[i].run(blade);
    }

    getColor(led) {
        const v = this.F.getInteger(led);
        const pos = max(0, min(32768, v)) * (this.COLORS.length - 1) / 32768;
        const N = min(this.COLORS.length - 2, Math.floor(pos));
        return this.COLORS[N].getColor(led).mix(this.COLORS[N + 1].getColor(led), pos - N);
    }
}

function Mix(F, C1, C2) {
    return new MixClass(Array.from(arguments));
}