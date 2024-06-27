class TrLoopNXClass extends TRANSITION {
    constructor(N, TRANSITION) {
        super("Loop transition", arguments);
        this.add_arg("N", "FUNCTION", "How many loops.");
        this.add_arg("TRANSITION", "TRANSITION", "Transition to loop");
        this.loops = 0;
    }

    run(blade) {
        this.N.run(blade);
        if (this.loops < 0) this.loops = this.N.getInteger(0) + 1;
        if (this.loops > 0 && this.TRANSITION.done()) {
            if (this.loops > 1) this.TRANSITION.begin();
            this.loops--;
        }
        this.TRANSITION.run(blade);
    }

    begin() {
        this.TRANSITION.begin();
        this.loops = -1;
    }

    done() {
        return this.loops == 0;
    }

    getColor(a, b, led) {
        return this.TRANSITION.getColor(a, b, led);
    }
}

function TrLoopNX(N, TRANSITION) {
    return new TrLoopNXClass(N, TRANSITION);
}