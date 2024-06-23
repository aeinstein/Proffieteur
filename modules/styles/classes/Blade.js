class Blade {
    constructor() {
        this.effects_ = [];
    }

    is_on() {
        return STATE_ON;
    }

    num_leds() {
        return STATE_NUM_LEDS;
    }

    addEffect(type, location) {
        console.log("Add effect " + type + " @ " + location);
        this.effects_.push(new BladeEffect(type, micros(), location));
    }

    GetEffects() {
        while (this.effects_.length > 0 && micros() - this.effects_[0].start_micros >= 5000000) {
            this.effects_.shift();
        }
        return this.effects_;
    }
}