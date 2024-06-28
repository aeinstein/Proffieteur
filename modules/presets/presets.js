let presetConfig;

import { Presets } from "../../classes/presets.js";

function loadFontsFromConnected(){
    bc.postMessage("list_fonts");
}

export function saveNewPreset(){
    let font = document.getElementById("newPresetFont").value;

    if(document.getElementById("newPresetFallback").value !== "") font += ";" + document.getElementById("newPresetFallback").value;
    if(presetConfig.use_common) font += ";common";

    let preset = {
        font: font,
        track: document.getElementById("newPresetTrack").value,
    };

    for(let i = 1; i <= presetConfig.NUM_BLADES; i++){
        preset["blade" + i] = document.getElementById("styleBlade" +i).value;
    }

    preset["name"] = document.getElementById("newPresetName").value;

    presetConfig.presets[document.getElementById("preset").value].push(preset);

    console.log(presetConfig.presets);

    document.getElementById("presetConfig").innerHTML = presetConfig.getConfig();
    hideTemplate();
}

export function newPreset(){
    showTemplate("tmpNewPreset");

    fillSelectBox("newPresetFont", presetConfig.fonts);
    fillSelectBox("newPresetTrack", [""].concat(presetConfig.tracks));
    fillSelectBox("newPresetFallback", [""].concat(presetConfig.fonts));

    let startRow = 3;

    for(let i = 1; i <= document.getElementById("num_blades").value; i++){
        let tableRef = document.getElementById("tblNewPreset");
        const newRow = tableRef.insertRow(startRow++)

        let content = "<td>Style Blade " + i + "</td>";
        content += "<td><select id='styleBlade" + i +"'>";
        content += "<option id='StylePtr<Black>()'>StylePtr&lt;Black&gt;()";

        for(const item in presetConfig.styles){
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

function fillSelectBox(box, content){
    const s = document.getElementById(box);

    for(let i = 0; i < content.length; i++){
        const item = content[i];
        s.innerHTML += "<option id='" + item + "'>" + item;
    }
}

function init(){
    presetConfig = new Presets();

    const s = document.getElementById("preset");

    for(const item in presetConfig.presets){
        s.innerHTML += "<option id='" + item + "'>" + item;
    }

    document.getElementById("num_blades").value = presetConfig.NUM_BLADES;
    document.getElementById("presetConfig").innerHTML = presetConfig.getConfig();
}

window.saveNewPreset = saveNewPreset;
window.newPreset = newPreset;
window.addEventListener("load", init);
