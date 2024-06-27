class TrFadeClass extends MACRO {
    constructor(MILLIS) {
        super("Fading transition", arguments);
        this.add_arg("MILLIS", "INT", "Fade time in milliseconds.");
        this.SetExpansion(TrFadeX(Int(MILLIS)));
    }
}

function TrFade(MILLIS) {
    return new TrFadeClass(MILLIS);
}