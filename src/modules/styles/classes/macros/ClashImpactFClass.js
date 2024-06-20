
class ClashImpactFClass extends MACRO {
    constructor(MIN, MAX) {
        super("Returns clash strength.", arguments);
        this.add_arg("MIN", "INT", "Minimum, translates to zero", 200);
        this.add_arg("MAX", "INT", "Maximum, translates to 32768", 1600);
        this.SetExpansion(ClashImpactFX(Int(this.MIN), Int(this.MAX)));
    }
}

function ClashImpactF(MIN, MAX) {
    return new ClashImpactFClass(MIN, MAX);
}