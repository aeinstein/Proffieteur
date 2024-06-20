class CONFIG extends STYLE {
    PP(name, note) {
        if (pp_is_url) {
            return this.PPURL.apply(this, arguments);
        }
        const id = this.get_id();
        let ret = "";

        ret += "<span title='" + note + "'>" + name + "</span>&lt;\n";
        ret += "<div style='margin-left:1em'>\n";
        let comma = false;

        for (let i = 2; i < arguments.length; i += 2) {
            if (comma) ret += ",<br>";
            comma = true;
            let arg = arguments[i];
            var note = arguments[i + 1];

            if (typeof (arg) == "number") {
                arg = "" + arg;
            } else {
                arg = arg.pp();
            }
            const comment = arg.COMMENT;

            if (arg.indexOf("<br>") === -1 && arg.indexOf("<div") === -1 && !comment) {
                ret += arg + " /* " + note + " */\n";
            } else {
                ret += "/* " + note + " */<br>\n";
                if (comment) {
                    ret += "/* " + comment + " */<br>\n";
                }
                ret += arg;
            }
        }
        ret += "</div>&gt;\n";

        return ret;
    }

    getType() {
        return "CONFIG";
    }
}
