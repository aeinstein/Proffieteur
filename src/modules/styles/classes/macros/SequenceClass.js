class SequenceClass extends MACRO {
    constructor(ARGS) {
        super("Pre-defined sequence", ARGS);
        this.add_arg("COLOR1", "COLOR", "Color if bit is 1");
        this.add_arg("COLOR2", "COLOR", "Color if bit is 0");
        this.add_arg("MILLIS_PER_BIT", "INT", "Milliseconds per bit.");
        this.add_arg("BITS", "INT", "total bits");
        for (let i = 0; i < this.BITS; i += 16) {
            this.add_arg("BITS" + i, "INT", "Bit sequence " + ((i / 16) + 1));
        }
        this.SetExpansion(Layers(this.COLOR2, new SequenceLClass([this.COLOR1].concat(ARGS.slice(2)))));
    }
}

function Sequence(COLOR1, COLOR2, MILLIHZ_PER_BIT, BITS, SEQUENCE) {
    return new SequenceClass(Array.from(arguments));
}