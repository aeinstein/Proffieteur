class RetractionTimeClass extends MACRO {
    constructor(DEFAULT_VALUE) {
        super("arg/wavlen ignition time", arguments);
        this.add_arg("DEFAULT_VALUE", "INT", "Default value.", 0);
        this.SetExpansion(Scale(IsLessThan(IntArg_(ArgumentName(RETRACTION_TIME_ARG), this.DEFAULT_VALUE), Int(1)), IntArg_(ArgumentName(RETRACTION_TIME_ARG), this.DEFAULT_VALUE), WavLen(EFFECT(EFFECT_RETRACTION))));
    }
}

function RetractionTime(DEFAULT_VALUE) {
    return new RetractionTimeClass(DEFAULT_VALUE);
}