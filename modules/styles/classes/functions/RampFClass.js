class RampFClass extends FUNCTION {
    constructor() {
        super("0 at base, 32768 at tip", arguments);
    }

    run(blade) {
        this.num_leds = blade.num_leds();
    }

    getInteger(led) {
        return led * 32768 / this.num_leds;
    }
}

function RampF() {
    return new RampFClass();
}