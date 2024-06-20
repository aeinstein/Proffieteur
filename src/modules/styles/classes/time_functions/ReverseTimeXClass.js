class ReverseTimeXClass extends TIME_FUNCTION {
    constructor(MILLIS) {
        super("Reverses time in a transition.", arguments);
        this.add_arg("MILLIS", "TIME_FUNCTION", "millis");
    }

    getInteger(led) {
        return this.MILLIS.getInteger(led);
    }

    bend(t, len, scale) {
        return scale - AddBend(this.MILLIS, t, len, scale);
    }
}

function ReverseTimeX(MILLIS) {
    return new ReverseTimeXClass(MILLIS);
}