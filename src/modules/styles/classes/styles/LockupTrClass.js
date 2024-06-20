class LockupTrClass extends MACRO {
    constructor(BASE, COLOR, BeginTr, EndTr, LOCKUP_TYPE, CONDITION) {
        super("Transition based lockup effect.", arguments);
        this.add_arg("BASE", "COLOR", "Base color.");
        this.add_arg("COLOR", "COLOR", "Effect color.");
        this.add_arg("BEGIN_TR", "TRANSITION", "Begin lockup transition.");
        this.add_arg("END_TR", "TRANSITION", "End lockup transition.");
        this.add_arg("LOCKUP_TYPE", "LOCKUP_TYPE", "Lockup type");
        this.add_arg("CONDITION", "FUNCTION", "Lockup is postponed if conditition is zero.", Int(1));
        this.SetExpansion(Layers(BASE, LockupTrL(COLOR, BeginTr, EndTr, LOCKUP_TYPE, this.CONDITITION)));
    }

    argify(state) {
        state.color_argument = lockup_to_argument(this.LOCKUP_TYPE);
        var ret = super.argify(state);
        state.color_argument = null;
        return ret;
    }
}

function LockupTr(BASE, COLOR, BeginTr, EndTr, LOCKUP_TYPE, CONDITION) {
    return new LockupTrClass(BASE, COLOR, BeginTr, EndTr, LOCKUP_TYPE, CONDITION);
}