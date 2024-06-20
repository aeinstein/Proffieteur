class RandomBlinkFClass extends FUNCTION {
    constructor(MILLIHZ) {
        super("Blink each LED randomly MILLIHZ times per second.", arguments);
        this.add_arg("MILLIHZ", "FUNCTION", "how often to blink");
        this.last_update = 0;
        this.state = [];
    }

    run(blade) {
        super.run(blade);
        const now = micros();

        if (now - this.last_update > 1000000000 / this.MILLIHZ.getInteger(0)) {
            this.last_update = now;
            for (let i = 0; i < blade.num_leds(); i++) {
                this.state[i] = random(2);
            }
        }
    }

    getInteger(led) {
        return this.state[led] ? 32768 : 0;
    }
}

function RandomBlinkF(millihz) {
    return new RandomBlinkFClass(millihz);
}