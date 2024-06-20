class SyncAltToVarianceFClass extends FUNCTION {
    constructor() {
        super("Synchronizes Alt and Variance.", arguments);
        this.last_ = 0x7fffffff;
    }

    run(blade) {
        super.run(blade)
        if (num_alternatives == 0) return;
        var VAR = MOD(Variant(), num_alternatives);
        if (VAR == this.last_ && Alt() == this.last_) return;
        if (this.last_ == 0x7fffffff) {
            console.log("SYNC FIRST");
            FIND("ALT").value = VAR;
        } else if (VAR != this.last_) {
            console.log("SYNC ALT");
            FIND("ALT").value = VAR;
            blade.addEffect(EFFECT_ALT_SOUND, 0.0);
        } else {
            console.log("SYNC VAR");
            VAR = Alt();
            FIND("VARIANT_VALUE").value = VAR;
        }
        this.last_ = VAR;
    }

    getInteger(led) {
        return 0;
    }
}

function SyncAltToVarianceF() {
    return new SyncAltToVarianceFClass();
}