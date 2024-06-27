class RgbArgClass extends STYLE {
    constructor(ARG, N) {
        super("Dynamic Color argument", arguments);
        this.add_arg("ARG", "ArgumentName", "number to return.");
        this.add_arg("DEFAULT", "COLOR", "default.");
    }

    run(blade) {
        super.run(blade);
        var d = Math.round(this.DEFAULT.r * 65535) + "," + Math.round(this.DEFAULT.g * 65535) + "," + Math.round(this.DEFAULT.b * 65535);
        var v = getARG(this.ARG, d).split(",");
        this.value = Rgb16(parseInt(v[0]), parseInt(v[1]), parseInt(v[2]));
    }

    getColor(led) {
        return this.value;
    }

    argify(state) {
        if (state.color_argument == this.ARG) {
            state.color_argument = false;
        }
        return this;
    }
};

function RgbArg_(ARG, COLOR) {
    return new RgbArgClass(ARG, COLOR);
}