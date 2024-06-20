class ScaleClass extends FUNCTION {
    constructor(F, A, B) {
        super("Changes values in range 0-32768 to A-B.", arguments);
        this.add_arg("F", "FUNCTION", "input");
        this.add_arg("A", "FUNCTION", "lower output limit");
        this.add_arg("B", "FUNCTION", "upper output limit");
    }

    run(blade) {
        super.run(blade);
        var a = this.A.getInteger(0);
        var b = this.B.getInteger(0);
        this.mul = (b - a);
        this.add = a;
    }

    getInteger(led) {
        return (this.F.getInteger(led) * this.mul >> 15) + this.add;
    }
};

function Scale(F, A, B) {
    return new ScaleClass(F, A, B);
}