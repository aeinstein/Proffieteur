class DivideClass extends FUNCTION {
    constructor(F, V) {
        super("Returns F / V", arguments);
        this.add_arg("F", "FUNCTION", "F");
        this.add_arg("V", "FUNCTION", "V");
    }

    getInteger(led) {
        var v = this.V.getInteger(led);
        if (v == 0) return 0;
        return this.F.getInteger(led) / v;
    }
};

function Divide(F, V) {
    return new DivideClass(F, V);
}