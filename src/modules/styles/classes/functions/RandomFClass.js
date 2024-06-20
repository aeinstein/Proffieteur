class RandomFClass extends FUNCTION {
    constructor(A, B) {
        super("Random number 0 - 32768.", arguments);
    }

    run(blade) {
        this.var_ = Math.random() * 32768;
    }

    getInteger(led) {
        return this.var_;
    }
}

function RandomF() {
    return new RandomFClass();
}