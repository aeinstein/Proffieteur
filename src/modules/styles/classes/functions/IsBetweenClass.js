class IsBetweenClass extends FUNCTION {
    constructor(F, BOTTOM, TOP) {
        super("Returns 32768 if BOTTOM < F < TOP, 0 otherwise.", arguments);
        this.add_arg("F", "FUNCTION", "F");
        this.add_arg("BOTTOM", "FUNCTION", "BOTTOM");
        this.add_arg("TOP", "FUNCTION", "TOP");
    }

    getInteger(led) {
        var f = this.F.getInteger(led);
        return this.BOTTOM.getInteger(led) < f && f < this.TOP.getInteger(led) ? 32768 : 0;
    }
};

function IsBetween(F, BOTTOM, TOP) {
    return new IsBetweenClass(F, BOTTOM, TOP);
}