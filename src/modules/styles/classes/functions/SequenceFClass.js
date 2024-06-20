class SequenceFClass extends FUNCTION {
    constructor(ARGS) {
        super("Pre-defined sequence of 0 and 32768", ARGS);
        this.add_arg("MILLIS_PER_BIT", "INT", "Milliseconds per bit.");
        this.add_arg("BITS", "INT", "total bits");
        for (let i = 0; i < this.BITS; i += 16) {
            this.add_arg("BITS" + i, "INT", "Bit sequence " + ((i / 16) + 1));
        }
        this.SEQUENCE = Array.from(ARGS).slice(2);
    }

    run(blade) {
        super.run(blade);
        const now = millis();
        const bit = (now / this.MILLIS_PER_BIT) % min(this.BITS, this.SEQUENCE.length * 16);
        this.on = !!(this.SEQUENCE[bit >> 4] >> ((~bit) & 0xf) & 1)
    }

    getInteger(led) {
        return this.on ? 32768 : 0;
    }
}

function SequenceF(MILLIHZ_PER_BIT, BITS, SEQUENCE) {
    return new SequenceFClass(Array.from(arguments));
}