class TRANSITION_BASE extends TRANSITION {
    constructor(comment, args) {
        super(comment, args);
        this.add_arg("MILLIS", "TIME_FUNCTION", "transition time in milliseconds");
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
            this.start_millis_ = millis();
            this.len_ = this.MILLIS.getInteger(0);
            this.restart_ = false;
        }
    }

    update(scale) {
        if (this.len_ == 0) return scale;
        var ms = millis() - this.start_millis_;
        if (ms > this.len_) {
            this.len_ = 0;
            return scale;
        }
        var ret = AddBend(this.MILLIS, ms, this.len_, scale);
        return ret;
    }

    restart() {
        return this.restart_;
    }
};
