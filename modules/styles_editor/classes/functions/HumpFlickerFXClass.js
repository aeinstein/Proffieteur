class HumpFlickerFXClass extends FUNCTION {
    constructor(hump_width) {
        super("Picks a random spot for a bump each frame.", Array.from(arguments));
        this.add_arg("hump_width", "FUNCTION", "Hump width");
    }

    run(blade) {
        super.run(blade);
        this.pos = Math.floor(Math.random() * blade.num_leds());
    }

    getInteger(led) {
        return clamp(Math.abs(led - this.pos) * 32768 / this.hump_width.getInteger(led), 0, 32768);
    }
}

function HumpFlickerFX(hump_width) {
    return new HumpFlickerFXClass(hump_width);
}