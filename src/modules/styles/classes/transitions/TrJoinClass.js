class TrJoinClass extends TRANSITION {
    constructor(ARGS) {
        super("Join transitions", ARGS);
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
            A = this.ARGS[i].getColor(A, B, led);
        }
        return A;
    }
};

function TrJoin(ARGS) {
    return new TrJoinClass(arguments);
}