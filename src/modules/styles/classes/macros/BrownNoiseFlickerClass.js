class BrownNoiseFlickerClass extends MACRO {
    constructor(A, B, GRADE) {
        super("Randomly selects between A and B but keeps nearby pixels similar", Array.from(arguments));
        this.add_arg("A", "COLOR", "A");
        this.add_arg("B", "COLOR", "B");
        this.add_arg("GRADE", "INT", "grade");
        this.SetExpansion(Layers(A, BrownNoiseFlickerL(B, Int(this.GRADE * 128))))
    }
}

function BrownNoiseFlicker(A, B, grade) {
    return new BrownNoiseFlickerClass(A, B, grade);
}