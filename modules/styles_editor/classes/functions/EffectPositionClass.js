class EffectPositionClass extends FUNCTION {
    constructor() {
        super("Select a new random value every time an effect occurs", arguments);
        this.add_arg("EFFECT", "EFFECT", "Effect to trigger new random.", EFFECT(EFFECT_NONE));
        this.value = 0;
    }

    run(blade) {
        super.run(blade);
        var effect;
        if (this.EFFECT + 0 == 0) {
            effect = last_detected_blade_effect;
        } else {
            var e = new OneshotEffectDetector(this.EFFECT);
            effect = e.Detect(blade);
        }
        if (effect) {
            this.value = effect.location * 32768;
        } else {
            this.value = 0;
        }
    }

    getInteger(led) {
        return this.value;
    }
};

function EffectPosition(EFFECT) {
    return new EffectPositionClass(EFFECT);
}