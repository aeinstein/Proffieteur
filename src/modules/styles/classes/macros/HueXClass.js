
class HueXClass extends MACRO {
    constructor(ROTATION, COLOR) {
        super("Rotate colors", arguments);
        this.add_arg("HUE", "FUNCTION", "Hue");
        this.SetExpansion(RotateColorsX(this.HUE, RED.DOCOPY()));
    }
}

function HueX(H) {
    return new HueXClass(H);
}