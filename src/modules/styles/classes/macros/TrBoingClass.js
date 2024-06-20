class TrBoingClass extends MACRO {
    constructor(MILLIS, N) {
        super("Boing transition", arguments);
        this.add_arg("MILLIS", "INT", "Boing time in milliseconds.");
        this.add_arg("N", "INT", "Number of back-and-forth");
        this.SetExpansion(TrBoingX(Int(MILLIS), N));
    }
}

function TrBoing(MILLIS, N) {
    return new TrBoingClass(MILLIS, N);
}