class SmoothSoundLevelClass extends FUNCTION {
    constructor() {
        super("Noisy sound level.", arguments);
        this.var_ = 0.0;
    }

    run(blade) {
        var v = Math.random() * 20000.0;
        v *= v;
        this.var_ = (this.var_ + v) / 100.0;
    }

    getInteger(led) {
        return this.var_;
    }
};

function SmoothSoundLevel() {
    return new SmoothSoundLevelClass();
}