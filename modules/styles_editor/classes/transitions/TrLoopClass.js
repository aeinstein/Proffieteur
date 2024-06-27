class TrLoopClass extends TRANSITION {
    constructor(TRANSITION) {
        super("Loop transition", arguments);
        this.add_arg("TRANSITION", "TRANSITION", "Transition to loop");
    }

    run(blade) {
        if (this.TRANSITION.done()) this.TRANSITION.begin();
        super.run(blade);
    }

    begin() {
        this.TRANSITION.begin();
    }

    done() {
        return false;
    }

    getColor(a, b, led) {
        return this.TRANSITION.getColor(a, b, led);
    }
}

function TrLoop(TRANSITION) {
    return new TrLoopClass(TRANSITION);
}