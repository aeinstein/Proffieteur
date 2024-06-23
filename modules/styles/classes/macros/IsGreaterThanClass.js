class IsGreaterThanClass extends MACRO {
    constructor(F, V) {
        super("Returns 32768 if F > V, 0 otherwise.", arguments);
        this.add_arg("F", "FUNCTION", "F");
        this.add_arg("V", "FUNCTION", "V");
        this.SetExpansion(IsLessThan(V.DOCOPY(), F.DOCOPY()));
    }
};

function IsGreaterThan(F, V) {
    return new IsGreaterThanClass(F, V);
}