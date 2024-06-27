class ResponsiveLightningBlockLClass extends MACRO {
    constructor(COLOR, TR1, TR2) {
        super("Responsive lightning block layer", arguments);
        this.add_arg("COLOR", "COLOR", "Color.");
        this.add_arg("TR1", "TRANSITION", "Begin transition", TrInstant());
        this.add_arg("TR2", "TRANSITION", "End transition", TrInstant());
        this.SetExpansion(
            LockupTrL(
                AlphaL(COLOR,
                    LayerFunctions(
                        Bump(Scale(SlowNoise(Scale(BladeAngle(24000, 32768), Int(2100), Int(1000))), Scale(BladeAngle(24000, 32768), Int(3000), Int(10000)), Int(16000)),
                            Scale(BrownNoiseF(Int(10)), Scale(TwistAngle(), Int(4000), Int(10000)), Scale(TwistAngle(), Int(9000), Int(14000)))),
                        Bump(Scale(SlowNoise(Int(2200)), Scale(BladeAngle(24000, 32768), Int(26000), Int(18000)), Int(8000)),
                            Scale(NoisySoundLevel(), Scale(TwistAngle(), Int(6000), Int(10000)), Scale(TwistAngle(), Int(10000), Int(14000)))),
                        Bump(Scale(SlowNoise(Int(2300)), Scale(BladeAngle(24000, 32768), Int(20000), Int(16000)), Scale(BladeAngle(24000, 32768), Int(30000), Int(24000))),
                            Scale(IsLessThan(SlowNoise(Int(2000)), Int(12000)), Scale(NoisySoundLevel(), Scale(TwistAngle(), Int(9000), Int(5000)), Int(0)), Int(0))))),
                this.TR1,
                this.TR2,
                LOCKUP_TYPE(LOCKUP_LIGHTNING_BLOCK)));
    }

    argify(state) {
        state.color_argument = LB_COLOR_ARG;
        var ret = super.argify(state);
        state.color_argument = null;
        return ret;
    }
};

function ResponsiveLightningBlockL(COLOR, TR1, TR2) {
    return new ResponsiveLightningBlockLClass(COLOR, TR1, TR2);
}