class LockupTrLClass extends STYLE {
    constructor(COLOR, BeginTr, EndTr, LOCKUP_TYPE) {
        super("Transition based lockup effect.", arguments);
        this.add_arg("COLOR", "COLOR", "Effect color.");
        this.add_arg("BEGIN_TR", "TRANSITION", "Begin lockup transition.");
        this.add_arg("END_TR", "TRANSITION", "End lockup transition.");
        this.add_arg("LOCKUP_TYPE", "LOCKUP_TYPE", "Lockup type");
        this.add_arg("CONDITION", "FUNCTION", "Lockup is postponed if conditition is zero.", Int(1));
        HandleLockup(LOCKUP_TYPE);
        this.active = "inactive";
        this.begin_active = false;
        this.end_active = false;
    }

    run(blade) {
        super.run(blade);
        switch (this.active) {
            case "inactive":
                if (STATE_LOCKUP === this.LOCKUP_TYPE) {
                    if (this.CONDITION.getInteger(0)) {
                        this.active = "active";
                        this.BEGIN_TR.begin();
                        this.begin_active = true;
                    } else {
                        this.active = "skipped";
                    }
                }
                break;
            case "active":
                if (STATE_LOCKUP !== this.LOCKUP_TYPE) {
                    this.END_TR.begin();
                    this.end_active = true;
                    this.active = "inactive";
                }
                break;
            case "skipped":
                if (STATE_LOCKUP !== this.LOCKUP_TYPE) {
                    this.active = "inactive";
                }
                break;
        }


        if (this.begin_active) {
            this.BEGIN_TR.run(blade);
            if (this.BEGIN_TR.done()) this.begin_active = false;
        }
        if (this.end_active) {
            this.END_TR.run(blade);
            if (this.END_TR.done()) this.end_active = false;
        }
    }

    runBegin(a, b, led) {
        if (this.begin_active) {
            return this.BEGIN_TR.getColor(a, b, led);
        } else {
            return b;
        }
    }

    runEnd(a, b, led) {
        if (this.end_active) {
            return this.END_TR.getColor(a, b, led);
        } else {
            return b;
        }
    }

    getColor(led) {
        var off_color = Transparent();
        if (!this.begin_active && !this.end_active) {
            if (this.active == "active") {
                return this.COLOR.getColor(led);
            } else {
                return off_color;
            }
        } else {
            var on_color = this.COLOR.getColor(led);
            if (this.active == "active") {
                return this.runBegin(this.runEnd(on_color, off_color, led), on_color, led);
            } else {
                return this.runEnd(this.runBegin(off_color, on_color, led), off_color, led);
            }
        }
    }

    IS_RUNNING() {
        return this.active == "active";
    }

    argify(state) {
        state.color_argument = lockup_to_argument(this.LOCKUP_TYPE);
        var ret = super.argify(state);
        state.color_argument = null;
        return ret;
    }
};

function LockupTrL(COLOR, BeginTr, EndTr, LOCKUP_TYPE, CONDITION) {
    return new LockupTrLClass(COLOR, BeginTr, EndTr, LOCKUP_TYPE, CONDITION);
}