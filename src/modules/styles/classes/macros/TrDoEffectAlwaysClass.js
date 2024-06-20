class TrDoEffectAlwaysClass extends MACRO {
    constructor(TRANSITION, EFFECT, WAVNUM, LOCATION) {
        super("Do effect", arguments);
        this.add_arg("TRANSITION", "TRANSITION", "Wrapped transition");
        this.add_arg("EFFECT", "EFFECT", "Effect to trigger.");
        this.add_arg("WAVNUM", "INT", "Select wave number.", -1);
        this.add_arg("LOCATION", "INT", "Effect location.", -1);
        this.SetExpansion(TrDoEffectAlwaysX(TRANSITION, EFFECT, Int(this.WAVNUM), Int(this.LOCATION)));
    }
}

function TrDoEffectAlways(TRANSITION, EFFECT, WAVNUM, LOCATION) {
    return new TrDoEffectAlwaysClass(TRANSITION, EFFECT, WAVNUM, LOCATION);
}