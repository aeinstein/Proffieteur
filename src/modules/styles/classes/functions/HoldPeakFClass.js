class HoldPeakFClass extends FUNCTION {
    constructor(F, HOLD_MILLIS, SPEED) {
        super("Holds peak values for the given number of millis, then falls at given speed.", arguments);
        this.add_arg("F", "FUNCTION", "Function to process");
        this.add_arg("HOLD_MILLIS", "FUNCTION", "Millis to hold.");
        this.add_arg("SPEED", "FUNCTION", "Decay speed (per second)");
        this.last_micros = micros();
        this.last_peak = 0;
        this.value = 0;
    }

    run(blade) {
        super.run(blade);
        var current = this.F.getInteger(0);
        var hold_millis = this.HOLD_MILLIS.getInteger(0);
        var now = micros();
        var delta = now - this.last_micros;
        this.last_micros = now;
        if (millis() - this.last_peak > hold_millis) {
            if (delta > 1000000) delta = 1;
            delta *= this.SPEED.getInteger(0);
            delta /= 1000000;
            this.value -= delta;
        }
        if (current > this.value) {
            this.value = current;
            this.last_peak = millis();
        }
    }

    getInteger(led) {
        return this.value;
    }
}

function HoldPeakF(F, HOLD_MILLIS, SPEED) {
    return new HoldPeakFClass(F, HOLD_MILLIS, SPEED);
}