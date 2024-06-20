class BendTimePowClass extends MACRO {
    constructor(MILLIS, BEND_FUNCTION) {
        super("Bends time like an gamma function.", arguments);
        this.add_arg("MILLIS", "INT", "millis");
        this.add_arg("BEND_FUNCTION", "INT", "bend, 32768 = 1.0");
        this.SetExpansion(BendTimePowX(Int(MILLIS), Int(BEND_FUNCTION)));
    }
}

function BendTimePow(MILLIS, BEND_FUNCTION) {
    return new BendTimePowClass(MILLIS, BEND_FUNCTION);
}