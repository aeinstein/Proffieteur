class InOutHelperXClass extends MACRO {
    constructor(T, EXTENSION, OFF_COLOR, ALLOW_DISABLE) {
        super("0=retracted, 32768=extended", arguments);
        this.add_arg("T", "COLOR", "base color");
        this.add_arg("EXTENSION", "FUNCTION", "extension amount");
        this.add_arg("OFF_COLOR", "COLOR", "color when retracted", BLACK.DOCOPY());
        this.add_arg("ALLOW_DISABLE", "INT", "allow disable?", 1);
        this.SetExpansion(Layers(T, InOutHelperL(EXTENSION, this.OFF_COLOR, this.ALLOW_DISABLE)));
    }
}

function InOutHelperX(T, EX, O, AD) {
    return new InOutHelperXClass(T, EX, O, AD);
}