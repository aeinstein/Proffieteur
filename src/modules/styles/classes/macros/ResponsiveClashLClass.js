class ResponsiveClashLClass extends MACRO {
    constructor(COLOR, TR1, TR2, TOP, BOTTOM, SIZE) {
        super("Responsive localized lockup layer.", arguments);
        this.add_arg("COLOR", "COLOR", "Color.");
        this.add_arg("TR1", "TRANSITION", "Begin transition", TrInstant());
        this.add_arg("TR2", "TRANSITION", "End transition", TrFade(200));
        this.add_arg("TOP", "FUNCTION", "uppermost lockup limit", Scale(BladeAngle(0, 16000), Int(4000), Int(26000)));
        this.add_arg("BOTTOM", "FUNCTION", "lowermost lockup limit", Int(6000));
        this.add_arg("SIZE", "FUNCTION", "lockup size", Int(10000));
        this.SetExpansion(TransitionEffectL(TrConcat(this.TR1,
                AlphaL(COLOR, Bump(Scale(BladeAngle(), this.TOP, this.BOTTOM), this.SIZE)),
                this.TR2),
            EFFECT(EFFECT_CLASH)));
    }

    argify(state) {
        state.color_argument = CLASH_COLOR_ARG;
        var ret = super.argify(state);
        state.color_argument = null;
        return ret;
    }
};

function ResponsiveClashL(COLOR, TR1, TR2, TOP, BOTTOM, SIZE) {
    return new ResponsiveClashLClass(COLOR, TR1, TR2, TOP, BOTTOM, SIZE);
}