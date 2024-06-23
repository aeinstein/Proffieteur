class TrDoEffectXClass extends TRANSITION {
    constructor(TRANSITION, EFFECT, WAVNUM, LOCATION) {
        super("Do effect", arguments);
        this.add_arg("TRANSITION", "TRANSITION", "Wrapped transition");
        this.add_arg("EFFECT", "EFFECT", "Effect to trigger.");
        this.add_arg("WAVNUM", "FUNCTION", "Select wave number.", Int(-1));
        this.add_arg("LOCATION", "FUNCTION", "Effect location.", Int(-1));
        this.begin_ = false;
        this.done_ = false;
    }

    begin() {
        this.TRANSITION.begin();
        this.begin_ = true;
        this.done_ = false;
    }

    run(blade) {
        super.run(blade);
        if (this.begin_) {
            if (blade.is_on()) {
                var location = this.LOCATION.getInteger(0);
                if (location == -1) location = random(32768) / 32768.0;
                blade.addEffect(this.EFFECT.value, location);
            }
            this.begin_ = false;
        }
        if (!this.done_) {
            /*
    if (!blade.is_on() && !blade.is_powered()) {
      this.done_ = true;
    }
  */
        }
    }

    done() {
        return this.done_ || this.TRANSITION.done();
    }

    getColor(a, b, led) {
        if (this.done_) return b;
        return this.TRANSITION.getColor(a, b, led);
    }
}

function TrDoEffectX(TRANSITION, EFFECT, WAVNUM, LOCATION) {
    return new TrDoEffectXClass(TRANSITION, EFFECT, WAVNUM, LOCATION);
}