class BendTimePowInvClass extends MACRO {
    constructor(MILLIS, BEND_FUNCTION) {
        super("Bends time like an inverted gamma function.", arguments);
        this.add_arg("MILLIS", "INT", "millis");
        this.add_arg("BEND_FUNCTION", "INT", "bend, 32768 = 1.0");
        this.SetExpansion(BendTimePowInvX(Int(MILLIS), Int(BEND_FUNCTION)));
    }
}

function BendTimePowInv(MILLIS, BEND_FUNCTION) {
    return new BendTimePowInvClass(MILLIS, BEND_FUNCTION);
}