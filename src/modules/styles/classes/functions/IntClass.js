class IntClass extends FUNCTION {
    constructor(N) {
        super("Constant integer function", arguments);
        this.add_arg("N", "INT", "number to return.");
    }

    getInteger(led) {
        return this.N;
    }

    pp() {
        if (pp_is_url) {
            if (this.super_short_desc) return "$";
            return this.gencomment() + "Int<" + this.N + ">";
        }
        return this.PPshort("Int<" + this.N + ">", "VALUE");
    }

    argify(state) {
        if (state.int_argument) {
            ret = IntArg_(ArgumentName(state.int_argument), this.N);
            state.int_argument = false;
            return ret;
        } else {
            return this;
        }
    }
};

function Int(n) {
    return new IntClass(Math.round(n));
}
