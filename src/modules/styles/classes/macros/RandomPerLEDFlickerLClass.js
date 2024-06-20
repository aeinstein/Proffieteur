class RandomPerLEDFlickerLClass extends MACRO {
    constructor(A) {
        super("Selects between A and transparent randomly.", arguments);
        this.add_arg("A", "COLOR", "A");
        this.SetExpansion(AlphaL(A, RandomPerLEDF()));
    }
}

function RandomPerLEDFlickerL(A) {
    return new RandomPerLEDFlickerLClass(A);
}