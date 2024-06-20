class InOutHelperLClass extends MACRO {
    isEffect() {
        return true;
    }

    constructor(EXTENSION, OFF_COLOR, ALLOW_DISABLE) {
        super("0=retracted, 32768=extended", arguments);
        this.add_arg("EXTENSION", "FUNCTION", "extension amount");
        this.add_arg("OFF_COLOR", "COLOR", "color when retracted", BLACK.DOCOPY());
        this.add_arg("ALLOW_DISABLE", "INT", "allow disable?", 1);
        this.SetExpansion(AlphaL(this.OFF_COLOR, InOutHelperF(EXTENSION, this.ALLOW_DISABLE)));
    }
}

function InOutHelperL(EX, O, AD) {
    return new InOutHelperLClass(EX, O, AD);
}