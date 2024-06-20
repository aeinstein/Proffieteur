class OneshotEffectDetector {
    constructor(type) {
        this.last_detected_ = 0;
        if (type.getInteger) {
            type = type.getInteger(0);
        }
        this.type_ = type;
        HandleEffectType(type);
    }

    Detect(blade) {
        var mask = {};
        mask[this.type_] = 1;
        if (this.type_ == EFFECT_CLASH && !(current_style.__handled_types[EFFECT_STAB])) {
            mask[EFFECT_STAB] = 1;
        }

        var effects = blade.GetEffects();
        for (var i = effects.length - 1; i >= 0; i--) {
            if (mask[effects[i].type]) {
                if (effects[i].start_micros == this.last_detected_)
                    return 0;
                this.last_detected_ = effects[i].start_micros;
                last_detected_blade_effect = effects[i];
                return effects[i];
            }
        }
        return 0;
    }

    getDetected(blade) {
        var mask = {};
        mask[this.type_] = 1;
        var effects = blade.GetEffects();
        for (var i = effects.length - 1; i >= 0; i--)
            if (mask[effects[i].type])
                if (effects[i].start_micros == this.last_detected_)
                    return effects[i];
        return 0;
    }
};
