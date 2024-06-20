class HueClass extends MACRO {
    constructor(ROTATION, COLOR) {
        super("Rotate colors", arguments);
        this.add_arg("HUE", "INT", "Hue");
        this.SetExpansion(HueX(Int(this.HUE)));
    }
};

function Hue(H) {
    return new HueClass(H);
}