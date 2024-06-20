class ReverseTimeClass extends MACRO {
    constructor(MILLIS) {
        super("Reverse time in transitions.", arguments);
        this.add_arg("MILLIS", "INT", "millis");
        this.SetExpansion(ReverseTimeX(Int(MILLIS)));
    }
}

function ReverseTime(MILLIS) {
    return new ReverseTimeClass(MILLIS);
}