class SwingSpeedClass extends MACRO {
    constructor() {
        super("Swing Speed", arguments);
        this.add_arg("MAX", "INT", "What swing speed returns 32768.");
        this.SetExpansion(SwingSpeedX(Int(this.MAX)));
    }
};

function SwingSpeed(MAX) {
    return new SwingSpeedClass(MAX);
}