class LocalizedClashClass extends MACRO {
    constructor(T, CLASH_COLOR, CLASH_MILLIS, CLASH_WIDTH_PERCENT, EFFECT_ARG) {
        super("Localized clash", arguments);
        this.add_arg("T", "COLOR", "base color");
        this.add_arg("CLASH_COLOR", "COLOR", "Clash color", WHITE.DOCOPY());
        this.add_arg("CLASH_MILLIS", "INT", "Clash duration in milliseconds", 40);
        this.add_arg("CLASH_WIDTH_PERCENT", "INT", "Clash width in percent of entire blade", 50);
        this.add_arg("EFFECT", "EFFECT", "effect type", EFFECT(EFFECT_CLASH));
        this.SetExpansion(Layers(T, LocalizedClashL(this.CLASH_COLOR, this.CLASH_MILLIS, this.CLASH_WIDTH_PERCENT, this.EFFECT)));
    }
}

function LocalizedClash(T, CLASH_COLOR, CLASH_MILLIS, CLASH_WIDTH_PERCENT, EF) {
    return new LocalizedClashClass(T, CLASH_COLOR, CLASH_MILLIS, CLASH_WIDTH_PERCENT, EF);
}