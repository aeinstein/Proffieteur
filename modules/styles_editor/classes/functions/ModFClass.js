class ModFClass extends FUNCTION {
    constructor(F, V) {
        super("Returns F mod V (always positive)", arguments);
        this.add_arg("F", "FUNCTION", "F");
        this.add_arg("V", "FUNCTION", "V");
    }

    getInteger(led) {
        var v = this.V.getInteger(led);
        if (v == 0) return 0;
        return MOD(this.F.getInteger(led), v);
    }
};

function ModF(F, V) {
    return new ModFClass(F, V);
}