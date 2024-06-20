class IntSelectClass extends FUNCTION {
    constructor(ARGS) {
        super("Select number based on function", ARGS);
        this.INTS = Array.from(ARGS).slice(1);
        this.add_arg("F", "FUNCTION", "Selector function");
        for (var i = 1; i <= this.INTS.length; i++)
            this.add_arg("INT" + i, "INT", "Integer " + i);
    }

    run(blade) {
        this.F.run(blade);
        var f = this.F.getInteger(0);
        while (f < 0) f += this.COLORS.length * 256;
        f = f % this.INTS.length;
        this.value = this.INTS[f];
    }

    getInteger(led) {
        return this.value;
    }
};

function IntSelect(ARGS) {
    return new IntSelectClass(Array.from(arguments));
}