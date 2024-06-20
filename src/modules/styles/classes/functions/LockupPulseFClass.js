class LockupPulseFClass extends FUNCTION {
    constructor() {
        super("32768 if specified lockup type, 0 otherwise.", arguments);
        this.add_arg("LOCKUP_TYPE", "LOCKUP_TYPE", "Lockup type");
        this.value_ = 0;
    }

    run(blade) {
        super.run(blade)
        if (STATE_LOCKUP == this.LOCKUP_TYPE) {
            this.value_ = 32768;
        } else {
            this.value_ = 0;
        }
    }

    getInteger(led) {
        return this.value_;
    }
}

function LockupPulseF(LOCKUP_TYPE) {
    return new LockupPulseFClass(LOCKUP_TYPE);
}