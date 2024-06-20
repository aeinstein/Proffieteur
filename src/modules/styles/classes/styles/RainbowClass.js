class RainbowClass extends STYLE {
    constructor() {
        super("Scrolling color rainbow", arguments);
    }

    run(blade) {
        this.m = millis();
    }

    getColor(led) {
        return RgbF(max(0.0, sin((this.m * 3.0 + led * 50.0) % 1024.0 * Math.PI * 2.0 / 1000.0)),
            max(0.0, sin((this.m * 3.0 + led * 50.0 + 1024.0 / 3.0) % 1024.0 * Math.PI * 2.0 / 1000.0)),
            max(0.0, sin((this.m * 3.0 + led * 50.0 + 1024.0 * 2.0 / 3.0) % 1024.0 * Math.PI * 2.0 / 1000.0)));
    }

    pp() {
        return this.PPshort("Rainbow", "Scrolling color rainbow");
    }
}

function Rainbow() {
    return new RainbowClass();
}