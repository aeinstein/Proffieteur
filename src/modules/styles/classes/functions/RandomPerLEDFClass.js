class RandomPerLEDFClass extends FUNCTION {
    constructor() {
        super("Returns random 0-32768.", arguments);
    }

    getInteger(led) {
        return random(32768);
    }
}

function RandomPerLEDF() {
    return new RandomPerLEDFClass();
}