class MultiTransitionEffectLClass extends STYLE {
    constructor(TRANSITION, EFFECT_ARG, N) {
        super("Trigger transitions on an effect.", arguments);
        this.add_arg("TRANSITION", "TRANSITION", "from EFFECT_COLOR T");
        this.add_arg("EFFECT", "EFFECT", "Effect type");
        this.add_arg("N", "INT", "Simultaneous effects.", 3);
        this.effect_ = new OneshotEffectDetector(this.EFFECT);
        this.TRANSITIONS = [];
        this.running = [];
        this.E = [];
        this.pos = 0;
        for (var i = 0; i < this.N; i++) {
            this.TRANSITIONS.push(this.TRANSITION.DOCOPY());
            this.running.push(false);
            this.E.push(null);
        }
        HandleEffectType(EFFECT_ARG);
    }

    run(blade) {
        var TMP = last_detected_blade_effect;
        var e = this.effect_.Detect(blade);
        if (e) {
            this.TRANSITIONS[this.pos].begin();
            this.running[this.pos] = true;
            this.E[this.pos] = last_detected_blade_effect;
            this.pos++;
            if (this.pos == this.N) this.pos = 0;
        }
        for (var i = 0; i < this.N; i++) {
            if (this.running[i]) {
                last_detected_blade_effect = this.E[i];
                this.TRANSITIONS[i].run(blade);
                if (this.TRANSITIONS[i].done()) {
                    this.running[i] = false;
                }
            }
        }
        last_detected_blade_effect = last_detected_blade_effect;
    }

    getColor(led) {
        var ret = Transparent();
        var P = this.pos + 1;
        for (var i = 0; i < this.N; i++) {
            if (P > this.N) P = 0;
            if (this.running[P]) {
                ret = this.TRANSITIONS[P].getColor(ret, ret, led);
            }
            P++;
        }
        return ret;
    }

    IS_RUNNING() {
        for (var i = 0; i < this.N; i++) {
            if (this.running[i]) return true;
        }
        return false;
    }

    argify(state) {
        state.color_argument = effect_to_argument(this.EFFECT);
        var ret = super.argify(state);
        state.color_argument = null;
        return ret;
    }
};

function MultiTransitionEffectL(T, E, N) {
    return new MultiTransitionEffectLClass(T, E, N);
}