class ClampFXClass extends FUNCTION {
    constructor(F, MIN, MAX) {
        super("Returns F, clamped to MIN...MAX", arguments);
        this.add_arg("F", "FUNCTION", "F");
        this.add_arg("MIN", "FUNCTION", "MIN");
        this.add_arg("MAX", "FUNCTION", "MAX");
    }

    getInteger(led) {
        return clamp(this.F.getInteger(led), this.MIN.getInteger(led), this.MAX.getInteger(led));
    }
};

function ClampFX(F, MIN, MAX) {
    return new ClampFXClass(F, MIN, MAX);
}