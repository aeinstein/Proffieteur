class SumClass extends FUNCTION {
    constructor(ARGS) {
        super("Add functions together", ARGS);
        this.F = Array.from(ARGS);
        for (var i = 1; i <= this.F.length; i++) {
            this.add_arg("FUN" + i, "FUNCTION", "Function " + i);
        }
    }

    getInteger(led) {
        var ret = 0;
        for (var i = 0; i < this.F.length; i++) {
            ret += this.F[i].getInteger(led);
        }
        return ret;
    }
}

function Sum(ARGS) {
    return new SumClass(Array.from(arguments));
}