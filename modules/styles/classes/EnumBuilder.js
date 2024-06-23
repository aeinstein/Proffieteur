class EnumBuilder {
    constructor(name, prefix) {
        this.name = name;
        this.prefix = prefix ? prefix : "";
        this.last_value = -1
        this.value_to_name = {};
    }

    addValue(name, value) {
        if (value == undefined) {
            value = this.last_value + 1;
        }
        this.last_value = value;
        this.value_to_name[value] = name;
        window[name] = value;
        console.log(" ENUM " + name + " = " + value);
    }

    addToTab(tab, common_prefix) {
        if (!common_prefix) {
            common_prefix = "florb";
        }
        const v = Object.keys(this.value_to_name);

        for (let i = 0; i < v.length; i++) {
            const V = parseInt(v[i]);
            const N = this.value_to_name[V];
            const label = N.replace(common_prefix, "");
            AddTabContent(tab, mkbutton2(label, this.prefix + N));
        }
    }

    build() {
        class ENUMClass extends INTEGER {
            pp() {
                let ret;
                if (pp_is_url) {
                    if (this.super_short_desc) return "$";

                } else if (0) {
                    ret = "<select>";
                    const v = Object.keys(this.constructor.value_to_name);

                    for (let i = 0; i < v.length; i++) {
                        const V = parseInt(v[i]);
                        const N = this.constructor.value_to_name[V];
                        ret += "<option value=" + V;
                        if (this.value == V) ret += " selected";
                        ret += ">" + N + "</option>";
                    }
                    ret += "</select>";
                    return ret;
                }


                ret = this.gencomment() + this.value;
                if (this.constructor.value_to_name[this.value]) {
                    ret = this.constructor.prefix + this.constructor.value_to_name[this.value];
                }
                return this.PPshort(ret, this.getType());
            }

            getType() {
                return this.constructor.NAME;
            }
        }
        ENUMClass.value_to_name = this.value_to_name;
        ENUMClass.NAME = this.name;
        ENUMClass.prefix = this.prefix

        function ENUM(value) {
            return new ENUMClass(value);
        }

        window[this.name] = ENUM;

        const v = Object.keys(this.value_to_name);

        for (let i = 0; i < v.length; i++) {
            const V = parseInt(v[i]);
            const N = this.value_to_name[V];
            AddIdentifier(this.prefix + N, ENUM.bind(null, V));
        }
    }
}