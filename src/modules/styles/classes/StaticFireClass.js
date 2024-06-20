class StaticFireClass extends MACRO {
    constructor(COLOR1, COLOR2, DELAY, SPEED, BASE, RAND, COOLING) {
        super("Non-responsive fire style alias.", Array.from(arguments));
        this.add_arg("COLOR1", "COLOR", "Warm color");
        this.add_arg("COLOR2", "COLOR", "Hot color");
        this.add_arg("DELAY", "INT", "Delay", 0);
        this.add_arg("SPEED", "INT", "Speed", 2);
        this.add_arg("BASE", "INT", "Base", 0);
        this.add_arg("RAND", "INT", "Random", 2000);
        this.add_arg("COOLING", "INT", "Cooling", 5);
        this.SetExpansion(StyleFire(COLOR1, COLOR2, this.DELAY, this.SPEED,
            FireConfig(this.BASE, this.RAND, this.COOLING),
            FireConfig(this.BASE, this.RAND, this.COOLING),
            FireConfig(this.BASE, this.RAND, this.COOLING),
            FireConfig(this.BASE, this.RAND, this.COOLING)));
    }
}

function StaticFire(COLOR1, COLOR2, DELAY, SPEED, BASE, RAND, COOLING) {
    return new StaticFireClass(COLOR1, COLOR2, DELAY, SPEED, BASE, RAND, COOLING);
}
