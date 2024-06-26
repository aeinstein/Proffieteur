
let presets, fonts, tracks, styles;

let use_common = true;

styles = {}

bc = new BroadcastChannel('proffiediag');

bc.onmessage = async (ev) => {
    console.log(ev);

    if (ev.data.fonts) fonts = ev.data.fonts;
};

function loadFontsFromConnected(){
    bc.postMessage("list_fonts");
}

function saveNewPreset(){
    let font = document.getElementById("newPresetFont").value;

    if(document.getElementById("newPresetFallback").value !== "") font += ";" + document.getElementById("newPresetFallback").value;
    if(use_common) font += ";common";

    let preset = {
        font: font,
        track: document.getElementById("newPresetTrack").value,
    };

    for(let i = 1; i <= document.getElementById("num_blades").value; i++){
        preset["blade" + i] = document.getElementById("styleBlade" +i).value;
    }

    preset["name"] = document.getElementById("newPresetName").value;

    presets[document.getElementById("preset").value].push(preset);


    localStorage.setItem("PRESETS", JSON.stringify(presets));

    console.log(presets);
    buildConfig();
    hideTemplate();
}

function buildConfig(){
    let config = "";

    for(const item in presets){
        config += addPresetSet(item);
    }

    document.getElementById("presetConfig").innerHTML = config;
}

function addPresetSet(preset){
    let ret = "Preset " + preset + "[] = {\n";

    for(let i = 0; i < presets[preset].length; i++) {
        if(i > 0) ret += ",\n";
        ret += addPreset(presets[preset][i]);
    }

    ret += "\n";
    ret += "};\n\n";

    return ret;
}

function addPreset(p){
    let ret = "\t{\n";

    ret += "\t\t\"" + p.font + "\",\n";
    ret += "\t\t\"" + p.track + "\",\n";

    for(let i = 1; i <= document.getElementById("num_blades").value; i++){

        let content = p["blade" + i];
        content = content.replace("<", "&lt;");
        content = content.replace(">", "&gt;");

        ret += "\t\t" + content + ",\n";
    }

    ret += "\t\t\"" + p.name + "\"\n";

    ret += "\t}";

    return ret;
}


function newPreset(){
    showTemplate("tmpNewPreset");

    fillSelectBox("newPresetFont", fonts);
    fillSelectBox("newPresetTrack", [""].concat(tracks));
    fillSelectBox("newPresetFallback", [""].concat(fonts));

    let startRow = 3;

    for(let i = 1; i <= document.getElementById("num_blades").value; i++){
        let tableRef = document.getElementById("tblNewPreset");
        const newRow = tableRef.insertRow(startRow++)

        let content = "<td>Style Blade " + i + "</td>";
        content += "<td><select id='styleBlade" + i +"'>";
        content += "<option id='StylePtr<Black>()'>StylePtr&lt;Black&gt;()";

        for(const item in styles){
            content += "<option value='StylePtr<" + item + ">()'>" + item;
        }
        content += "</select></td>";

        newRow.innerHTML = content;
    }
}


function getStylesFromLS(){
    let styles = localStorage.getItem("styles");
    getStylesFromFile(styles)
}

function getStylesFromFile(tmp){
    styles = {};

    const removeCommentBlock = new RegExp(/\/\*(.|[\r\n])*?\*\//gi);
    let style_lines = tmp.replaceAll(removeCommentBlock, "");
    const removeCommentLine = new RegExp(/\S*\/\/.*/g);
    style_lines = tmp.replace(removeCommentLine, "");
    style_lines = style_lines.replaceAll(/\n|\r|\t| /g, "");

    let ls = style_lines.split(";");

    for(let i = 0; i < ls.length; i++){
        const getUsing = new RegExp(/using(\S+)=(.+)/);
        let parts = ls[i].match(getUsing);

        if(Array.isArray(parts) && parts.length === 3) {
            console.log(parts);
            styles[parts[1]] = parts[2];
        }
    }

    localStorage.setItem("STYLES", JSON.stringify(styles));
}

function refreshPresets(){

}

function fillSelectBox(box, content){
    const s = document.getElementById(box);

    for(let i = 0; i < content.length; i++){
        const item = content[i];
        s.innerHTML += "<option id='" + item + "'>" + item;
    }
}

function init(){
    presets = JSON.parse(localStorage.getItem("PRESETS"));
    fonts =  JSON.parse(localStorage.getItem("FONTS"));
    tracks =  JSON.parse(localStorage.getItem("TRACKS"));
    styles =  JSON.parse(localStorage.getItem("STYLES"));

    const s = document.getElementById("preset");

    for(const item in presets){
        s.innerHTML += "<option id='" + item + "'>" + item;
    }

    document.getElementById("num_blades").value = localStorage.getItem("NUM_BLADES");
    buildConfig();
}


window.addEventListener("load", init);