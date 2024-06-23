class LockupLClass extends STYLE {
    isEffect() {
        return true;
    }

    constructor(LOCKUP, DRAG_COLOR, LOCKUP_SHAPE, DRAG_SHAPE, LB_SHAPE) {
        super("Implements the lockup and drag effects.", arguments);
        this.add_arg("LOCKUP", "COLOR", "lockup color");
        this.add_arg("DRAG_COLOR", "COLOR", "drag color", this.LOCKUP.DOCOPY());
        this.add_arg("LOCKUP_SHAPE", "FUNCTION", "Lockup shape", Int(32768));
        this.add_arg("DRAG_SHAPE", "FUNCTION", "Drag shape", SmoothStep(Int(28671), Int(4096)));
        this.add_arg("LB_SHAPE", "FUNCTION", "Lightning block shape",
            LayerFunctions(Bump(Scale(SlowNoise(Int(2000)), Int(3000), Int(16000)),
                    Scale(BrownNoiseF(Int(10)), Int(14000), Int(8000))),
                Bump(Scale(SlowNoise(Int(2300)), Int(26000), Int(8000)),
                    Scale(NoisySoundLevel(), Int(5000), Int(10000))),
                Bump(Scale(SlowNoise(Int(2300)), Int(20000), Int(30000)),
                    Scale(IsLessThan(SlowNoise(Int(1500)), Int(8000)), Scale(NoisySoundLevel(), Int(5000), Int(0)), Int(0)))));
    }

    run(blade) {
        super.run(blade);
        this.single_pixel_ = blade.num_leds() == 1;
        this.handled = IsHandledLockup(STATE_LOCKUP);
    }

    getColor(led) {
        var ret = Transparent();
        if (this.handled) return ret;
        if (STATE_LOCKUP == LOCKUP_LIGHTNING_BLOCK) {
            ret = ret.mix(this.LOCKUP.getColor(led), this.LB_SHAPE.getInteger(led) / 32768.0);
        }
        if (STATE_LOCKUP == LOCKUP_DRAG) {
            var blend = this.single_pixel_ ? 32768 : this.DRAG_SHAPE.getInteger(led);
            ret = ret.mix(this.DRAG_COLOR.getColor(led), blend / 32768.0);
        }
        if (STATE_LOCKUP == LOCKUP_NORMAL) {
            ret = ret.mix(this.LOCKUP.getColor(led), this.LOCKUP_SHAPE.getInteger(led) / 32768.0);
        }
        return ret;
    }

    IS_RUNNING() {
        if (this.handled) return false;
        if (STATE_LOCKUP == LOCKUP_LIGHTNING_BLOCK) true;
        if (STATE_LOCKUP == LOCKUP_DRAG) return true;
        if (STATE_LOCKUP == LOCKUP_NORMAL) return true;
        return false;
    }

    argify(state) {
        state.color_argument = LOCKUP_COLOR_ARG;
        this.LOCKUP = this.LOCKUP.argify(state);
        state.color_argument = DRAG_COLOR_ARG;
        this.DRAG_COLOR = this.DRAG_COLOR.argify(state);
        state.color_argument = null;
        return this;
    }
};

function LockupL(LOCKUP, DRAG, LOCKUP_SHAPE, DRAG_SHAPE, LB_SHAPE) {
    return new LockupLClass(LOCKUP, DRAG, LOCKUP_SHAPE, DRAG_SHAPE, LB_SHAPE);
}