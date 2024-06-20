class BrownNoiseFlickerLClass extends MACRO {
    constructor(B, GRADE) {
        super("Randomly selects between A and B but keeps nearby pixels similar", Array.from(arguments));
        this.add_arg("B", "COLOR", "B");
        this.add_arg("GRADE", "FUNCTION", "grade");
        this.SetExpansion(AlphaL(B, BrownNoiseF(GRADE)))
    }
}

function BrownNoiseFlickerL(B, grade) {
    return new BrownNoiseFlickerLClass(B, grade);
}