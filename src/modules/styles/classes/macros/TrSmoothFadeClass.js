class TrSmoothFadeClass extends MACRO {
    constructor(MILLIS) {
        super("Smooth fading transition", arguments);
        this.add_arg("MILLIS", "INT", "SmoothFade time in milliseconds.");
        this.SetExpansion(TrSmoothFadeX(Int(MILLIS)));
    }
}

function TrSmoothFade(MILLIS) {
    return new TrSmoothFadeClass(MILLIS);
}