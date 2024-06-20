class TrSelectClass extends TRANSITION {
    constructor(ARGS) {
        super("Select transitions", ARGS);
        this.TRANSITIONS = Array.from(ARGS).slice(1);
        this.add_arg("F", "FUNCTION", "Transition to select");
        for (var i = 1; i <= max(this.TRANSITIONS.length, 1); i++) {
            this.add_arg("TRANSITION" + i, "TRANSITION", "Transiton " + i);
        }
        this.begin_ = true;
    }

    begin() {
        this.begin_ = true;
    }

    run(blade) {
        this.F.run(blade);
        if (this.begin_) {
            var f = this.F.getInteger(0) + 0;
            while (f < 0) f += this.TRANSITIONS.length * 255;
            f %= this.TRANSITIONS.length;
            this.selected = this.TRANSITIONS[f % this.TRANSITIONS.length];
            this.selected.begin();
            this.begin_ = false;
        }
        this.selected.run(blade);
    }

    done() {
        return this.selected && this.selected.done();
    }

    getColor(A, B, led) {
        return this.selected.getColor(A, B, led);
    }
};

function TrSelect(ARGS) {
    return new TrSelectClass(Array.from(arguments));
}