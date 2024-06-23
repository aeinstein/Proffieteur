class AltFClass extends FUNCTION {
    constructor() {
        super("Returns the current alt", arguments);
    }

    getInteger(led) {
        return Alt() & 0x7fff;
    }
};

function AltF() {
    return new AltFClass();
}