import {Props} from "../../classes/props.js";

let props, propFile;

export function selectPropFile(){
    let propfile = document.getElementById("propfile").value;
    console.log("selecting: " + propfile);

    props.setPropFile(propfile);

    document.getElementById("readme").innerHTML = nl2br(preformat(props.getReadme()));
    document.getElementById("buttonHint").innerHTML = nl2br(preformat(props.getButtonHints()));
}

function init(){
    props = new Props();

    propFile = localStorage.getItem("PROPS");
    document.getElementById("propfile").value = propFile;

    selectPropFile();
}


window.selectPropFile = selectPropFile;
window.addEventListener("load", init);
