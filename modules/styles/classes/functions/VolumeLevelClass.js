class VolumeLevelClass extends FUNCTION {
    constructor() {
        super("Returns 0-32768 based on volume level.", []);
    }

    run(blade) {
    }

    // getInteger(led) { return 0 + ((millis() * 7) & 0x7fff); }
    getInteger(led) {
        return 0 + ((millis() / 500) % 11) * 32767 / 10;
    }
};

function VolumeLevel() {
    return new VolumeLevelClass();
}