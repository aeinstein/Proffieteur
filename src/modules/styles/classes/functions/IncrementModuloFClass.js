class IncrementModuloFClass extends FUNCTION {
    constructor(PULSE, MAX, I) {
        super("Increment by I each time PULSE occurs.", arguments);
        this.add_arg("PULSE", "FUNCTION", "Pulse.");
        this.add_arg("MAX", "FUNCTION", "Max value", Int(32768));
        this.add_arg("I", "FUNCTION", "Increment", Int(1));
        this.value = 0;
    }

    run(blade) {
        super.run(blade);
        if (this.PULSE.getInteger(0)) {
            this.value = (this.value + this.I.getInteger(0)) % this.MAX.getInteger(0);
        }
    }

    getInteger(led) {
        return this.value;
    }
}

function IncrementModuloF(PULSE, MAX, I) {
    return new IncrementModuloFClass(PULSE, MAX, I);
}