class ClampFClass extends MACRO {
    constructor(F, MIN, MAX) {
        super("Returns F, clamped to MIN...MAX", arguments);
        this.add_arg("F", "FUNCTION", "F");
        this.add_arg("MIN", "INT", "MIN");
        this.add_arg("MAX", "INT", "MAX");
        this.SetExpansion(ClampFX(F.DOCOPY(), Int(MIN), Int(MAX)));
    }
};

function ClampF(F, MIN, MAX) {
    return new ClampFClass(F, MIN, MAX);
}