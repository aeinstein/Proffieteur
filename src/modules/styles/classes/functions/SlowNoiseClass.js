class SlowNoiseClass extends FUNCTION {
    constructor(SPEED) {
        super("Returns a value between 0 and 32768, which slowly changes up and down randomly.", Array.from(arguments));
        this.add_arg("SPEED", "FUNCTION", "Change speed");
        this.value = random(32768);
    }

    run(blade) {
        super.run(blade);
        var now = millis();
        var delta = now - this.last_millis;
        this.last_millis = now;
        if (delta > 100) delta = 1;
        var speed = this.SPEED.getInteger(0);
//    console.log("DELTA = " + delta + " SPEED = " + speed + " VALUE="+this.value);
        while (delta > 0) {
            this.value = clamp(this.value + random(speed * 2 + 1) - speed, 0, 32768);
            delta--;
        }
    }

    getInteger(led) {
        return this.value;
    }
};

function SlowNoise(SPEED) {
    return new SlowNoiseClass(SPEED);
}