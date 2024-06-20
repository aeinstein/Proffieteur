class TransitionLoopClass extends MACRO {
    constructor(COLOR, TRANSITION) {
        super("Continiously loop a transition", arguments);
        this.add_arg("COLOR", "COLOR", "Color");
        this.add_arg("TRANSITION", "TRANSITION", "Transition");
        this.SetExpansion(Layers(COLOR, TransitionLoopL(TRANSITION)));
    }
};

function TransitionLoop(C, T) {
    return new TransitionLoopClass(C, T);
}
