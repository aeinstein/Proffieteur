import {BladeConfig} from "../../classes/blades.js";

export let bladeConfig;

let current_details;

window.newBladeID = ()=>{
    showTemplate("tmpNewBladeID");
    document.getElementById("newBladeID").readOnly = false;
}

window.editBladeID = ()=>{
    showTemplate("tmpNewBladeID");

    let blade = bladeConfig.getBladeID(getValue("blade_id"));

    setValue("newBladeID", getValue("blade_id"));
    setValue("newBladePresets", blade["presets"]);
    setValue("newBladeSaveFolder", blade["newBladeSaveFolder"]?blade["newBladeSaveFolder"]:"");
    document.getElementById("newBladeID").readOnly = true;
}

window.saveNewBladeID = ()=>{
    const newBladeID = getValue("newBladeID");
    if(bladeConfig.hasBladeID(newBladeID)){
        let tmp = {
            presets: getValue("newBladePresets"),
            save_dir: getValue("newBladeSaveFolder")
        };

        bladeConfig.setBlades(newBladeID, merge_options(bladeConfig.getBladeID(newBladeID), tmp))

    } else {
        bladeConfig.setBlades(newBladeID, {
            presets: getValue("newBladePresets"),
            blades: [],
            save_dir: getValue("newBladeSaveFolder")
        });
    }

    //localStorage.setItem('blades', JSON.stringify(blades));

    refreshBladeIDs();

    document.getElementById("blade_id").value = newBladeID;

    refreshBlades();
    hideTemplate();
}

window.saveBladeDefinition = ()=>{
    const bladeName = getValue("bladeName");

    bladeConfig.saveBladeDefinition(bladeName);

    hideTemplate();
}

window.newBladeDefinition = ()=>{
    showTemplate("tmpNewBladeDefinition");
    showDetails();
}

window.editBladeDefinitions = () =>{
    showTemplate("tmpListBladeDefinitions");
    refreshDefinitions();
}

window.addBlade = ()=>{
    showTemplate("tmpAddBlade");

    addOption("bladeDefinition", "Dummy");

    for(const def in bladeConfig.getDefinitions()){
        console.log(def);
        addOption("bladeDefinition", def);
    }
}

window.showDetails = ()=>{
    let tmp;

    if(current_details) current_details.style.display = "none";

    switch(getValue("newBladeType")){
        case "SimpleBladePtr":
            tmp = document.getElementById("detailsSimpleBlade");
            refreshSimpleBlade();
            break;

        case "WS281XBladePtr":
            tmp = document.getElementById("detailsWS281XBladePtr");
            break;

        case "SubBlade":
            for(const def in bladeConfig.getDefinitions()){
                let type = bladeConfig.getDefinition(def)["type"];

                if(type === "SimpleBladePtr") continue;
                if(type === "DimBlade") continue;
                if(type === "SubBlade") continue;
                if(type === "SubBladeWithStride") continue;
                if(type === "SubBladeReverse") continue;
                addOption("sb_bladeDefinition", def);
            }

            tmp = document.getElementById("detailsSubBlade");
            break;

        case "DimBlade":
            for(const def in bladeConfig.getDefinitions()){
                addOption("dim_bladeDefinition", def);
            }

            tmp = document.getElementById("detailsDimBlade");
            break;

    }

    setFocus("bladeName");

    tmp.style.display = "inline-block";
    current_details = tmp;
}


function refreshDefinitions(){
    const definitions = document.getElementById("lstBladeDefinitions");
    let tmp = "<table>";

    for(let definition in bladeConfig.getDefinitions()){
        tmp += "<tr>";
        tmp += "<td>" + definition + "</td>";
        tmp += "<td>" + JSON.stringify(bladeConfig.getDefinition(definition)) + "</td>";
        tmp += "</tr>";
    }

    tmp += "</table>";
    definitions.innerHTML = tmp;
}

window.saveAddBlade = ()=>{
    const blade_id = getValue("blade_id");
    console.log("BladeID: " + blade_id);

    let bladeNo = 0;
    bladeNo += bladeConfig.getBladeID(blade_id)["blades"].length;

    console.log("BladeNo: " + bladeNo);

    if(!bladeConfig.hasBladeID(blade_id)) {
        blades[blade_id] = {
            presets: "presets",
            blades: [],
            save_dir: ""
        };
    }

    bladeConfig.setBlade(blade_id, bladeNo, getValue("bladeDefinition"))

    refreshBlades();
    hideTemplate();
}

function refreshBlades(){
    removeAllOptions("currentBlades");

    const blade_id = getValue("blade_id");

    if(!bladeConfig.hasBladeID(blade_id)) {
        displayError("You need at least one BladeID", true);
        return;
    }

    for(let i = 0; i < bladeConfig.getNumBlades(blade_id); i++){
        addOption("currentBlades", bladeConfig.getBlades(blade_id)[i]);
    }


    document.getElementById("bladeConfig").innerHTML = bladeConfig.getConfig();
}

function refreshBladeIDs(){
    removeAllOptions("blade_id");

    let bladeFound = false;

    for(const id in bladeConfig.blades){
        bladeFound = true;
        addOption("blade_id", id);
    }

    if(!bladeFound) addOption("blade_id", 0);
}


function init(){
    bladeConfig = new BladeConfig();
    document.getElementById("num_blades").value = bladeConfig.getMaxBladeNumber();
    refreshBladeIDs();
    refreshBlades();
}

function displayError(txt, isError){
    bc.postMessage({"status": txt, is_error: isError});
}


window.clrBladeID = ()=> {
    const blade_id = document.getElementById('blade_id').value;
    bladeConfig.clrBladeID(blade_id);
    refreshBladeIDs();
}

window.clrBlades = ()=> {
    const blade_id = document.getElementById('blade_id').value;
    bladeConfig.clrBlades(blade_id);
    refreshBlades();
}


window.refreshBlades = refreshBlades;
window.addEventListener("load", init);

