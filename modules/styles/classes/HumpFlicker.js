class HumpFlickerClass extends MACRO {
    constructor(A, B, hump_width) {
        super("Picks a random spot for a bump each frame.", Array.from(arguments));
        this.add_arg("A", "COLOR", "A");
        this.add_arg("B", "COLOR", "B");
        this.add_arg("hump_width", "INT", "Hump width");
        this.SetExpansion(Layers(A, HumpFlickerL(B, hump_width)));
    }
}

function HumpFlicker(A, B, hump_width) {
    return new HumpFlickerClass(A, B, hump_width);
}