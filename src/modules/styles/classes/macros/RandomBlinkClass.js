class RandomBlinkClass extends MACRO {
    constructor(MILLIHZ, COLOR1, COLOR2) {
        super("Blink each LED randomly MILLIHZ times per second.", arguments);
        this.add_arg("MILLIHZ", "INT", "how often to blink");
        this.add_arg("COLOR1", "COLOR", "first color", WHITE.DOCOPY());
        this.add_arg("COLOR2", "COLOR", "second color", BLACK.DOCOPY());
        this.SetExpansion(RandomBlinkX(Int(this.MILLIHZ), this.COLOR1, this.COLOR2));
    }
}

function RandomBlink(MILLIHZ, COLOR1, COLOR2) {
    return new RandomBlinkClass(MILLIHZ, COLOR1, COLOR2);
}