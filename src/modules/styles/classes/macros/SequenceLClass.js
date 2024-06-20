class SequenceLClass extends MACRO {
    constructor(ARGS) {
        super("Pre-defined sequence", ARGS);
        this.add_arg("COLOR", "COLOR", "Color if bit is 2");
        this.add_arg("MILLIS_PER_BIT", "INT", "Milliseconds per bit.");
        this.add_arg("BITS", "INT", "total bits");
        for (let i = 0; i < this.BITS; i += 16) {
            this.add_arg("BITS" + i, "INT", "Bit sequence " + ((i / 16) + 1));
        }
        this.SetExpansion(AlphaL(this.COLOR, new SequenceFClass(ARGS.slice(1))));
    }
}

function SequenceL(COLOR2, MILLIHZ_PER_BIT, BITS, SEQUENCE) {
    return new SequenceLClass(Array.from(arguments));
}