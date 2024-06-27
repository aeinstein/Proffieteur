class BladeEffect {
    constructor(type, start_micros, location) {
        this.type = type;
        this.start_micros = start_micros;
        this.location = location;
        this.wavnum = random(10);
    }
}