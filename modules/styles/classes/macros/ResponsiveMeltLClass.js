class ResponsiveMeltLClass extends MACRO {
    constructor(COLOR, TR1, TR2, TOP, BOTTOM, SIZE) {
        super("Responsive localized melt layer.", arguments);
        this.add_arg("COLOR", "COLOR", "Color.", Mix(TwistAngle(), OrangeRed.DOCOPY(), RED.DOCOPY()));
        this.add_arg("TR1", "TRANSITION", "Begin transition", TrWipeIn(600));
        this.add_arg("TR2", "TRANSITION", "End transition", TrWipe(600));
        this.add_arg("SIZE1", "FUNCTION", "lower twist limit", Int(4000));
        this.add_arg("SIZE2", "FUNCTION", "upper twist limit", Int(10000));
        this.SetExpansion(LockupTrL(AlphaL(this.COLOR, SmoothStep(Int(30000), Scale(TwistAngle(), this.SIZE1, this.SIZE2))),
            this.TR1,
            this.TR2,
            LOCKUP_TYPE(LOCKUP_MELT)));
    }
};

function ResponsiveMeltL(COLOR, TR1, TR2, TOP, BOTTOM, SIZE) {
    return new ResponsiveMeltLClass(COLOR, TR1, TR2, TOP, BOTTOM, SIZE);
}