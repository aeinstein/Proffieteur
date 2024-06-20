class FireConfigClass extends CONFIG {
    constructor(INTENSITY_BASE, INTENSITY_RAND, COOLING) {
        super("Fire configuration", Array.from(arguments));
        this.add_arg("intensity_base", "INT", "intensity base");
        this.add_arg("intensity_rand", "INT", "intensity random");
        this.add_arg("cooling", "INT", "cooling");
    }

    getType() {
        return "FireConfig";
    }
}

function FireConfig(B, R, C) {
    return new FireConfigClass(B, R, C);
}

function FireConfigI(B, R, C) {
    return new FireConfigClass(new INTEGER(B), new INTEGER(R), new INTEGER(C));
}

const FIRE_STATE_OFF = 0
const FIRE_STATE_ACTIVATING = 1;
const FIRE_STATE_ON = 2;