class BatteryLevelClass extends FUNCTION {
    constructor() {
        super("Returns 0-32768 based on battery level.", []);
    }

    run(blade) {
    }

    getInteger(led) {
        return 32768 - ((millis() * 3) & 0x7fff);
    }
};

function BatteryLevel() {
    return new BatteryLevelClass();
}