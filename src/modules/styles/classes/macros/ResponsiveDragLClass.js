class ResponsiveDragLClass extends MACRO {
    constructor(COLOR, TR1, TR2, TOP, BOTTOM, SIZE) {
        super("Responsive localized drag layer.", arguments);
        this.add_arg("COLOR", "COLOR", "Color.");
        this.add_arg("TR1", "TRANSITION", "Begin transition", TrInstant());
        this.add_arg("TR2", "TRANSITION", "End transition", TrInstant());
        this.add_arg("SIZE1", "FUNCTION", "lower twist limit", Int(2000));
        this.add_arg("SIZE2", "FUNCTION", "upper twist limit", Int(10000));
        this.SetExpansion(LockupTrL(AlphaL(COLOR, SmoothStep(Int(32000), Scale(TwistAngle(), this.SIZE1, this.SIZE2))),
            this.TR1,
            this.TR2,
            LOCKUP_TYPE(LOCKUP_DRAG)));
    }

    argify(state) {
        state.color_argument = DRAG_COLOR_ARG;
        var ret = super.argify(state);
        state.color_argument = null;
        return ret;
    }
};

function ResponsiveDragL(COLOR, TR1, TR2, TOP, BOTTOM, SIZE) {
    return new ResponsiveDragLClass(COLOR, TR1, TR2, TOP, BOTTOM, SIZE);
}