class TransitionEffectLClass extends STYLE {
    constructor(EFFECT_COLOR, TRANSITION1, TRANSITION2, EFFECT_ARG) {
        super("Trigger transitions on an effect.", arguments);
        this.add_arg("TRANSITION", "TRANSITION", "from EFFECT_COLOR T");
        this.add_arg("EFFECT", "EFFECT", "Effect type");
        this.effect_ = new OneshotEffectDetector(this.EFFECT);
        this.run_ = false;
    }

    run(blade) {
        var e = this.effect_.Detect(blade);
        if (e) {
            this.TRANSITION.begin();
            this.run_ = true;
        }
        this.TRANSITION.run(blade);
        if (this.run_ && this.TRANSITION.done()) {
            this.run_ = false;
        }
    }

    getColor(led) {
        var ret = Transparent();
        if (this.run_) {
            ret = this.TRANSITION.getColor(ret, ret, led);
        }
        return ret;
    }

    IS_RUNNING() {
        return this.run_;
    }

    argify(state) {
        state.color_argument = effect_to_argument(this.EFFECT);
        var ret = super.argify(state);
        state.color_argument = null;
        return ret;
    }
};

function TransitionEffectL(T, E) {
    return new TransitionEffectLClass(T, E);
}