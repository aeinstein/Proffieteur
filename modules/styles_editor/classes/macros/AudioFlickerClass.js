class AudioFlickerClass extends MACRO {
    constructor(A, B) {
        super("Select between A and B based on audio. Higher volumes means more B.", arguments);
        this.add_arg("A", "COLOR", "A");
        this.add_arg("B", "COLOR", "B");
        this.SetExpansion(Layers(this.A, AudioFlickerL(this.B)));
    }
}

function AudioFlicker(A, B) {
    return new AudioFlickerClass(A, B);
}