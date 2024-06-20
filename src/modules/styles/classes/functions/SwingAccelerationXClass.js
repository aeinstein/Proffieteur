class SwingAccelerationXClass extends FUNCTION {
    constructor() {
        super("Swing Acceleration", arguments);
        this.add_arg("MAX", "FUNCTION", "What swing speed returns 32768.", Int(130));
        this.var_ = 0.0;
    }

    run(blade) {
        super.run(blade);
        var accel = get_swing_accel();
        var v = accel / this.MAX.getInteger(0);
        this.var_ = clamp(v * 32768, 0, 32768);
    }

    getInteger(led) {
        return this.var_;
    }
};

function SwingAccelerationX(MAX) {
    return new SwingAccelerationXClass(MAX);
}