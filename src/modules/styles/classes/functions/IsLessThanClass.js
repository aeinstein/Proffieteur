class IsLessThanClass extends FUNCTION {
    constructor(F, V) {
        super("Returns 32768 if F < V, 0 otherwise.", arguments);
        this.add_arg("F", "FUNCTION", "F");
        this.add_arg("V", "FUNCTION", "V");
    }

    getInteger(led) {
        return this.F.getInteger(led) < this.V.getInteger(led) ? 32768 : 0;
    }
};

function IsLessThan(F, V) {
    return new IsLessThanClass(F, V);
}