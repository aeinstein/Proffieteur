class InOutHelperFClass extends FUNCTION {
    constructor(T, EXTENSION, OFF_COLOR, ALLOW_DISABLE) {
        super("0=retracted, 32768=extended", arguments);
        this.add_arg("EXTENSION", "FUNCTION", "extension amount");
        this.add_arg("ALLOW_DISABLE", "INT", "allow disable?", 1);
    }

    run(blade) {
        super.run(blade);
        this.thres = (this.EXTENSION.getInteger(0) * blade.num_leds());
    }

    getInteger(led) {
        return 32768 - clamp(this.thres - led * 32768, 0, 32768);
    }
}

function InOutHelperF(EX, AD) {
    return new InOutHelperFClass(EX, AD);
}