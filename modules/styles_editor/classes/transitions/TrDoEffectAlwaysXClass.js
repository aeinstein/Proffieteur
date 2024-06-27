class TrDoEffectAlwaysXClass extends TRANSITION {
    constructor(TRANSITION, EFFECT, WAVNUM, LOCATION) {
        super("Do effect", arguments);
        this.add_arg("TRANSITION", "TRANSITION", "Wrapped transition");
        this.add_arg("EFFECT", "EFFECT", "Effect to trigger.");
        this.add_arg("WAVNUM", "FUNCTION", "Select wave number.");
        this.add_arg("LOCATION", "FUNCTION", "Effect location.");
        this.begin_ = false;
    }

    begin() {
        this.TRANSITION.begin();
        this.begin_ = true;
    }

    run(blade) {
        super.run(blade);
        if (this.begin_) {
            var location = this.LOCATION.getInteger(0);
            if (location == -1) location = random(32768) / 32768.0;
            blade.addEffect(this.EFFECT, location);
            this.begin_ = false;
        }
    }

    done() {
        return this.TRANSITION.done();
    }

    getColor(a, b, led) {
        return this.TRANSITION.getColor(a, b, led);
    }
}

function TrDoEffectAlwaysX(TRANSITION, EFFECT, WAVNUM, LOCATION) {
    return new TrDoEffectAlwaysXClass(TRANSITION, EFFECT, WAVNUM, LOCATION);
}