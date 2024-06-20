
class RetractionDelayXClass extends STYLE {
    constructor(DELAY_MILLIS, BASE) {
        super("Delays retraction by DELAY_MILLIS", Array.from(arguments));
        this.add_arg("DELAY_MILLIS", "FUNCTION", "Ignition delay, in milliseconds");
        this.add_arg("BASE", "COLOR", "Blade style");
    }

    is_on() {
        return this.is_on_;
    }

    num_leds() {
        return this.blade.num_leds()
    }

    GetEffects() {
        return this.blade.GetEffects();
    }

    run(blade) {
        this.DELAY_MILLIS.run(blade);
        const delay_millis = this.DELAY_MILLIS.getInteger(0);

        this.blade = blade;
        if (!blade.is_on()) {
            if (!this.waiting) {
                this.waiting = true;
                this.wait_start_time = millis();
            }
            const waited = millis() - this.wait_start_time;
            if (waited > delay_millis) {
                this.is_on_ = false;
                this.wait_start_time = millis() - delay_millis - 1;
            }
        } else {
            this.waiting = false;
            this.is_on_ = true;
        }
        this.BASE.run(this)
    }

    getColor(led) {
        return this.BASE.getColor(led);
    }
}

function RetractionDelayX(millis, base) {
    return new RetractionDelayXClass(millis, base);
}