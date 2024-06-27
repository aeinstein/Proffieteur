class HumpFlickerLClass extends MACRO {
    constructor(B, hump_width) {
        super("Picks a random spot for a bump each frame.", Array.from(arguments));
        this.add_arg("B", "COLOR", "B");
        this.add_arg("hump_width", "INT", "Hump width");
        this.SetExpansion(AlphaL(B, HumpFlickerF(hump_width)));
    }
}

function HumpFlickerL(B, hump_width) {
    return new HumpFlickerLClass(B, hump_width);
}