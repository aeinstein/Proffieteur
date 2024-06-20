class EffectSequenceClass extends STYLE {
    constructor(ARGS) {
        super("Sequence that changes on events.", ARGS);
        this.add_arg("EFFECT", "EFFECT", "effect that goes to next color");
        this.COLORS = Array.from(ARGS).slice(1);
        for (let i = 1; i < this.COLORS.length + 1; i++)
            this.add_arg("COLOR" + i, "COLOR", "COLOR " + i);
        this.last_micros = 0;
        this.n = this.COLORS.length - 1;
        this.effect_ = new OneshotEffectDetector(this.EFFECT);
    }

    run(blade) {
        super.run(blade);
        const now = micros();

        if (this.effect_.Detect(blade)) {
            this.n = (this.n + 1) % this.COLORS.length;
        }
    }

    getColor(led) {
        return this.COLORS[this.n].getColor(led);
    }
}

function EffectSequence(MPC, C) {
    return new EffectSequenceClass(Array.from(arguments));
}