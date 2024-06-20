class SwingSpeedXClass extends FUNCTION {
    constructor() {
        super("Swing Speed", arguments);
        this.add_arg("MAX", "FUNCTION", "What swing speed returns 32768.");
        this.var_ = 0.0;
    }

    run(blade) {
        super.run(blade);
        var speed = get_swing_speed();
        var v = speed / this.MAX.getInteger(0);
        this.var_ = clamp(v * 32768, 0, 32768);
    }

    getInteger(led) {
        return this.var_;
    }
};

function SwingSpeedX(MAX) {
    return new SwingSpeedXClass(MAX);
}