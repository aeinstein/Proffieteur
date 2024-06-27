class TrWipeClass extends MACRO {
    constructor(MILLIS) {
        super("Wipe transition", arguments);
        this.add_arg("MILLIS", "INT", "Wipe time in milliseconds.");
        this.SetExpansion(TrWipeX(Int(MILLIS)));
    }
}

function TrWipe(MILLIS) {
    return new TrWipeClass(MILLIS);
}