import {PropConfig} from "../../classes/props.js";

export let prop_config;

function selectPropFile(){
    console.log("selectPropFile");
    let propfile = document.getElementById("propfile").value;
    console.log("selecting: " + propfile);

    prop_config.selectPropFile(propfile);

    buildGUI("container", prop_config.prop_template, prop_config);
    refreshConfig();
}

function init(){
    console.log("init");
    prop_config = new PropConfig();
    console.log(prop_config);
    document.getElementById("propfile").value = prop_config.prop_file;

    selectPropFile();
    document.getElementById("container").addEventListener("change", changedValue);
}

function changedValue(evt){
    const item = evt.target.id;

    console.log(item);

    switch(prop_config.prop_template[item].type){
        case "boolean":
            prop_config.setItem(item, !!evt.target.checked);
            break;

        case "powerpins":
            prop_config.setItem(item, "PowerPINS<" + getSelectValues(evt.target).join(",") + ">");
            break;

        case "float":
        case "integer":
            prop_config.setItem(item, evt.target.value * 1);
            break;

        default:
            prop_config.setItem(item, evt.target.value);
            break;
    }

    refreshConfig();
}

function refreshConfig(){
    document.getElementById("propConfig").innerHTML= prop_config.getConfig();
}

window.selectPropFile = selectPropFile;
document.getElementById("propfile").addEventListener("change", selectPropFile);
window.addEventListener("load", init);


