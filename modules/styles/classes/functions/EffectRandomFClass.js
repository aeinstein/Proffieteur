class EffectRandomFClass extends FUNCTION {
    constructor() {
        super("Select a new random value every time an effect occurs", arguments);
        this.add_arg("EFFECT", "EFFECT", "Effect to trigger new random.");
        this.effect = new OneshotEffectDetector(this.EFFECT);
        this.value = random(32768);
    }

    run(blade) {
        super.run(blade);
        if (this.effect.Detect(blade)) {
            this.value = random(32768);
        }
    }

    getInteger(led) {
        return this.value;
    }
};

function EffectRandomF(EFFECT) {
    return new EffectRandomFClass(EFFECT);
}