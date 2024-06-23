class TrJoinRClass extends TRANSITION {
    constructor(ARGS) {
        super("Right join transitions", ARGS);
        this.ARGS = Array.from(ARGS);
        for (var i = 0; i < this.ARGS.length; i++) {
            this.add_arg("TRANSITION" + i, "TRANSITION", "Transiton " + i);
        }
    }

    begin() {
        for (var i = 0; i < this.ARGS.length; i++) this.ARGS[i].begin();
    }

    done() {
        for (var i = 0; i < this.ARGS.length; i++) if (!this.ARGS[i].done()) return false;
        return true;
    }

    getColor(A, B, led) {
        for (var i = 0; i < this.ARGS.length; i++) {
            B = this.ARGS[i].getColor(A, B, led);
        }
        return B;
    }
};

function TrJoinR(ARGS) {
    return new TrJoinRClass(arguments);
}
