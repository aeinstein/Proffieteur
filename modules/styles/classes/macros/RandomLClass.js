class RandomLClass extends MACRO {
    constructor(A) {
        super("Selects between A and transparent randomly.", arguments);
        this.add_arg("A", "COLOR", "A");
        this.SetExpansion(AlphaL(A, RandomF()));
    }
}

function RandomL(A) {
    return new RandomLClass(A);
}