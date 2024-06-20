class BINARY extends STYLE {
    constructor(v) {
        super();
        this.value = v;
    }

    run(blade) {
    }

    getInteger(led) {
        return this.value;
    }

    valueOf() {
        return this.value;
    }

    pp() {
        if (pp_is_url) {
            if (this.super_short_desc) return "$";
            return this.gencomment() + "0b" + this.value.toString(2);
        }
        return this.PPshort("0b" + this.value.toString(2), "VALUE");
    }

    getType() {
        return "INT";
    }
}
