class CircularSectionFClass extends FUNCTION {
    constructor(POSITION, FRACTION) {
        super("Circular section", arguments);
        this.add_arg("POSITION", "FUNCTION", "Position of circular secion.");
        this.add_arg("FRACTION", "FUNCTION", "Fraction of circle lit up.");
    }

    run(blade) {
        super.run(blade);
        this.num_leds = blade.num_leds();
        var fraction = this.FRACTION.getInteger(0);
        if (fraction == 32768) {
            this.start = 0;
            this.end = num_leds * 32768;
        } else if (fraction == 0) {
            this.start = 0;
            this.end = 0;
        } else {
            var pos = this.POSITION.getInteger(0);
            this.start = ((pos + 32768 - fraction / 2) & 32767) * this.num_leds;
            this.end = ((pos + fraction / 2) & 32767) * this.num_leds;
        }
        this.num_leds *= 32768;
//    console.log("START="+this.start+" END="+this.end +" num_leds="+this.num_leds);
    }

    getInteger(led) {
        var led_range = new Range(led * 32768, led * 32768 + 32768);
        var black_mix = 0;
        if (this.start <= this.end) {
            black_mix = (new Range(this.start, this.end).Intersect(led_range)).Size();
        } else {
            black_mix = (new Range(0, this.end).Intersect(led_range)).Size() +
                (new Range(this.start, this.num_leds).Intersect(led_range)).Size();
        }
//    console.log("BLACK MIX = " + black_mix);
        return black_mix;
    }
}

function CircularSectionF(POSITION, FRACTION) {
    return new CircularSectionFClass(POSITION, FRACTION);
}