
class TransitionPulseLClass extends STYLE {
    constructor(TRANSITION, PULSE) {
        super("Triggers transition when pulse occurs.", arguments);
        this.add_arg("TRANSITION", "TRANSITION", "Transition.");
        this.add_arg("PULSE", "FUNCTION", "Pulse.");
        this.run_ = false;
    }

    run(blade) {
        this.PULSE.run(blade);
        if (this.PULSE.getInteger(0)) {
            this.TRANSITION.begin();
            this.run_ = true;
        }
        if (this.run_) {
            this.TRANSITION.run(blade);
            if (this.TRANSITION.done()) this.run_ = false;
        }
    }

    getColor(led) {
        if (this.run_) {
            return this.TRANSITION.getColor(Transparent(), Transparent(), led);
        } else {
            return Transparent();
        }
    }
}

function TransitionPulseL(TRANSITION, PULSE) {
    return new TransitionPulseLClass(TRANSITION, PULSE);
}