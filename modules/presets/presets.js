export let presetConfig;

import { Presets } from "../../classes/presets.js";




function loadFontsFromConnected(){
    bc.postMessage("list_fonts");
}

export function savePreset(){
    let font = document.getElementById("newPresetFont").value;

    if(document.getElementById("newPresetFallback").value !== "") font += ";" + document.getElementById("newPresetFallback").value;
    if(presetConfig.use_common) font += ";common";

    let preset = {
        font: font,
        track: document.getElementById("newPresetTrack").value,
        fallback: document.getElementById("newPresetFallback").value
    };

    for(let i = 1; i <= presetConfig.NUM_BLADES; i++){
        preset["blade" + i] = document.getElementById("styleBlade" +i).value;
    }

    preset["name"] = document.getElementById("newPresetName").value;

    let index = presetConfig.presets[document.getElementById("preset").value].length;

    if(document.getElementById("currentPresets").value !== "") {
        index = document.getElementById("currentPresets").value;
    }


    presetConfig.presets[document.getElementById("preset").value][index] = preset;

    console.log(presetConfig.presets);

    refreshCurrentPresets();
    hideTemplate();
}

export function newPreset(){
    document.getElementById("currentPresets").value = "";
    editPreset();
}

export function delPreset(){
    if(document.getElementById("currentPresets").value === "") {
        presetConfig.displayError("Select Preset to delete", true);
        return;
    }

    if(confirm("Sicher ?")) {
        presetConfig.presets[document.getElementById("preset").value].splice(document.getElementById("currentPresets").value, 1);

        console.log(presetConfig);
        refreshCurrentPresets();
    }
}

export function editPreset(){
    showTemplate("tmpNewPreset");

    fillSelectBox("newPresetFont", presetConfig.fonts);
    fillSelectBox("newPresetTrack", [""].concat(presetConfig.tracks));
    fillSelectBox("newPresetFallback", [""].concat(presetConfig.fonts));

    let startRow = 3;

    let currentPreset = presetConfig.presets[document.getElementById("preset").value][document.getElementById("currentPresets").value];
    console.log("presetnp:" + document.getElementById("currentPresets").value);
    console.log(currentPreset);

    for(let i = 1; i <= document.getElementById("num_blades").value; i++){
        let tableRef = document.getElementById("tblNewPreset");
        const newRow = tableRef.insertRow(startRow++)

        let content = "<td>Style Blade " + i + "</td>";
        content += "<td><select id='styleBlade" + i +"'>";

        let buildin = {
            "Black": "Black"
        };

        for(const item in merge_options(presetConfig.styles, buildin)){
            content += "<option value='StylePtr<" + item + ">()'";

            if(currentPreset) {
                console.log(item, currentPreset["blade" + i]);

                if(currentPreset["blade" + i] === "StylePtr<" + item + ">()") content += " selected";
            }

            content += ">" + item;
        }
        content += "</select></td>";

        newRow.innerHTML = content;
    }

    if(currentPreset) {
        document.getElementById("newPresetName").value = currentPreset.name;
        document.getElementById("newPresetFallback").value = currentPreset.fallback;
        document.getElementById("newPresetTrack").value = currentPreset.track;
    }
}


export function getPresetsFromConnected(){
    bc.postMessage("list_presets");
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
        s.innerHTML += "<option value='" + item + "'>" + item;
    }
}

function init(){
    presetConfig = new Presets();
    window.presetConfig = presetConfig;

    console.log(presetConfig);

    const s = document.getElementById("preset");

    for(const item in presetConfig.presets){
        s.innerHTML += "<option id='" + item + "'>" + item;
    }

    document.getElementById("num_blades").value = presetConfig.NUM_BLADES;

    refreshCurrentPresets();
}




export function refreshCurrentPresets(){
    let pre = "";

    let currentPresets = presetConfig.presets[document.getElementById("preset").value];
    for(let i = 0; i < currentPresets.length; i++){
        const currentPreset = currentPresets[i];
        pre += "<option value='" + i + "'>" + i + " - " + currentPreset.name;
    }

    document.getElementById("currentPresets").innerHTML = pre;

    document.getElementById("presetConfig").innerHTML = preformat(presetConfig.getConfig());
}

export function newPresetSet(){
    document.getElementById("preset").value = "";
    editPresetSet();
}

export function delPresetSet(){

}

export function editPresetSet(){
    showTemplate("tmpNewPresetSet");
    document.getElementById("newPresetSetName").value = document.getElementById("preset").value;
}

export function savePresetSet(){

}

window.savePreset = savePreset;
window.delPreset = delPreset;
window.editPreset = editPreset;
window.newPreset = newPreset;

window.savePresetSet = savePresetSet;
window.delPresetSet = delPresetSet;
window.editPresetSet = editPresetSet;
window.newPresetSet = newPresetSet;

window.loadFontsFromConnected = loadFontsFromConnected;

window.refreshCurrentPresets = refreshCurrentPresets;
window.addEventListener("load", init);

