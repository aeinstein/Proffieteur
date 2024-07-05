export class Presets {
    presets;
    fonts;
    tracks;
    styles = {};
    bc;
    use_common = true;

    constructor() {
        this.bc = new BroadcastChannel('proffiediag');

        this.bc.onmessage = async (ev) => {
            console.log(ev);

            if (ev.data.fonts) this.fonts = ev.data.fonts;
            if (ev.data.presets) this.parsePresets(ev.data.presets);
        };


        this.NUM_BLADES = localStorage.getItem("NUM_BLADES");
        this.presets = JSON.parse(localStorage.getItem("PRESETS"));
        this.fonts =  JSON.parse(localStorage.getItem("FONTS"));
        this.tracks =  JSON.parse(localStorage.getItem("TRACKS"));
        this.styles =  JSON.parse(localStorage.getItem("STYLES"));
    }


    /*
        FONT=Stitched;common
        TRACK=
        STYLE1=builtin 0 1
        STYLE2=builtin 0 2
        STYLE3=builtin 0 3
        NAME=Stitched
        VARIATION=0
    */
    parsePresets(preset){
        let preset_lines = presets.split("\n");

        let tmpPreset = {};

        for(let i = 0; i < preset_lines.length; i++){
            let line = preset_lines[i];
            let args = line.split("=");

            switch(args[0]){
                case "FONT":
                    tmpPreset.font = args[1];


                    let fonts = args[1].split(";");


                    const index = fonts.indexOf("common");
                    if (index > -1) fonts.splice(index, 1);

                    // if 2 than it has fallback
                    if(fonts.length === 2) tmpPreset.fallback = args[2];
                    break;

                case "TRACK":
                    tmpPreset.track = args[1];
                    break;

                case "NAME":
                    tmpPreset.name = args[1];
                    break;

                case "VARIATION":
                    tmpPreset.variation = args[1];
                    break;

                default:
                    if(args[0].match(/STYLE[0-9]*/)){

                    }
                    break;
            }
        }

        console.log(tmpPreset)


    }

    getConfig(){
        let config = "";

        for(const item in this.presets){
            config += this.addPresetSet(item);
        }

        localStorage.setItem("PRESETS", JSON.stringify(this.presets));

        return config;
    }

    addPresetSet(preset){
        let ret = "Preset " + preset + "[] = {\n";

        for(let i = 0; i < this.presets[preset].length; i++) {
            if(i > 0) ret += ",\n";
            ret += this.addPreset(this.presets[preset][i]);
        }

        ret += "\n";
        ret += "};\n\n";

        return ret;
    }

    addPreset(p){
        let ret = "  {\n";

        ret += "    \"" + p.font + "\",\n";
        ret += "    \"" + p.track + "\",\n";

        for(let i = 1; i <= this.NUM_BLADES; i++){

            let content = p["blade" + i];
            //content = content.replace("<", "&lt;");
            //content = content.replace(">", "&gt;");

            ret += "    " + content + ",\n";
        }

        ret += "    \"" + p.name + "\"\n";

        ret += "  }";

        return ret;
    }

    displayError(reason, isError){
        this.bc.postMessage({"status": reason, isError: isError});
    }
}