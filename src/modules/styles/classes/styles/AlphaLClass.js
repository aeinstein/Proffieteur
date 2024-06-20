class AlphaLClass extends STYLE {
    isEffect() {
        return this.ALPHA.isEffect();
    }

    constructor(COLOR, ALPHA) {
        super("Makes transparent color", Array.from(arguments));
        this.add_arg("COLOR", "COLOR", "COLOR");
        this.add_arg("ALPHA", "FUNCTION", "Alpha function");
    }

    getColor(led) {
        const ret = this.COLOR.getColor(led);
        if (ret === 0) return Transparent(0, 0, 0);
        return ret.multiply(this.ALPHA.getInteger(led) / 32768.0)
    }

    IS_RUNNING() {
        if (this.ALPHA.IS_RUNNING)
            return this.ALPHA.IS_RUNNING();
        if (this.COLOR.IS_RUNNING)
            return this.COLOR.IS_RUNNING();
        return false;
    }
}

function AlphaL(COLOR, ALPHA) {
    return new AlphaLClass(COLOR, ALPHA);
}