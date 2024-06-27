class LinearSectionFClass extends FUNCTION {
    constructor(POSITION, FRACTION) {
        super("Linear section", arguments);
        this.add_arg("POSITION", "FUNCTION", "Position of linear secion.");
        this.add_arg("FRACTION", "FUNCTION", "Fraction lit up.");
    }

    run(blade) {
        super.run(blade);
        var num_leds = blade.num_leds();
        var fraction = this.FRACTION.getInteger(0);
        var pos = this.POSITION.getInteger(0);
        this.range = new Range(clamp((pos - fraction / 2) * num_leds, 0, 32768 * num_leds), clamp((pos + fraction / 2) * num_leds, 0, 32768 * num_leds));
    }

    getInteger(led) {
        var led_range = new Range(led * 32768, led * 32768 + 32768);
        return this.range.Intersect(led_range).Size();
    }
}

function LinearSectionF(POSITION, FRACTION) {
    return new LinearSectionFClass(POSITION, FRACTION);
}