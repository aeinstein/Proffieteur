import {top_structure, TopConfig} from "../../classes/top.js";

let top_config;

function buildGUI(){
    let buttons = JSON.parse(localStorage.getItem("BUTTONS"));

    document.getElementById("btn1").value = buttons["button1"];
    document.getElementById("btn2").value = buttons["button2"];
    document.getElementById("btn3").value = buttons["button3"];

    for(const item in top_structure){
        const group = top_structure[item].group;

        if(!group) continue;

        const fs = getOrAddFieldset(group);
        const content = fs.getElementsByTagName('table')[0];

        const newRow = content.insertRow();
        const newlabel = newRow.insertCell();
        const newinput = newRow.insertCell();

        newlabel.innerHTML = "<label for=\"" + item + "\">" + top_structure[item].desc + "</label>";

        let txt;

        switch(top_structure[item].type){
            case "integer":
            case "float":
                newinput.innerHTML = "<input id='" + item  + "' type='number' value='" + top_config.getItem(item) + "'>";
                break;

            case "boolean":
                txt = "<input id='" + item  + "' type='checkbox'";
                if(top_config.getItem(item)) txt += " checked";
                txt += ">";
                newinput.innerHTML = txt;
                break;

            case "powerpins":
                txt = "<select style='height: fit-content' id='" + item  + "' multiple>";
                for(let i = 1; i<=6; i++){
                    txt += "<option value='bladePowerPin" + i + "'";
                    if(top_config.getItem(item).indexOf("bladePowerPin" + i) >= 0) txt += " selected";
                    txt += ">bladePowerPin" + i + "</option>";
                }
                txt += "</select>";

                newinput.innerHTML = txt;
                break;

            default:
                console.error(top_structure[item].type + " not implemented");
                break;
        }

        content.appendChild(newRow);
    }

    save();
}

function getOrAddFieldset(group){
    if(!group) return;

    let fs = document.getElementById("fld" + group.toLowerCase()) || false;

    if(!fs) {
        fs = document.createElement("FIELDSET");
        fs.id = "fld" + group.toLowerCase();
        fs.innerHTML = "<legend>" + group + "</legend><table></table>";
        document.getElementById("container").appendChild(fs);
    }

    return fs;
}

function refreshButtonConfig(){
    let num_buttons = 0;
    if(document.getElementById("btn1").value) num_buttons++;
    if(document.getElementById("btn2").value) num_buttons++;
    if(document.getElementById("btn3").value) num_buttons++;

    top_config.setItem("NUM_BUTTONS", num_buttons);
    save();
}

function init() {
    top_config = new TopConfig();

    // Build GUI from template
    buildGUI();

    // Register changed listenr
    document.getElementById("container").addEventListener("change", changedValue);
}

function save(){
    document.getElementById("topConfig").innerHTML= top_config.generateTopConfig();
}

function changedValue(evt){
    const item = evt.target.id;

    console.log(item);

    if(item.substring(0, 3) === "btn") generateButtons();
    else {
        switch(top_structure[item].type){
            case "boolean":
                top_config.setItem(item, !!evt.target.checked);
                break;

            case "powerpins":
                top_config.setItem(item, "PowerPINS<" + getSelectValues(evt.target).join(",") + ">");
                break;

            case "float":
            case "integer":
                top_config.setItem(item, evt.target.value * 1);
                break;

            default:
                top_config.setItem(item, evt.target.value);
                break;
        }
    }

    save();
}

function generateButtons(){
    let buttons = {};

    for(let buttonNo = 1; buttonNo <= 3; buttonNo++){
        buttons["button" + buttonNo] = document.getElementById("btn" + buttonNo).value;
    }
    localStorage.setItem("BUTTONS", JSON.stringify(buttons));
}

function getSelectValues(select) {
    const result = [];
    const options = select && select.options;
    let opt;

    for (let i=0, iLen=options.length; i<iLen; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
}

window.refreshButtonConfig = refreshButtonConfig;

window.addEventListener("load", init);


