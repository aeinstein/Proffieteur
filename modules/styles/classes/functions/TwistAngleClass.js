class TwistAngleClass extends FUNCTION {
    constructor() {
        super("Twist Angle", arguments);
        this.add_arg("N", "INT", "Number of up/downs per rotation.", 2);
        this.add_arg("OFFSET", "INT", "Angular offset", 0);
    }

    run(blade) {
        super.run(blade);
        var v = Math.sin(millis() * Math.PI / 3000.0) / 2.0 + 0.5;
        this.var_ = clamp(v * 32768, 0, 32768);
    }

    getInteger(led) {
        return this.var_;
    }
};

function TwistAngle(N, OFFSET) {
    return new TwistAngleClass(N, OFFSET);
}