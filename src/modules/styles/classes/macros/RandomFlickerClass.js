class RandomFlickerClass extends MACRO {
    constructor(A, B) {
        super("Selects between A and B randomly.", arguments);
        this.add_arg("A", "COLOR", "A");
        this.add_arg("B", "COLOR", "B");
        this.SetExpansion(Layers(A, RandomL(B)));
    }
}

function RandomFlicker(A, B) {
    return new RandomFlickerClass(A, B);
}