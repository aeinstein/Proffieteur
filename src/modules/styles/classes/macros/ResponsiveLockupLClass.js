class ResponsiveLockupLClass extends MACRO {
    constructor(COLOR, TR1, TR2, TOP, BOTTOM, SIZE) {
        super("Responsive localized lockup layer.", arguments);
        this.add_arg("COLOR", "COLOR", "Color.");
        this.add_arg("TR1", "TRANSITION", "Begin transition", TrInstant());
        this.add_arg("TR2", "TRANSITION", "End transition", TrInstant());
        this.add_arg("TOP", "FUNCTION", "uppermost lockup limit", Scale(BladeAngle(0, 16000), Int(4000), Int(26000)));
        this.add_arg("BOTTOM", "FUNCTION", "lowermost lockup limit", Int(6000));
        this.add_arg("SIZE", "FUNCTION", "lockup size", Scale(SwingSpeed(100), Int(9000), Int(14000)));
        this.SetExpansion(LockupTrL(AlphaL(COLOR, Bump(Scale(BladeAngle(), this.TOP, this.BOTTOM), this.SIZE)),
            this.TR1,
            this.TR2,
            LOCKUP_TYPE(LOCKUP_NORMAL)));
        ;
    }

    argify(state) {
        state.color_argument = LOCKUP_COLOR_ARG;
        var ret = super.argify(state);
        state.color_argument = null;
        return ret;
    }
};

function ResponsiveLockupL(COLOR, TR1, TR2, TOP, BOTTOM, SIZE) {
    return new ResponsiveLockupLClass(COLOR, TR1, TR2, TOP, BOTTOM, SIZE);
}