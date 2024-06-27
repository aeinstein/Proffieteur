class RandomBlinkXClass extends MACRO {
    constructor(MILLIHZ, COLOR1, COLOR2) {
        super("Blink each LED randomly MILLIHZ times per second.", arguments);
        this.add_arg("MILLIHZ", "FUNCTION", "how often to blink");
        this.add_arg("COLOR1", "COLOR", "first color", WHITE.DOCOPY());
        this.add_arg("COLOR2", "COLOR", "second color", BLACK.DOCOPY());
        this.SetExpansion(Layers(this.COLOR1, RandomBlinkL(this.MILLIHZ, this.COLOR2)));
    }
}

function RandomBlinkX(millihz, c1, c2) {
    return new RandomBlinkXClass(millihz, c1, c2);
}