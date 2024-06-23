class RemapClass extends STYLE {
    constructor(F, COLOR) {
        super("Remaps the pixels of COLOR based on F", arguments);
        this.add_arg("F", "FUNCTION", "remap function");
        this.add_arg("COLOR", "COLOR", "COLOR");
    }

    run(blade) {
        super.run(blade);
        this.num_leds = blade.num_leds();
    }

    getColor(led) {
        const pos = this.F.getInteger(led);
        var led = clamp(pos * this.num_leds, 0, this.num_leds * 32768 - 1);
        const fraction = led & 0x7fff;
        led = clamp(led >> 15, 0, this.num_leds);
        return this.COLOR.getColor(led).mix(
            this.COLOR.getColor(min(led + 1, this.num_leds - 1)),
            fraction / 32768);
    }
}

function Remap(F, COLOR) {
    return new RemapClass(F, COLOR);
}