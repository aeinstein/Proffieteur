class BladeAngleClass extends MACRO {
    constructor() {
        super("Blade Angle", arguments);
        this.add_arg("MIN", "INT", "What angle returns 0.", 0);
        this.add_arg("MAX", "INT", "What angle returns 32768.", 32768);
        this.SetExpansion(BladeAngleX(Int(this.MIN), Int(this.MAX)));
    }
};

function BladeAngle(MIN, MAX) {
    return new BladeAngleClass(MIN, MAX);
}