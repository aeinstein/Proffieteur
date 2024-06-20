class TrLoopUntilClass extends TRANSITION {
    constructor(PULSE, TR, OUT) {
        super("Loop transition until pulse occurs.", arguments);
        this.add_arg("PULSE", "FUNCTION", "Pulse");
        this.add_arg("TR", "TRANSITION", "Transition");
        this.add_arg("OUT", "TRANSITION", "Fade-out transition");
        this.pulsed = false;
    }

    begin() {
        this.TR.begin();
        this.pulsed = false;
    }

    done() {
        return this.pulsed && this.OUT.done();
    }

    run(blade) {
        this.PULSE.run(blade);
        if (this.TR.done()) {
            this.TR.begin();
        }
        this.TR.run(blade);
        if (!this.pulsed) {
            if (this.PULSE.getInteger(0)) {
                this.OUT.begin();
                this.pulsed = true;
            }
        }
        if (this.pulsed) {
            this.OUT.run(blade);
        }
    }

    getColor(a, b, led) {
        var ret = this.TR.getColor(a, a, led);
        if (this.pulsed) {
            ret = this.TR.getColor(ret, b, led);
        }
        return ret;
    }
}

function TrLoopUntil(PULSE, TR, OUT) {
    return new TrLoopUntilClass(PULSE, TR, OUT);
}