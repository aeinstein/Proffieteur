class BumpClass extends FUNCTION {
    constructor() {
        super("Function returning a bump shape", arguments);
        this.add_arg("BUMP_POSITION", "FUNCTION", "0=bump at hilt, 32768=bump at tip");
        this.add_arg("BUMP_WIDTH_FRACTION", "FUNCTION", "bump width", Int(16384));
    }

    run(blade) {
        this.BUMP_POSITION.run(blade);
        this.BUMP_WIDTH_FRACTION.run(blade);
        var fraction = this.BUMP_WIDTH_FRACTION.getInteger(0);
        if (fraction == 0) {
            this.mult = 1;
            this.location = -10000;
            return;
        }
        this.mult = 32 * 2.0 * 128 * 32768 / fraction / blade.num_leds();
        this.location = (this.BUMP_POSITION.getInteger(0) * blade.num_leds() * this.mult) / 32768;
    }

    getInteger(led) {
        var dist = Math.abs(led * this.mult - this.location);
        var p = dist >> 7;
        if (p >= 32) return 0;
        var m = dist & 0x3f;
        return blast_hump[p] * (128 - m) + blast_hump[p + 1] * m;
    }
};

function Bump(P, F) {
    return new BumpClass(P, F);
}