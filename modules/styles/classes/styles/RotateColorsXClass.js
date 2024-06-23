class RotateColorsXClass extends STYLE {
    constructor(ROTATION, COLOR) {
        super("Rotate colors", arguments);
        this.add_arg("ROTATION", "FUNCTION", "Rotation");
        this.add_arg("COLOR", "COLOR", "Color");
    }

    getColor(led) {
        var ret = this.COLOR.getColor(led);
        return ret.rotate((this.ROTATION.getInteger(led) & 0x7fff) * 3);
    }

    argify(state) {
        if (this.ROTATION.constructor == VariationClass) {
            return this.COLOR.argify(state);
        }
        return super.argify(state);
    }
};

function RotateColorsX(R, C) {
    return new RotateColorsXClass(R, C);
}