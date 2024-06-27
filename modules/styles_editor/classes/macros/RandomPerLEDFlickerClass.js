class RandomPerLEDFlickerClass extends MACRO {
    constructor(A, B) {
        super("Selects between A and B randomly.", arguments);
        this.add_arg("A", "COLOR", "A");
        this.add_arg("B", "COLOR", "B");
        this.SetExpansion(Layers(A, RandomPerLEDFlickerL(B)));
    }
}

function RandomPerLEDFlicker(A, B) {
    return new RandomPerLEDFlickerClass(A, B);
}