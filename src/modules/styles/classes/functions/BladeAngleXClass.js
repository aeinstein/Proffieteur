class BladeAngleXClass extends FUNCTION {
    constructor() {
        super("Blade Angle", arguments);
        this.add_arg("MIN", "FUNCTION", "What angle returns 0.", Int(0));
        this.add_arg("MAX", "FUNCTION", "What angle returns 32768.", Int(32768));
    }

    run(blade) {
        super.run(blade);
        if (IN_FRAME) {
            var min = this.MIN.getInteger(0);
            var max = this.MAX.getInteger(0);
            var v = fract((BLADE_ANGLE + Math.PI / 2) / Math.PI);
            if (v > 1) v = 2 - v;
            v *= 32768.0;
            this.var_ = clamp((v - min) * 32768 / (max - min), 0, 32768);
        } else {
            var v = Math.sin(millis() * Math.PI / 10000.0) / 2.0 + 0.5;
            this.var_ = clamp(v * 32768, 0, 32768);
        }
    }

    getInteger(led) {
        return this.var_;
    }
};

function BladeAngleX(MIN, MAX) {
    return new BladeAngleXClass(MIN, MAX);
}