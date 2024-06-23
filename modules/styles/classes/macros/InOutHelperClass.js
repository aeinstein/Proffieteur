class InOutHelperClass extends MACRO {
    constructor(T, OUT_MILLIS, IN_MILLIS, OFF_COLOR) {
        super("Extend/extract blade", arguments);
        this.add_arg("T", "COLOR", "Base color");
        this.add_arg("OUT_MILLIS", "INT", "Time to extend.");
        this.add_arg("IN_MILLIS", "INT", "Time to retract.");
        this.add_arg("OFF_COLOR", "COLOR", "color when retracted", BLACK.DOCOPY());
        this.SetExpansion(InOutHelperX(T, InOutFunc(OUT_MILLIS, IN_MILLIS), this.OFF_COLOR));
    }
}

function InOutHelper(T, I, O, OFF) {
    return new InOutHelperClass(T, I, O, OFF);
}