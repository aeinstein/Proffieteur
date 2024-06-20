class RotateColorsClass extends MACRO {
    constructor(ROTATION, COLOR) {
        super("Rotate colors", arguments);
        this.add_arg("ROTATION", "INT", "Rotation");
        this.add_arg("COLOR", "COLOR", "Color");
        this.SetExpansion(RotateColorsX(Int(this.ROTATION), this.COLOR));
    }
};

function RotateColors(R, C) {
    return new RotateColorsClass(R, C);
}