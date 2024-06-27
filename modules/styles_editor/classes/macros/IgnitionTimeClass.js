class IgnitionTimeClass extends MACRO {
    constructor(DEFAULT_VALUE) {
        super("arg/wavlen ignition time", arguments);
        this.add_arg("DEFAULT_VALUE", "INT", "Default value.", 300);
        this.SetExpansion(Scale(IsLessThan(IntArg_(ArgumentName(IGNITION_TIME_ARG), this.DEFAULT_VALUE), Int(1)), IntArg_(ArgumentName(IGNITION_TIME_ARG), this.DEFAULT_VALUE), WavLen(EFFECT(EFFECT_IGNITION))));
    }
}

function IgnitionTime(DEFAULT_VALUE) {
    return new IgnitionTimeClass(DEFAULT_VALUE);
}