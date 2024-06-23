class MyError {
    constructor(desc) {
        this.desc = desc;
        this.begin_pos = -1;
        this.end_pos = -1;
    }

    setBegin(pos) {
        this.begin_pos = pos;
        return this;
    }

    setEnd(pos) {
        this.end_pos = pos;
        return this;
    }

    setArg(arg) {
        if (arg && arg.__end_pos) {
            this.begin_pos = arg.__begin_pos;
            this.end_pos = arg.__end_pos;
        }
        return this;
    }

    setThis(arg) {
        if (arg && arg.__end_pos && this.begin_pos === -1) {
            this.begin_pos = arg.__begin_pos;
            this.end_pos = arg.__end_pos;
        }
        return this;
    }

    valueOf() {
        return this.desc;
    }
}
