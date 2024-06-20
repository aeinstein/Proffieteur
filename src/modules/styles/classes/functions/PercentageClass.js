class PercentageClass extends MACRO {
    constructor(F, P) {
        super("Returns P % of F.", arguments);
        this.add_arg("F", "FUNCTION", "F");
        this.add_arg("P", "INT", "Percent")
        this.SetExpansion(Mult(this.F.DOCOPY(), Int(this.P * 32768 / 100)));
    }
}

function Percentage(F, P) {
    return new PercentageClass(F, P);
}