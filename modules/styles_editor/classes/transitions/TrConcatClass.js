class TrConcatClass extends TRANSITION {
    constructor(ARGS) {
        super("Concatenate transitions", ARGS);
        this.ARGS = Array.from(ARGS);
        this.add_arg("TRANSITION", "TRANSITION", "Transition");
        for (var i = 1; i < this.ARGS.length - 1; i++) {
            if (this.ARGS[i].getType() == "TRANSITION") {
                this.add_arg("TRANSITION" + i, "TRANSITION", "Transiton " + i);
            } else {
                this.add_arg("COLOR" + i, "COLOR", "Color " + i);
            }
        }
        // Last argument must be a transition.
        this.add_arg("TRANSITION" + i, "TRANSITION", "Transiton " + i);
        this.pos_ = this.ARGS.length;
        this.c1p = -1;
        this.c2p = -1;
    }

    updateC2P() {
        for (var i = this.pos_ + 1; i < this.ARGS.length - 1; i++) {
            if (this.ARGS[i].getType() != "TRANSITION") {
                this.c2p = i;
                return;
            }
        }
        this.c2p = -1;
    }

    begin() {
        this.pos_ = 0;
        this.c1p = -1;
        this.updateC2P();
        this.ARGS[0].begin();
    }

    done() {
        return this.pos_ >= this.ARGS.length;
    }

    run(blade) {
        if (this.done()) return;
        if (this.c1p != -1) this.ARGS[this.c1p].run(blade);
        if (this.c2p != -1) this.ARGS[this.c2p].run(blade);
        while (this.pos_ < this.ARGS.length) {
            this.ARGS[this.pos_].run(blade);
            if (!this.ARGS[this.pos_].done()) break;
            this.pos_++;
            if (this.done()) break;
            if (this.ARGS[this.pos_].getType() != "TRANSITION") {
                this.c1p = this.c2p;
                this.updateC2P()
                if (this.c2p != -1) this.ARGS[this.c2p].run(blade);
                this.pos_++;
            }
            if (this.done()) break;
            this.ARGS[this.pos_].begin();
        }
    }

    getColor(A, B, led) {
        if (this.done()) return B;
        if (this.c1p != -1) A = this.ARGS[this.c1p].getColor(led);
        if (this.c2p != -1) B = this.ARGS[this.c2p].getColor(led);
        return this.ARGS[this.pos_].getColor(A, B, led);
    }
};

function TrConcat(ARGS) {
    return new TrConcatClass(Array.from(arguments));
}