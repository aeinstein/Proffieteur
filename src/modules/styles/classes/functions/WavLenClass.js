class WavLenClass extends FUNCTION {
    constructor() {
        super("Length of associated wav file in MS", arguments);
        this.add_arg("EFFECT", "EFFECT", "Which effect to get the length of.", EFFECT(EFFECT_NONE));
    }

    getInteger(led) {
        return 500;
    }
};

function WavLen(EFFECT) {
    return new WavLenClass(EFFECT);
}