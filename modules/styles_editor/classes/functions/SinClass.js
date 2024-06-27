class SinClass extends FUNCTION {
    constructor(RPM, LOW, HIGH) {
        super("Pulses between LOW and HIGH RPM times per minute.", arguments);
        this.add_arg("RPM", "FUNCTION", "Revolutions per minute");
        this.add_arg("HIGH", "FUNCTION", "upper output limit", Int(32768));
        this.add_arg("LOW", "FUNCTION", "lower output limit", Int(0));
        this.pos = 0.0;
        this.last_micros = 0;
    }

    run(blade) {
        super.run(blade);
        var now = micros();
        var delta = now - this.last_micros;
        this.last_micros = now;
        this.pos = fract(this.pos + delta / 60000000.0 * this.RPM.getInteger(0));
        var high = this.HIGH.getInteger(0);
        var low = this.LOW.getInteger(0);
        var tmp = Math.sin(this.pos * Math.PI * 2.0) / 2.0;
        this.value = Math.floor((tmp + 0.5) * (high - low) + low);
    }

    getInteger(led) {
        return this.value;
    }
};

function Sin(RPM, LOW, HIGH) {
    return new SinClass(RPM, LOW, HIGH);
}