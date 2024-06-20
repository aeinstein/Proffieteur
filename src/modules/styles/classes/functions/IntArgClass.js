class IntArgClass extends FUNCTION {
    constructor(ARG, N) {
        super("Dynamic Integer argument", arguments);
        this.add_arg("ARG", "ArgumentName", "argument number.");
        this.add_arg("DEFAULT", "INT", "default.");
    }

    run(blade) {
        super.run(blade);
        this.value = parseInt(getARG(this.ARG, "" + this.DEFAULT));
    }

    getInteger(led) {
        return this.value;
    }

    argify(state) {
        if (state.int_argument == this.ARG) {
            state.int_argument = false;
        }
        return this;
    }
};

function IntArg_(ARG, N) {
    return new IntArgClass(ARG, N);
}