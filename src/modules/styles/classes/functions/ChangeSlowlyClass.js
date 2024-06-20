class ChangeSlowlyClass extends FUNCTION {
    constructor(F, SPEED) {
        super("Changes F by no more than SPEED values per second.", arguments);
        this.add_arg("F", "FUNCTION", "Function to moderate");
        this.add_arg("SPEED", "FUNCTION", "maximum change speed");
        this.last_micros = micros();
        this.value = 0;
    }

    run(blade) {
        super.run(blade);
        var now = micros();
        var delta = now - this.last_micros;
        if (delta > 1000000) delta = 1;
        this.last_micros = now;
        delta *= this.SPEED.getInteger(0);
        delta /= 1000000;
        var target = this.F.getInteger(0);
        if (delta > Math.abs(this.value - target)) {
            this.value = target;
        } else if (this.value < target) {
            this.value += delta;
        } else {
            this.value -= delta;
        }
    }

    getInteger(led) {
        return this.value;
    }
}

function ChangeSlowly(F, SPEED) {
    return new ChangeSlowlyClass(F, SPEED);
}