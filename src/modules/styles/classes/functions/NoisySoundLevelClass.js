class NoisySoundLevelClass extends FUNCTION {
    constructor() {
        super("Noisy sound level.", arguments);
    }

    run(blade) {
        this.var_ = (Math.random() * Math.random()) * 32768;
    }

    getInteger(led) {
        return this.var_;
    }
};

function NoisySoundLevel() {
    return new NoisySoundLevelClass();
}