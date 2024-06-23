class RgbCycleClass extends STYLE {
    constructor() {
        super();
        this.n = 0;
    }

    run(blade) {
        this.n++;
        if (this.n >= 3) this.n = 0;
        if (this.n === 0) this.RET = Rgb(255, 0, 0);
        if (this.n === 1) this.RET = Rgb(0, 255, 0);
        if (this.n === 2) this.RET = Rgb(0, 0, 250);
    }

    getColor(led) {
        return this.RET;
    }

    pp() {
        return this.PP("RgbCycle", "alternates betwen red, green and blue.");
    }
}

function RgbCycle() {
    return new RgbCycleClass();
}