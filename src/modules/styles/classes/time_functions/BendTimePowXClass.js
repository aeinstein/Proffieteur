class BendTimePowXClass extends TIME_FUNCTION {
    constructor(MILLIS, BEND_FUNCTION) {
        super("Bends time like a gamma function.", arguments);
        this.add_arg("MILLIS", "TIME_FUNCTION", "millis");
        this.add_arg("BEND_FUNCTION", "FUNCTION", "bend, 32768 = 1.0");
    }

    getInteger(led) {
        return this.MILLIS.getInteger(led);
    }

    bend(t, len, scale) {
        var exponent = this.BEND_FUNCTION.getInteger(0) / 32768.0;
        return scale * Math.pow(AddBend(this.MILLIS, t, len, 1.0), exponent);
    }
}

function BendTimePowX(MILLIS, BEND_FUNCTION) {
    return new BendTimePowXClass(MILLIS, BEND_FUNCTION);
}