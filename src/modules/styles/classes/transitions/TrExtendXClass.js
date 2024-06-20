class TrExtendXClass extends TRANSITION {
    constructor(MILLIS, TRANSITION) {
        super("Extend a transition.", arguments);
        this.add_arg("MILLIS", "TIME_FUNCTION", "How much to extend the transition.");
        this.add_arg("TRANSITION", "TRANSITION", "Transition to extend.");
        this.extending = false;
        this.millis = new TRANSITION_BASE("millis", [this.MILLIS]);
    }

    begin() {
        this.extending = false;
        this.TRANSITION.begin();
    }

    run(blade) {
        this.TRANSITION.run(blade);
        if (!this.extending && this.TRANSITION.done()) {
            this.extending = true;
            this.millis.begin();
        }
        if (this.extending) {
            this.millis.run(blade);
            this.millis.update(0);
        }
    }

    done() {
        return this.extending && this.millis.done();
    }

    getColor(A, B, led) {
        return this.TRANSITION.getColor(A, B, led);
    }
};

function TrExtendX(MILLIS, TRANSACTION) {
    return new TrExtendXClass(MILLIS, TRANSACTION);
}