class Rgb16Class extends RgbClass {
    constructor(r, g, b) {
        super(r * 255.0 / 65535.0, g * 255.0 / 65535.0, b * 255.0 / 65535.0);
//    this.name = colorNames[r+","+g+","+b]
//    this.name
    }

    run(blade) {
    }

    getColor(led) {
        return this;
    }

    pp() {
        if (this.name) return this.PPshort(this.name, "Color");
        return this.PPshort("Rgb16", "RGB Color",
            Math.round(this.r * 65535), "Red component",
            Math.round(this.g * 65535), "Green component",
            Math.round(this.b * 65535), "Blue component");
    }
}

function Rgb16(r, g, b) {
    return new Rgb16Class(r, g, b);
}
