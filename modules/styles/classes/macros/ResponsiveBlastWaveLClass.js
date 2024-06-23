class ResponsiveBlastWaveLClass extends MACRO {
    constructor(COLOR, FADE, SIZE, SPEED, TOP, BOTTOM, EFFECT_ARG) {
        super("Responsive localized blast layer.", arguments);
        this.add_arg("COLOR", "COLOR", "Color.");
        this.add_arg("FADE", "FUNCTION", "fadeout time", Int(400));
        this.add_arg("SIZE", "FUNCTION", "blast size", Int(100));
        this.add_arg("SPEED", "FUNCTION", "blast speed", Int(400));
        this.add_arg("TOP", "FUNCTION", "uppermost blast limit", Int(28000));
        this.add_arg("BOTTOM", "FUNCTION", "lowermost blast limit", Int(8000));
        this.add_arg("EFFECT", "EFFECT", "effect type", EFFECT(EFFECT_BLAST));
        this.SetExpansion(
            MultiTransitionEffectL(
                TrWaveX(this.COLOR, this.FADE, this.SIZE, this.SPEED, Scale(BladeAngle(), this.TOP, this.BOTTOM)),
                this.EFFECT));

    }

    argify(state) {
        state.color_argument = BLAST_COLOR_ARG;
        var ret = super.argify(state);
        state.color_argument = null;
        return ret;
    }
};

function ResponsiveBlastWaveL(COLOR, FADE, SIZE, SPEED, TOP, BOTTOM, EFFECT) {
    return new ResponsiveBlastWaveLClass(COLOR, FADE, SIZE, SPEED, TOP, BOTTOM, EFFECT);
}