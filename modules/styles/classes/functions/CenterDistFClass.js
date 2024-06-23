class CenterDistFClass extends FUNCTION {
    constructor(CENTER) {
        super("Distance from center.", arguments);
        this.add_arg("CENTER", "FUNCTION", "Center point", Int(16384));
    }

    run(blade) {
        super.run(blade);
        this.num_leds = blade.num_leds();
    }

    getInteger(led) {
        return Math.abs(led * 32768 / this.num_leds - this.CENTER.getInteger(led));
    }
};

function CenterDistF(CENTER) {
    return new CenterDistFClass(CENTER);
}