
class EffectPulseFClass extends FUNCTION {
    constructor() {
        super("Generate a pulse every time an effect occurs", arguments);
        this.add_arg("EFFECT", "EFFECT", "Effect to trigger new random.");
        this.effect = new OneshotEffectDetector(this.EFFECT);
        this.value = 0;
    }

    run(blade) {
        super.run(blade);
        if (this.effect.Detect(blade)) {
            this.value = 32768;
        } else {
            this.value = 0;
        }
    }

    getInteger(led) {
        return this.value;
    }
}

function EffectPulseF(EFFECT) {
    return new EffectPulseFClass(EFFECT);
}