class TrWipeInClass extends MACRO {
    constructor(MILLIS) {
        super("WipeIn transition", arguments);
        this.add_arg("MILLIS", "INT", "WipeIn time in milliseconds.");
        this.SetExpansion(TrWipeInX(Int(MILLIS)));
    }
}

function TrWipeIn(MILLIS) {
    return new TrWipeInClass(MILLIS);
}