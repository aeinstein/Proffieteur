class RgbClass extends STYLE {
    constructor(r, g, b, a) {
        super();
        this.r = IntArg(r) / 255.0;
        this.g = IntArg(g) / 255.0;
        this.b = IntArg(b) / 255.0;
        if (this.r < 0) throw "Red is negative";
        if (this.g < 0) throw "Blue is negative";
        if (this.b < 0) throw "Green is negative";
        if (this.r > 1.0) throw "Red too big.";
        if (this.g > 1.0) throw "Green too big.";
        if (this.b > 1.0) throw "Blue too big.";
        if (a == undefined) {
            this.a = 1.0;
            this.name = colorNames[r + "," + g + "," + b]
        } else {
            this.a = a;
        }
    }

    run(blade) {
    }

    getColor(led) {
        return this;
    }

    pp() {
        if (this.name) return this.PPshort(this.name, "Color");
        return this.PPshort("Rgb", "RGB Color",
            Math.round(this.r * 255), "Red component",
            Math.round(this.g * 255), "Green component",
            Math.round(this.b * 255), "Blue component");
    }

    mix(other, blend) {
        const ret = new RgbClass(0, 0, 0);
        ret.r = other.r * blend + this.r * (1.0 - blend);
        ret.g = other.g * blend + this.g * (1.0 - blend);
        ret.b = other.b * blend + this.b * (1.0 - blend);
        ret.a = other.a * blend + this.a * (1.0 - blend);
        return ret;
    }

    multiply(v) {
        const ret = new RgbClass(0, 0, 0);
        ret.r = this.r * v;
        ret.g = this.g * v;
        ret.b = this.b * v;
        ret.a = this.a * v;
        return ret;
    }

    paintOver(other) {
        const ret = new RgbClass(0, 0, 0);
        ret.r = this.r * (1.0 - other.a) + other.r;
        ret.g = this.g * (1.0 - other.a) + other.g;
        ret.b = this.b * (1.0 - other.a) + other.b;
        ret.a = this.a * (1.0 - other.a) + other.a;
        return ret;
    }

// angle = 0 - 98304 (32768 * 3) (non-inclusive)
    rotate(angle) {
        let H;
        if (angle === 0) return this;
        const MAX = max(this.r, this.g, this.b);
        const MIN = min(this.r, this.g, this.b);

        const C = MAX - MIN;
        if (C === 0) return this;  // Can't rotate something without color.
// Note 16384 = 60 degrees.
        if (this.r === MAX) {
// r is biggest
            H = (this.g - this.b) / C;
        } else if (this.g === MAX) {
// g is biggest
            H = (this.b - this.r) / C + 2;
        } else {
// b is biggest
            H = (this.r - this.g) / C + 4;
        }
        H += angle / 16384.0;
        return new RgbClass(f(5 + H, C, MAX), f(3 + H, C, MAX), f(1 + H, C, MAX));
    }

    argify(state) {
        if (state.color_argument) {
            let ret = RgbArg_(ArgumentName(state.color_argument), this);
            state.color_argument = false;
            return ret;
        } else {
            return this;
        }
    }
}
