class MultClass extends FUNCTION {
    constructor(ARGS) {
        super("Multiply values", ARGS);
        this.FUNCTIONS = Array.from(ARGS);
        for (var i = 1; i < this.FUNCTIONS.length + 1; i++)
            this.add_arg("FUNCTION" + i, "FUNCTION", "COLOR " + i);
    }

    getInteger(led) {
        var ret = this.FUNCTIONS[0].getInteger(led);
        for (var i = 1; i < this.FUNCTIONS.length; i++) {
            ret = (ret * this.FUNCTIONS[i].getInteger(led)) >> 15;
        }
        return ret;
    }
}

function Mult(ARGS) {
    return new MultClass(Array.from(arguments));
}