class SmoothStepClass extends FUNCTION {
    constructor(POS, WIDTH) {
        super("SmoothStep function", arguments);
        this.add_arg("POS", "FUNCTION", "Position 0=hilt, 32768=tip");
        this.add_arg("WIDTH", "FUNCTION", "Step width 32768=length of blade");
    }

    run(blade) {
        super.run(blade);
        var width = this.WIDTH.getInteger(0);
        if (width == 0) {
            this.mult = 32768;
        } else {
            this.mult = 32768 * 32768 / width / blade.num_leds();
        }
        this.location = blade.num_leds() * this.mult * (this.POS.getInteger(0) - width / 2) / 32768;
    }

    getInteger(led) {
        var x = led * this.mult - this.location;
        if (x < 0) return 0;
        if (x > 32768) return 32768;
        return (((x * x) >> 14) * ((3 << 14) - x)) >> 15;
    }
};

function SmoothStep(POS, WIDTH) {
    return new SmoothStepClass(POS, WIDTH);
}