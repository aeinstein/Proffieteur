class ColorChangeClass extends MACRO {
    constructor(ARGS) {
        super("Change color based on variation", ARGS);
        this.COLORS = Array.from(ARGS).slice(1);
        this.add_arg("TRANSITION", "TRANSITION", "Transition");
        for (var i = 1; i < this.COLORS.length + 1; i++)
            this.add_arg("COLOR" + i, "COLOR", "COLOR " + i);
        this.SetExpansion(new ColorSelectClass([Variation(), this.TRANSITION].concat(this.COLORS)));
    }
};

function ColorChange(T, A, B) {
    return new ColorChangeClass(Array.from(arguments));
}