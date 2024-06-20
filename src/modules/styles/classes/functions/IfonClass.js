class IfonClass extends FUNCTION {
    constructor(A, B) {
        super("A if on, B if off.", arguments);
        this.add_arg("A", "FUNCTION", "A");
        this.add_arg("B", "FUNCTION", "B");
    }

    run(blade) {
        this.A.run(blade);
        this.B.run(blade);
        this.on = blade.is_on();
    }

    getInteger(led) {
        if (this.on) return this.A.getInteger(led);
        return this.B.getInteger(led);
    }
}

function Ifon(A, B) {
    return new IfonClass(A, B);
}