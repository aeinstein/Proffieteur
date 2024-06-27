class TrRandomClass extends TRANSITION {
    constructor(ARGS) {
        super("Random transitions", ARGS);
        this.ARGS = Array.from(ARGS);
        for (var i = 0; i < this.ARGS.length; i++) {
            this.add_arg("TRANSITION" + i, "TRANSITION", "Transiton " + i);
        }
        this.pos_ = random(this.ARGS.length);
    }

    begin() {
        this.pos_ = random(this.ARGS.length);
        this.ARGS[this.pos_].begin();
    }

    done() {
        return this.ARGS[this.pos_].done();
    }

    getColor(A, B, led) {
        return this.ARGS[this.pos_].getColor(A, B, led);
    }
};

function TrRandom(ARGS) {
    return new TrRandomClass(Array.from(arguments));
}