class BendTimePowInvXClass extends MACRO {
    constructor(MILLIS, BEND_FUNCTION) {
        super("Bends time like an inverted gamma function.", arguments);
        this.add_arg("MILLIS", "TIME_FUNCTION", "millis");
        this.add_arg("BEND_FUNCTION", "FUNCTION", "bend, 32768 = 1.0");
        this.SetExpansion(ReverseTimeX(BendTimePowX(ReverseTimeX(MILLIS.DOCOPY()), BEND_FUNCTION.DOCOPY())));
    }
}

function BendTimePowInvX(MILLIS, BEND_FUNCTION) {
    return new BendTimePowInvXClass(MILLIS, BEND_FUNCTION);
}