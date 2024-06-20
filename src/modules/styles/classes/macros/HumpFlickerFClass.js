
class HumpFlickerFClass extends MACRO {
    constructor(hump_width) {
        super("Picks a random spot for a bump each frame.", Array.from(arguments));
        this.add_arg("hump_width", "INT", "Hump width");
        this.SetExpansion(HumpFlickerFX(Int(hump_width)));
    }
}

function HumpFlickerF(hump_width) {
    return new HumpFlickerFClass(hump_width);
}