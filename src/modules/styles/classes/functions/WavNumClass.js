class WavNumClass extends FUNCTION {
    constructor() {
        super("Returns milliseconds since effect occured", arguments);
        this.add_arg("EFFECT", "EFFECT", "Effect to get time since.", EFFECT(EFFECT_NONE));
        this.value = 0;
    }

    run(blade) {
        super.run(blade);
        var effect;
        if (this.EFFECT == 0) {
            effect = last_detected_blade_effect;
        } else {
            var e = new OneshotEffectDetector(this.EFFECT);
            effect = e.Detect(blade);
        }
        if (effect) {
            this.value = effect.wavnum;
        }
    }

    getInteger(led) {
        return this.value;
    }
};

function WavNum(EFFECT) {
    return new WavNumClass(EFFECT);
}