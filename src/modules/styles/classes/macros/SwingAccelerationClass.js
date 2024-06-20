
class SwingAccelerationClass extends MACRO {
    constructor() {
        super("Swing Speed", arguments);
        this.add_arg("MAX", "INT", "What swing speed returns 32768.", 130);
        this.SetExpansion(SwingAccelerationX(Int(this.MAX)));
    }
};

function SwingAcceleration(MAX) {
    return new SwingAccelerationClass(MAX);
}