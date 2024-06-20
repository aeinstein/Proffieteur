class ClashImpactFXClass extends FUNCTION {
    constructor(MIN, MAX) {
        super("Returns clash strength.", arguments);
        this.add_arg("MIN", "FUNCTION", "Minimum, translates to zero", Int(200));
        this.add_arg("MAX", "FUNCTION", "Maximum, translates to 32768", Int(1600));
        this.value = 0;
    }

    run(blade) {
        super.run(blade);
        current_clash_strength = max(current_clash_strength, random(current_clash_value));
        current_clash_value -= random(random(current_clash_value));
        this.value = clamp((current_clash_strength - this.MIN.getInteger(0)) * 32768 / this.MAX.getInteger(0), 0, 32768);
    }

    getInteger(led) {
        return this.value;
    }
};

function ClashImpactFX(MIN, MAX) {
    return new ClashImpactFXClass(MIN, MAX);
}