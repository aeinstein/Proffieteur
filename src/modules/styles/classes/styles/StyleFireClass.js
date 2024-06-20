class StyleFireClass extends STYLE {
    constructor(COLOR1, COLOR2, DELAY, SPEED, NORM, CLASH, LOCK, OFF) {
        super("Too complicated to describe briefly", Array.from(arguments));
        this.add_arg("COLOR1", "COLOR", "Warm color");
        this.add_arg("COLOR2", "COLOR", "Hot color");
        this.add_arg("DELAY", "INT", "Delay", 0);
        this.add_arg("SPEED", "INT", "Speed", 2);
        this.add_arg("NORM", "FireConfig", "Config when on", FireConfigI(0, 2000, 5));
        this.add_arg("CLASH", "FireConfig", "Config during clash", FireConfigI(3000, 0, 0));
        this.add_arg("LOCK", "FireConfig", "Config during lockup", FireConfigI(0, 5000, 10));
        this.add_arg("OFF", "FireConfig", "Config when off", FireConfigI(0, 0, this.NORM.cooling.value));
        this.heat = new Uint16Array(144 + 13);
        this.state = FIRE_STATE_OFF;
        this.last_update = 0;
        this.clash_detector_ = new OneshotEffectDetector(EFFECT_CLASH);
    }

    On(blade) {
        if (!blade.is_on()) {
            this.state = FIRE_STATE_OFF;
            return false;
        }
        if (this.state == FIRE_STATE_OFF) {
            this.state = FIRE_STATE_ACTIVATING;
            this.on_time = millis();
        }
        if (this.state = FIRE_STATE_ACTIVATING) {
            if (millis() - this.on_time < this.DELAY) return false;
            this.state = FIRE_STATE_ON;
        }
        return true;
    }

    run(blade) {
        let i;
        super.run(blade);
        const m = millis();
        if (m - this.last_update < 10)
            return;
        if (m - this.last_update < 40) {
            this.last_update += 10;
            ;
        } else {
            this.last_update = m;
        }
        const num_leds = blade.num_leds();
        this.num_leds = num_leds;
        let conf = this.OFF;
        if (this.clash_detector_.Detect(blade)) {
            conf = this.CLASH;
        } else if (this.On(blade)) {
            if (STATE_LOCKUP === 0) {
                conf = this.NORM;
            } else {
                conf = this.LOCK;
            }
        }

        for (i = 0; i < this.SPEED; i++) {
            this.heat[num_leds + i] = conf.intensity_base +
                random(random(random(conf.intensity_rand)));
        }
        for (i = 0; i < num_leds; i++) {
            let x = (this.heat[i + this.SPEED - 1] * 3 + this.heat[i + this.SPEED] * 10 + this.heat[i + this.SPEED + 1] * 3) >> 4;
            x -= random(conf.cooling);
            this.heat[i] = max(0, min(x, 65535));
        }
    }

    getColor(led) {
        const h = this.heat[this.num_leds - 1 - led];

        if (h < 256) {
            return BLACK.mix(this.COLOR1.getColor(led), h / 255.0);
        } else if (h < 512) {
            return this.COLOR1.getColor(led).mix(this.COLOR2.getColor(led), (h - 256) / 255.0);
        } else if (h < 768) {
            return this.COLOR2.getColor(led).mix(WHITE, (h - 512) / 255.0);
        } else {
            return WHITE;
        }
    }
}

function StyleFire(COLOR1, COLOR2, DELAY, SPEED, NORM, CLASH, LOCK, OFF) {
    return new StyleFireClass(COLOR1, COLOR2, DELAY, SPEED, NORM, CLASH, LOCK, OFF);
}
