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
        };


        this.NUM_BLADES = localStorage.getItem("NUM_BLADES");
        this.presets = JSON.parse(localStorage.getItem("PRESETS"));
        this.fonts =  JSON.parse(localStorage.getItem("FONTS"));
        this.tracks =  JSON.parse(localStorage.getItem("TRACKS"));
        this.styles =  JSON.parse(localStorage.getItem("STYLES"));
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
        let ret = "\t{\n";

        ret += "\t\t\"" + p.font + "\",\n";
        ret += "\t\t\"" + p.track + "\",\n";

        for(let i = 1; i <= this.NUM_BLADES; i++){

            let content = p["blade" + i];
            //content = content.replace("<", "&lt;");
            //content = content.replace(">", "&gt;");

            ret += "\t\t" + content + ",\n";
        }

        ret += "\t\t\"" + p.name + "\"\n";

        ret += "\t}";

        return ret;
    }

    displayError(reason, isError){
        this.bc.postMessage({"status": reason, isError: isError});
    }
}