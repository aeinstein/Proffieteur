
class RetractionDelayClass extends MACRO {
    constructor(DELAY_MILLIS, BASE) {
        super("Delays retraction by DELAY_MILLIS", Array.from(arguments));
        this.add_arg("DELAY_MILLIS", "INT", "Ignition delay, in milliseconds");
        this.add_arg("BASE", "COLOR", "Blade style");
        this.SetExpansion(RetractionDelayX(Int(DELAY_MILLIS), BASE));
    }
}

function RetractionDelay(millis, base) {
    return new RetractionDelayClass(millis, base);
}