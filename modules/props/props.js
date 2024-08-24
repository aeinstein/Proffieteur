import {PropConfig} from "../../classes/props.js";

export let prop_config;
let propFile;

function selectPropFile(){
    console.log("selectPropFile");
    let propfile = document.getElementById("propfile").value;
    console.log("selecting: " + propfile);

    prop_config.selectPropFile(propfile);

    buildGUI();
    save();
}

function init(){
    console.log("init");
    prop_config = new PropConfig();
    console.log(prop_config);
    document.getElementById("propfile").value = prop_config.prop_file;

    selectPropFile();
    document.getElementById("container").addEventListener("change", changedValue);
}

function buildGUI(){
    console.log("buildGUI");

    document.getElementById("container").innerHTML = "";

    const prop_template = prop_config.prop_template

    for(const item in prop_template){
        console.log(item);

        const option = prop_template[item];

        const group = option.group;
        console.log(group);
        if(!group) continue;

        const fs = getOrAddFieldset(group);
        const content = fs.getElementsByTagName('table')[0];

        const newRow = content.insertRow();
        const newlabel = newRow.insertCell();
        const newinput = newRow.insertCell();

        newlabel.innerHTML = "<label for=\"" + item + "\">" + option.desc + "</label>";

        let txt;

        switch(option.type){
            case "int":
            case "integer":
            case "float":
                newinput.innerHTML = "<input id='" + item  + "' type='number' value='" + prop_config.getItem(item) + "'>";
                break;

            case "boolean":
                txt = "<input id='" + item  + "' type='checkbox'";
                console.log(prop_config.getItem(item));
                if(prop_config.getItem(item)) txt += " checked";
                txt += ">";
                newinput.innerHTML = txt;
                break;

            case "powerpins":
                txt = "<select style='height: fit-content' id='" + item  + "' multiple>";
                for(let i = 1; i<=6; i++){
                    txt += "<option value='bladePowerPin" + i + "'";
                    if(prop_config.getItem(item).indexOf("bladePowerPin" + i) >= 0) txt += " selected";
                    txt += ">bladePowerPin" + i + "</option>";
                }
                txt += "</select>";

                newinput.innerHTML = txt;
                break;

            default:
                console.error(prop_config.getItem(item).type + " not implemented");
                break;
        }

        content.appendChild(newRow);
    }
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

    save();
}

function save(){
    document.getElementById("propConfig").innerHTML= prop_config.getConfig();
}

window.selectPropFile = selectPropFile;
document.getElementById("propfile").addEventListener("change", selectPropFile);
window.addEventListener("load", init);


