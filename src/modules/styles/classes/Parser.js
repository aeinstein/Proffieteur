class Parser {
    constructor(str, classes, identifiers) {
        console.log("PARSING: " + str);
        this.str = str;
        this.pos = 0;
        this.classes = classes;
        this.identifiers = identifiers;
    }

    peek() {
        if (this.pos >= this.str.length) return ""
        return this.str[this.pos]
    }

    peek2() {
        if (this.pos + 1 >= this.str.length) return ""
        return this.str[this.pos + 1]
    }

    gobble(c) {
        this.skipspace();
        if (this.peek() == c) {
            this.pos++;
            return true;
        }
        return false;
    }

    expect(c) {
        if (!this.gobble(c)) throw "Missing " + c;
    }

    skipspace2() {
        var start_pos = this.pos;
        while (true) {
            if (this.peek() == ' ' || this.peek() == '\t' || this.peek() == '\n' || this.peek() == '\r') {
                this.pos++;
                continue;
            }
            if (this.peek() == '/') {
                if (this.peek2() == '*') {
                    this.pos += 2;
                    while (this.pos < this.str.length && !(this.peek() == '*' && this.peek2() == '/')) this.pos++;
                    this.pos += 2;
                    continue;
                }
                if (this.peek2() == '/') {
                    this.pos += 2;
                    while (this.pos < this.str.length && this.peek() != '\n') this.pos++;
                    this.pos++;
                    continue;
                }
            }
            return this.str.substr(start_pos, this.pos - start_pos); // trim?
        }
    }

    skipspace() {
        var ret = this.skipspace2();
        if (ret.trim()) {
            console.log("COMMENT DROPPED ON GROUND: " + ret);
            console.trace();
        }
    }

    startswithnewline(str) {
        var tmp = str.trimStart();
        var start = str.substr(0, str.length - tmp.length);
        return start.split('\n').length > 1;
    }

    stripcomment(str) {
        var ret = "";
        while (true) {
            str = str.trim();
            if (str) console.log("STRIPCOMMENT: " + str);
            if (str == "") {
                if (ret) console.log("STRIPCOMMENT -> " + ret);
                return ret;
            }
            if (ret != "") ret += "\n";
            if (str[0] == '/' && str[1] == '/') {
                var tmp = str.split('\n');
                ret += tmp[0].substr(2);
                str = tmp.slice(1).join('\n');
            } else if (str[0] == '/' && str[1] == '*') {
                var tmp = str.split('*/');
                ret += tmp[0].substr(2);
                str = tmp.slice(1).join('*/');
            } else {
                if (ret) console.log("STRIPCOMMENT -> " + ret);
                return ret;
            }
        }
    }

    identifier() {
        let ret = "";

        while (true) {
            const c = this.peek();
            if ((c >= 'a' && c <= 'z') ||
                (c >= 'A' && c <= 'Z') ||
                (c >= '0' && c <= '9') || c === '_' || c === ':') {
                ret += c;
                this.pos++;
            } else {
                return ret;
            }
        }
    }

    parse_optional_string() {
        this.skipspace();
        if (this.peek() !== '"') return null;
        let ret = "";

        while (this.gobble('"')) {
            while (this.peek() !== '"') {
                ret += this.peek();
                this.pos++;
            }
            this.expect('"')
            this.skipspace();
        }
        return ret;
    }

    // recursive descent parser
    parse_atom() {
        this.skipspace();
        const start_of_atom = this.pos;
        const id = this.identifier();

        if (id === "") {
            throw "Expected identifier or number";
        }

        if ((id[0] >= '0' && id[0] <= '9')) {
            if (id.slice(0, 2) === "0b") {
                return new BINARY(parseInt(id.slice(2), 2));
            }
            return new INTEGER(parseInt(id));
        }

        const midcomment = this.skipspace2();
        let args = 0;
        let argstring = 0;

        if (this.peek() === "<") {
            this.pos++;
            let POS = this.pos;
            this.skipspace2();
            args = [null];

            if (this.peek() !== '>') {
                this.pos = POS; // backtrack for comments

                while (true) {
                    const v = this.parse_internal();
                    args.push(v);
                    this.skipspace2();
                    if (this.peek() !== ',') break;
                    this.pos++;
                    POS = this.pos
                    const comment = this.skipspace2();

                    if (this.startswithnewline(comment)) {
                        // Comment belongs to next value.
                        // rewind and let parse_unary do it.
                        this.pos = POS;

                    } else {
                        v.addcomment(this.stripcomment(comment));
                        if (v.COMMENT) console.log("SETCOMMENT:" + v.COMMENT);
                    }
                }
            }
            if (this.peek() !== '>') {
                throw "Missing > or ,";
            }
            this.pos++;
            if (this.peek() === '(') {
                this.pos++;
                argstring = this.parse_optional_string();
                if (this.peek() !== ')') throw "Missing )";
                this.pos++;
            }
        }
        let ret;

        if (this.identifiers[id]) {
            if (args !== 0) {
                throw "Unexpected arguments";
            }

            ret = this.identifiers[id]();
        } else if (this.classes[id]) {
            //console.log(id);
            //console.log(this.classes[id]);
            //console.log(args);
            if (args === 0) args = [null];
            // var ret = new (Function.prototype.bind.apply(this.classes[id], args));

            try {
                ret = classes[id].apply(args[0], args.slice(1));
            } catch (e) {
                if (typeof (e) == "string")
                    e = new MyError(id + ": " + e);
                if (typeof (e) == "object" && e.constructor == MyError)
                    e.desc = id + ": " + e.desc;
                if (typeof (e) == "object" && e.constructor == MyError && e.end_pos == -1) {
                    e.setBegin(start_of_atom);
                    e.setEnd(this.pos);
                }
                throw e;
            }

            // console.log(ret);
            if (argstring) {
                console.log("ARGSTRING : " + argstring);
                ret.argstring = argstring;
            }
        }

        if (!ret) {
            throw "Unknown identifier: " + id;
        }
        ret.addcomment(this.stripcomment(midcomment));
        return ret;
    }

    parse_unary() {
        const pre_comment = this.skipspace2();
        let ret = 0;

        if (this.peek() === '-') {
            this.pos++;
            ret = this.parse_atom();

            if (ret.getType() !== "INT")
                throw "Expected integer, got " + ret.getType();

            ret.value = -ret.value;
            return ret;

        } else {
            ret = this.parse_atom();
        }

        if (pre_comment.trim()) {
            ret.prependcomment(this.stripcomment(pre_comment));
        }
        return ret;
    }

    parse_internal() {
        const ret = this.parse_unary();

        this.skipspace();
        while (this.peek() === '|') {
            this.pos++;
            ret.value |= this.parse_unary();
            this.skipspace();
        }
        //console.log("PARSE, returns ID " + ret.get_id());
        // console.log(ret);
        //    console.trace();

        return ret;
    }

    parse() {
        const OLD = PushHandledTypes();
        const begin_pos = this.pos;
        const ret = this.parse_internal();

        // secret handshake
        ret.__begin_pos = begin_pos;
        ret.__end_pos = this.pos;
        ret.__handled_types = handled_types;
        ret.__handled_lockups = handled_lockups;
        PopHandledTypes(OLD);

        return ret;
    }
}
