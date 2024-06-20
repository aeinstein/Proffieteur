class TwistAccelerationClass extends FUNCTION {
    constructor() {
        super("Twist Acceleration", arguments);
        this.add_arg("MAX", "INT", "Acceleration needed to return 32768", 90);
    }

    run(blade) {
        super.run(blade);
        var v = Math.cos(millis() * Math.PI / 3000.0) / 2.0 + 0.5;
        this.var_ = clamp(v * 32768, 0, 32768);
    }

    getInteger(led) {
        return this.var_;
    }
};

function TwistAcceleration(N, OFFSET) {
    return new TwistAccelerationClass(N, OFFSET);
}