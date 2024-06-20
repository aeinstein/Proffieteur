class TriggerClass extends FUNCTION {
    constructor(EFFECT, FADE_IN_MILLIS, SUSTAIN_MILLIS, FADE_OUT_MILLIS, DELAY_MILLIS) {
        super("When EFFECT occurs, DELAY_MILLIS controls a pause, then we ramp up from 0 to 32768, stay there for SUSTAIN_MILLIS, then ramp down again.", arguments);
        this.add_arg("EFFECT", "EFFECT", "Trigger event");
        this.add_arg("FADE_IN_MILLIS", "FUNCTION", "How long it takes to ramp to 32768");
        this.add_arg("SUSTAIN_MILLIS", "FUNCTION", "Stay at 32768 for this long.");
        this.add_arg("FADE_OUT_MILLIS", "FUNCTION", "How long it takes to ramp back down to zero.");
        this.add_arg("DELAY_MILLIS", "FUNCTION", "How long to delay before trigger starts.", Int(0));

        this.trigger_state = TRIGGER_OFF;
        console.log("EFFECT INIT");
        this.effect = new OneshotEffectDetector(this.EFFECT);
        this.start_time = 0;
    }

    run(blade) {
        super.run(blade);
        if (this.effect.Detect(blade)) {
            this.start_time = micros();
            this.trigger_state = TRIGGER_DELAY;
        }
        if (this.trigger_state == this.TRIGGER_OFF) {
            this.value = 0;
            return;
        }
        var t = micros() - this.start_time;
        while (true) {
            var micros_for_state = this.get_millis_for_state() * 1000;
            if (t < micros_for_state) {
                switch (this.trigger_state) {
                    case TRIGGER_DELAY:
                        this.value = 0;
                        return;
                    case TRIGGER_ATTACK:
                        this.value = t * 32768.0 / micros_for_state;
                        return;
                    case TRIGGER_SUSTAIN:
                        this.value = 32768;
                        return;
                    case TRIGGER_RELEASE:
                        this.value = 32768 - t * 32768 / micros_for_state;
                        return;
                    case TRIGGER_OFF:
                        this.value = 0;
                        return;
                }
            }
            if (this.TRIGGER_STATE >= 4) throw "Weird state?";
            this.trigger_state++;
            t -= micros_for_state;
            this.start_time += micros_for_state;
        }
    }

    get_millis_for_state() {
        switch (this.trigger_state) {
            case TRIGGER_DELAY:
                return this.DELAY_MILLIS.getInteger(0);
            case TRIGGER_ATTACK:
                return this.FADE_IN_MILLIS.getInteger(0);
            case TRIGGER_SUSTAIN:
                return this.SUSTAIN_MILLIS.getInteger(0);
            case TRIGGER_RELEASE:
                return this.FADE_OUT_MILLIS.getInteger(0);
            case TRIGGER_OFF:
        }
        return 10000000;
    }

    getInteger(led) {
        return this.value;
    }

    IS_RUNNING() {
        return this.trigger_state != TRIGGER_OFF;
    }
};

function Trigger(EFFECT, FADE_IN_MILLIS, SUSTAIN_MILLIS, FADE_OUT_MILLIS, DELAY_MILLIS) {
    return new TriggerClass(EFFECT, FADE_IN_MILLIS, SUSTAIN_MILLIS, FADE_OUT_MILLIS, DELAY_MILLIS);
}