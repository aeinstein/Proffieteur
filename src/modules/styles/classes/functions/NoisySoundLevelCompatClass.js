class NoisySoundLevelCompatClass extends FUNCTION {
    constructor() {
        super("Noisy sound level.", arguments);
    }

    run(blade) {
        this.var_ = clamp((Math.random() * Math.random()) * 32768 * 2, 0, 32768);
    }

    getInteger(led) {
        return this.var_;
    }
};

function NoisySoundLevelCompat() {
    return new NoisySoundLevelCompatClass();
}