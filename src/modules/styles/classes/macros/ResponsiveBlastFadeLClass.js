class ResponsiveBlastFadeLClass extends MACRO {
    constructor(COLOR, FADE, SIZE, TOP, BOTTOM, EFFECT_ARG) {
        super("Responsive localized blast layer.", arguments);
        this.add_arg("COLOR", "COLOR", "Color.");
        this.add_arg("SIZE", "FUNCTION", "blast size", Int(8000));
        this.add_arg("FADE", "FUNCTION", "fadeout time", Int(400));
        this.add_arg("TOP", "FUNCTION", "uppermost blast limit", Int(28000));
        this.add_arg("BOTTOM", "FUNCTION", "lowermost blast limit", Int(8000));
        this.add_arg("EFFECT", "EFFECT", "effect type", EFFECT(EFFECT_BLAST));
        this.SetExpansion(
            MultiTransitionEffectL(
                TrConcat(TrInstant(),
                    AlphaL(this.COLOR, Bump(Scale(BladeAngle(), this.TOP, this.BOTTOM), this.SIZE)),
                    TrFadeX(this.FADE)),
                this.EFFECT));

    }

    argify(state) {
        state.color_argument = BLAST_COLOR_ARG;
        var ret = super.argify(state);
        state.color_argument = null;
        return ret;
    }
};

function ResponsiveBlastFadeL(COLOR, FADE, SIZE, TOP, BOTTOM, EFFECT) {
    return new ResponsiveBlastFadeLClass(COLOR, FADE, SIZE, TOP, BOTTOM, EFFECT);
}