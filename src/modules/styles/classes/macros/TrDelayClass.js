class TrDelayClass extends MACRO {
    constructor(MILLIS) {
        super("Delay transition", arguments);
        this.add_arg("MILLIS", "INT", "Delay time in milliseconds.");
        this.SetExpansion(TrDelayX(Int(MILLIS)));
    }
}

function TrDelay(MILLIS) {
    return new TrDelayClass(MILLIS);
}