class INTEGER extends STYLE {
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
            return this.gencomment() + this.value;
        }
        return this.PPshort(this.value, "VALUE");
    }

    getType() {
        return "INT";
    }
}
