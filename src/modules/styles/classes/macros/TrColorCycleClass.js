class TrColorCycleClass extends MACRO {
    constructor(MILLIS, START_RPM, END_RPM) {
        super("ColorCycle transition", arguments);
        this.add_arg("MILLIS", "INT", "Transition length in milliseconds.")
        this.add_arg("START_RPM", "INT", "RPM at the beginning of transition", 0);
        this.add_arg("END_RPM", "INT", "RPM at the end of transition", 6000);
        this.SetExpansion(TrColorCycleX(Int(MILLIS), this.START_RPM, this.END_RPM))
    }
}

function TrColorCycle(MILLIS, START_RPM, END_RPM) {
    return new TrColorCycleClass(MILLIS, START_RPM, END_RPM);
}