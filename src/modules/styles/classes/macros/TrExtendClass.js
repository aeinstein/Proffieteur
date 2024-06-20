class TrExtendClass extends MACRO {
    constructor(MILLIS, TRANSITION) {
        super("Extend a transition.", arguments);
        this.add_arg("MILLIS", "INT", "How much to extend the transition.");
        this.add_arg("TRANSITION", "TRANSITION", "Transition to extend.");
        this.SetExpansion(TrExtendX(Int(MILLIS), TRANSITION));
    }
};

function TrExtend(MILLIS, TRANSACTION) {
    return new TrExtendClass(MILLIS, TRANSACTION);
}