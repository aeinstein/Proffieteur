class IgnitionDelayClass extends MACRO {
    constructor(DELAY_MILLIS, BASE) {
        super("Delays ignition by DELAY_MILLIS", Array.from(arguments));
        this.add_arg("DELAY_MILLIS", "INT", "Ignition delay, in milliseconds");
        this.add_arg("BASE", "COLOR", "Blade style");
        this.SetExpansion(IgnitionDelayX(Int(DELAY_MILLIS), BASE));
    }
}

function IgnitionDelay(millis, base) {
    return new IgnitionDelayClass(millis, base);
}