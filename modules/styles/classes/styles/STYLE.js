class STYLE {
    constructor(comment, args) {
        this.comment = comment;
// if (args) console.log(args);
        this.args = args;
        this.argnum = 0;
        this.argdefs = [];
        this.super_short_desc = false;
        this.ID = next_id;
        next_id++;
    }

    add_arg(name, expected_type, comment, default_value) {
        if (focus_trace[0] == this.args[this.argnum]) {
            focus_trace = [this, name, expected_type, focus_trace];
        }
//     console.log("add_arg");
//     console.log(name);
//     console.log(this.args);
//     console.log(default_value);
        try {
            this[name] = Arg(expected_type, this.args[this.argnum], default_value);
//       console.log(this[name]);
        } catch (e) {
            if (typeof (e) == "string") {
                e = new MyError(e + " for argument " + (this.argnum + 1) + " (" + name + ")");
                e.setArg(this.args[this.argnum]);
            }
            throw e;
        }
        this.argnum++;
        this.argdefs.push(new ARG(name, expected_type, comment, default_value));
    }

    get_id() {
        style_ids[this.ID] = this;
        return this.ID;
    }

    DOCOPY() {
        pp_is_url++;
        const url = this.pp();
        pp_is_url--;
        const parser = new Parser(url, classes, identifiers);
        let ret = parser.parse();
        ret.COMMENT = this.COMMENT;
        return ret;
    }

    call_pp_no_comment(arg) {
        const C = arg.COMMENT;
        arg.COMMENT = null;
        let ret;
        try {
            ret = arg.pp();
        } finally {
            arg.COMMENT = C;
        }
        return ret;
    }

    DescribeValue(arg) {
        if (typeof (arg) == "undefined") return "undefined";
        if (typeof (arg) == "number") {
            return "" + arg;
        } else {
            return arg.pp();
//      return this.call_pp_no_comment(arg);
        }
    }

    Indent(text) {
        return text;
    }

    gencomment() {
        if (!this.COMMENT) return "";
        let ret = this.COMMENT;
        if (ret[ret.length - 1] !== " ") ret += " ";
        ret = "/*" + ret + "*/";
        if (this.COMMENT.split("\n").length > 1) {
            ret += "\n";
        } else {
            ret += " ";
        }
        return ret;
    }

    addcomment(COMMENT) {
        if (!COMMENT) return;
        if (!this.COMMENT) {
            this.COMMENT = COMMENT;
        } else {
            this.COMMENT += "\n" + COMMENT;
        }
    }

    prependcomment(COMMENT) {
        if (!COMMENT) return;
        if (!this.COMMENT) {
            this.COMMENT = COMMENT;
        } else {
            this.COMMENT = COMMENT + "\n" + this.COMMENT;
        }
    }

    PPURL(name, note) {
        if (this.super_short_desc) return "$";
        pp_is_url++;
        let ret = name;
        ret = this.gencomment() + ret;
        let comma = false;
        if (arguments.length > 2 || this.argdefs.length > 0) {
            ret += "<";
            for (let i = 2; i < arguments.length; i += 2) {
                if (comma) ret += ",";
                comma = true;
                const V = this.DescribeValue(arguments[i]);
                const arg = this.Indent(V);
                ret += arg;
            }
            ret += ">";
        }
        pp_is_url--;

        return ret;
    }

    extraButtons(arg) {
        return "";
    }

    PP(name, note) {
        if (pp_is_url) {
            return this.PPURL.apply(this, arguments);
        }
        const id = this.get_id();
        let ret = "";

        if (this.COMMENT) {
            ret += "/* " + this.COMMENT.split("\n").join("<br>") + " */<br>";
            console.log("RET = " + ret);
        }
        ret += "<div id=X" + id + " class='pp-container' onclick='FocusOn(" + id + ",event)'>\n";
        ret += "<span title='" + note + "'>" + name + "</span>&lt;\n";
        ret += "<div class='pp-content'>\n";
        let comma = false;

        for (let i = 2; i < arguments.length; i += 2) {
            if (comma) ret += ",<br>";
            comma = true;
            let arg = arguments[i];
            var note = arguments[i + 1];
            let comment = null;

            if (typeof (arg) == "number") {
                arg = "" + arg;
            } else {
                comment = arg.COMMENT;
                arg = this.call_pp_no_comment(arg);
            }
            if (arg.indexOf("<br>") === -1 && arg.indexOf("<div") === -1 && !comment) {
                ret += arg + " /* " + note + " */\n";

            } else {
                ret += "/* " + note + " */" + this.extraButtons(i / 2) + "<br>\n";
                if (comment) {
                    ret += "/* " + comment + " */<br>\n";
                }
                ret += arg;
            }
        }
        ret += "</div>&gt;</div>\n";

        return ret;
    }

    PPshort(name, note) {
        if (pp_is_url) {
            return this.PPURL.apply(this, arguments);
        }
        const id = this.get_id();
        let ret = this.gencomment();
        ret += "<div id=X" + id + " class='pp-container' onclick='FocusOn(" + id + ",event)'>\n";
        ret += "<span title='" + note + "'>" + name + "</span>\n";

        if (arguments.length > 2) {
            ret += "&lt;";
            let comma = false;

            for (let i = 2; i < arguments.length; i += 2) {
                if (comma) ret += ",";
                comma = true;
                const arg = arguments[i];
                var note = arguments[i + 1];
                if (typeof (arg) == "number") {
                    ret += "<span title='" + note + "'>" + arg + "</span>";
                } else {
                    ret += "<span>/* " + note + " */</span><br>\n";
                    ret += arg.pp();
                }
            }
            ret += "&gt;";
        }
        ret += "</div>\n";

        return ret;
    }

    SameValue(a, b) {
// console.log("SAMEVALUE");
// console.log(a);
// console.log(b);
// console.log(this.DescribeValue(a));
// console.log(this.DescribeValue(b));
        return a === b || this.DescribeValue(a) == this.DescribeValue(b);
    }

    pp() {
        const tmp = [this.constructor.name.replace("Class", ""), this.comment];
        let l = this.argdefs.length;

        if (pp_is_url && !pp_is_verbose) {
// Drop default arguments
            while (l > 0 && this.argdefs[l - 1].default_value != undefined &&
            this.SameValue(this[this.argdefs[l - 1].name], this.argdefs[l - 1].default_value)) l--;
        }
        for (let i = 0; i < l; i++) {
            tmp.push(this[this.argdefs[i].name]);
            tmp.push(this.argdefs[i].comment);
        }
        return this.PP.apply(this, tmp);
    }

    getType() {
        return "COLOR";
    }

    run(blade) {
        for (let i = 0; i < this.argdefs.length; i++) {
            const arg = this[this.argdefs[i].name];
            if (typeof (arg) == "object") arg.run(blade);
        }
    }

    isEffect() {
        for (let i = 0; i < this.argdefs.length; i++) {
            if (this.argdefs[i].type === "EFFECT") return true;
            if (this.argdefs[i].type === "LOCKUP_TYPE") return true;
        }
        return false;
    }

// Doesn't work??
    toString() {
        return this.constructor.name + "[id = " + this.ID + "]";
    }

    set_right_side(right) {
        if (this.argdefs.length !== right.argdefs.length) {
            console.log("SET RIGHT SIDE NON-MATCH");
            return;
        }
        this.right_side = right;
        for (let i = 0; i < this.argdefs.length; i++) {
            if (this.argdefs[i].name !== right.argdefs[i].name) {
                console.log("SET RIGHT SIDE NON-MATCH");
                return;
            }

            const l_arg = this[this.argdefs[i].name];
            const r_arg = right[this.argdefs[i].name];

            if (typeof (l_arg) == "object" && typeof (r_arg) == "object") {
                l_arg.set_right_side(r_arg);
            }
        }
    }

    get_container() {
        let id = this.ID;
        if (this.right_side) id = this.right_side.ID;
        return FIND("X" + id);
    }

    update_displays() {
        for (let i = 0; i < this.argdefs.length; i++) {
            const arg = this[this.argdefs[i].name];
            if (typeof (arg) == "object") arg.update_displays();
        }

        if (this.IS_RUNNING) {
            const container = this.get_container();

            if (container) {
                if (this.IS_RUNNING()) {
                    container.classList.add('running');
                } else {
                    container.classList.remove('running');
                }
            }
        }
    }

    argify(state) {
        for (let i = 0; i < this.argdefs.length; i++) {
            const arg = this[this.argdefs[i].name];
            if (typeof (arg) == "object") {
                this[this.argdefs[i].name] = arg.argify(state);
            }
        }
        return this;
    }
}
