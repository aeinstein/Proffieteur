class TrLoopNClass extends MACRO {
    constructor(N, TRANSITION) {
        super("Loop transition", arguments);
        this.add_arg("N", "INT", "How many loops.");
        this.add_arg("TRANSITION", "TRANSITION", "Transition to loop");
        this.SetExpansion(TrLoopNX(Int(N), TRANSITION))
    }
}

function TrLoopN(N, TRANSITION) {
    return new TrLoopNClass(N, TRANSITION);
}