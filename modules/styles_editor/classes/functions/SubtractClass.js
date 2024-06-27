class SubtractClass extends FUNCTION {
    constructor(F, V) {
        super("Returns F - V", arguments);
        this.add_arg("F", "FUNCTION", "F");
        this.add_arg("V", "FUNCTION", "V");
    }

    getInteger(led) {
        return this.F.getInteger(led) - this.V.getInteger(led);
    }
};

function Subtract(F, V) {
    return new SubtractClass(F, V);
}