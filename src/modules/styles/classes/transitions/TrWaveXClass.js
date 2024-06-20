class TrWaveXClass extends TRANSITION {
    constructor(COLOR, FADEOUT_MS, WAVE_SIZE, WAVE_MS, WAVE_CENTER) {
        super("Wave travelling outwards.", arguments);
        this.add_arg("COLOR", "COLOR", "Wave color.");
        this.add_arg("FADEOUT_MS", "FUNCTION", "Fadeout time in milliseconds.", Int(200));
        this.add_arg("WAVE_SIZE", "FUNCTION", "Wave size.", Int(100));
        this.add_arg("WAVE_MS", "FUNCTION", "Wave millis.", Int(400));
        this.add_arg("WAVE_CENTER", "FUNCTION", "Wave center.", Int(16384));
        this.restart_ = false;
        this.start_millis = 0;
        this.len_ = 0;
    }

    begin() {
        this.restart_ = true;
    }

    done() {
        return this.len_ == 0;
    }

    run(blade) {
        super.run(blade);

        if (this.restart_) {
            this.center_ = this.WAVE_CENTER.getInteger(0);
            this.size_ = this.WAVE_SIZE.getInteger(0);

            this.start_millis_ = millis();
            this.len_ = this.FADEOUT_MS.getInteger(0);
            this.restart_ = false;
        }

        this.mix_ = 32768 - this.update(32768);
        this.num_leds_ = blade.num_leds();
        this.offset_ = (millis() - this.start_millis_) * 32768 / this.WAVE_MS.getInteger(0);
    }

    getColor(A, B, led) {
        var dist = Math.abs(this.center_ - led * 32768 / this.num_leds_);
        var N = Math.abs(dist - this.offset_) * this.size_ >> 15;
        var mix;
        if (N <= 32) {
            mix = blast_hump[N] * this.mix_ >> 8;
        } else {
            mix = 0;
        }
        return A.mix(this.COLOR.getColor(led), mix / 32768.0);
    }

    update(scale) {
        if (this.len_ == 0) return scale;
        var ms = millis() - this.start_millis_;
        if (ms > this.len_) {
            this.len_ = 0;
            return scale;
        }
        return ms * scale / this.len_;
    }
};

function TrWaveX(COLOR, FADEOUT_MS, WAVE_SIZE, WAVE_MS, WAVE_CENTER) {
    return new TrWaveXClass(COLOR, FADEOUT_MS, WAVE_SIZE, WAVE_MS, WAVE_CENTER);
}