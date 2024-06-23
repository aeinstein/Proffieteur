class RandomBlinkLClass extends MACRO {
    constructor(MILLIHZ, COLOR1, COLOR2) {
        super("Blink each LED randomly MILLIHZ times per second.", arguments);
        this.add_arg("MILLIHZ", "FUNCTION", "how often to blink");
        this.add_arg("COLOR2", "COLOR", "second color", BLACK.DOCOPY());
        this.SetExpansion(AlphaL(this.COLOR2, RandomBlinkF(MILLIHZ)));
    }
}

function RandomBlinkL(millihz, c1) {
    return new RandomBlinkLClass(millihz, c1);
}