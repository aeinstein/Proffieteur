class VariationClass extends FUNCTION {
    constructor() {
        super("Returns the current variation", arguments);
    }

    getInteger(led) {
        return Variant() & 0x7fff;
    }
};

function Variation() {
    return new VariationClass();
}