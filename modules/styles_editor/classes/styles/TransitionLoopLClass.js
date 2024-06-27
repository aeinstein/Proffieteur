class TransitionLoopLClass extends STYLE {
    constructor(TRANSITION) {
        super("Continiously loop a transition", arguments);
        this.add_arg("TRANSITION", "TRANSITION", "Transition");
        this.TRANSITION.begin();
    }

    run(blade) {
        if (this.TRANSITION.done()) this.TRANSITION.begin();
        super.run(blade);
    }

    getColor(led) {
        return this.TRANSITION.getColor(Transparent(), Transparent(), led);
    }
};

function TransitionLoopL(T) {
    return new TransitionLoopLClass(T);
}