class LayersClass extends STYLE {
    Indent(text) {
        if (text.substr(0, 2) == '/*') {
            const tmp = text.split('*/');
            if (tmp[1][0] != '\n') tmp[1] = '\n' + tmp[1].trimStart();
            text = tmp.join('*/');
        }
        return "\n  " + text.split("\n").join("\n  ");
    }

    extraButtons(arg) {
        if (arg === 1) return "";
        const id = this.get_id();
        let ret = "<button class='extra-buttons' title='Duplicate Layer' onclick='DuplicateLayer(" + id + "," + arg + ",event)'>+</button>";
        ret += "<button class='extra-buttons' title='Remove Layer' onclick='RemoveLayer(" + id + "," + arg + ",event)'>X</button>";
        if (arg > 2) ret += "<button class='extra-buttons' title='Move Layer Up' onclick='UpLayer(" + id + "," + arg + ",event)'>&#5169;</button>";
        if (arg <= this.LAYERS.length) ret += "<button class='extra-buttons' title='Move Layer Down'onclick='DownLayer(" + id + "," + arg + ",event)'>&#5167;</button>";
        return ret;
    }

    constructor(ARGS) {
        super("Mix alpha-blended layers", ARGS);
        this.LAYERS = Array.from(ARGS).slice(1);
        this.add_arg("BASE", "COLOR", "Base layer");
        for (let i = 1; i < this.LAYERS.length + 1; i++)
            this.add_arg("LAYER" + i, "COLOR", "Layer " + i);
    }

    getColor(led) {
        let ret = this.BASE.getColor(led);
        for (let i = 0; i < this.LAYERS.length; i++) {
            ret = ret.paintOver(this.LAYERS[i].getColor(led));
        }
        return ret;
    }

    argify(state) {
        this.BASE = this.BASE.argify(state);
        state.color_argument = false;
        const ret = super.argify(state);
        state.color_argument = false;
        return ret;
    }
}

function Layers(BASE, Layer1, Layer2) {
    return new LayersClass(Array.from(arguments));
}
