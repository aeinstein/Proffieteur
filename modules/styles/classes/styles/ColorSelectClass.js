
class ColorSelectClass extends STYLE {
    constructor(ARGS) {
        super("Change color based on function", ARGS);
        this.COLORS = Array.from(ARGS).slice(2);
        this.add_arg("F", "FUNCTION", "Selector function");
        this.add_arg("TRANSITION", "TRANSITION", "Transition");
        for (var i = 1; i < this.COLORS.length + 1; i++)
            this.add_arg("COLOR" + i, "COLOR", "COLOR " + i);
        this.selection = this.F.getInteger(0);
        this.old_selection = this.selection;
        if (this.F.pp() == "Variation") {
            HandleEffectType(EFFECT_CHANGE);
        }
    }

    run(blade) {
        this.F.run(blade);
        for (var i = 0; i < this.COLORS.length; i++)
            this.COLORS[i].run(blade);
        var f = this.F.getInteger(0);
        while (f < 0) f += this.COLORS.length * 256;
        var selection = f % this.COLORS.length;
        if (selection != this.selection) {
            // Start transition
            this.old_selection = this.selection;
            this.selection = selection;
            this.TRANSITION.begin();
        }
        if (this.selection != this.old_selection) {
            this.TRANSITION.run(blade);
            if (this.TRANSITION.done()) {
                this.old_selection = this.selection;
            }
        }
    }

    getColor(led) {
        var ret = this.COLORS[this.selection + 0].getColor(led);
        if (this.selection != this.old_selection) {
            var old = this.COLORS[this.old_selection].getColor(led);
            ret = this.TRANSITION.getColor(old, ret, led);
        }
        return ret;
    }
};

function ColorSelect(F, T, A, B) {
    return new ColorSelectClass(Array.from(arguments));
}
