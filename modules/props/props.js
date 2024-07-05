import {Props} from "../../classes/props.js";

let props;



export function selectPropFile(){
    let propfile = document.getElementById("propfile").value;
    console.log("selecting: " + propfile);

    props.setPropFile(propfile);

    document.getElementById("readme").innerHTML = nl2br(preformat(props.getReadme()));
}

function init(){
    props = new Props();

    selectPropFile();
}


window.selectPropFile = selectPropFile;
window.addEventListener("load", init);
