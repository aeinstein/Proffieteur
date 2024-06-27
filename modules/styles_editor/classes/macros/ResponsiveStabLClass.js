class ResponsiveStabLClass extends MACRO {
    constructor(COLOR, TR1, TR2, TOP, BOTTOM, SIZE) {
        super("Responsive localized stab layer.", arguments);
        this.add_arg("COLOR", "COLOR", "Color.");
        this.add_arg("TR1", "TRANSITION", "Begin transition", TrWipeIn(600));
        this.add_arg("TR2", "TRANSITION", "End transition", TrWipe(600));
        this.add_arg("SIZE1", "FUNCTION", "lower twist limit", Int(14000));
        this.add_arg("SIZE2", "FUNCTION", "upper twist limit", Int(8000));
        this.SetExpansion(
            TransitionEffectL(TrConcat(this.TR1,
                    AlphaL(COLOR, SmoothStep(Int(32000), Scale(BladeAngle(), this.SIZE1, this.SIZE2))),
                    this.TR2),
                EFFECT(EFFECT_STAB)));

    }

    argify(state) {
        state.color_argument = STAB_COLOR_ARG;
        var ret = super.argify(state);
        state.color_argument = null;
        return ret;
    }
};

function ResponsiveStabL(COLOR, TR1, TR2, TOP, BOTTOM, SIZE) {
    return new ResponsiveStabLClass(COLOR, TR1, TR2, TOP, BOTTOM, SIZE);
}