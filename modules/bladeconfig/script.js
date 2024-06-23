let current_template;
let current_details;

function showDetails(){
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
            for(const def in blade_definitions){
                if(blade_definitions[def]["type"] === "SimpleBladePtr") continue;
                if(blade_definitions[def]["type"] === "DimBlade") continue;
                if(blade_definitions[def]["type"] === "SubBlade") continue;
                if(blade_definitions[def]["type"] === "SubBladeWithStride") continue;
                if(blade_definitions[def]["type"] === "SubBladeReverse") continue;
                addOption("sb_bladeDefinition", def);
            }

            tmp = document.getElementById("detailsSubBlade");
            break;

        case "DimBlade":
            for(const def in blade_definitions){
                addOption("dim_bladeDefinition", def);
            }

            tmp = document.getElementById("detailsDimBlade");
            break;

    }

    setFocus("bladeName");

    tmp.style.display = "inline-block";
    current_details = tmp;
}

function showTemplate(id){
    if(current_template) document.body.removeChild(current_template);

    const template = document.getElementById(id);

    const container = document.createElement("DIV");
    container.innerHTML = template.innerHTML;
    container.className = "modal";
    document.body.appendChild(container);

    current_template = container;
}

function hideTemplate(){
    if(current_template) document.body.removeChild(current_template);
    current_template = null;
}

function getValue(id){
    const tmp = document.getElementById(id);
    if(tmp) return tmp.value;
    return false;
}

function setValue(id, value){
    const tmp = document.getElementById(id);
    if(tmp) tmp.value = value;
    else return false;
    return true;
}

function setFocus(id){
    const tmp = document.getElementById(id);
    tmp.focus();
}

function addOption(selectBox, option){
    console.log("adding: " + option);
    const sb = document.getElementById(selectBox);

    const opt = document.createElement("OPTION");
    opt.value = option;
    opt.text = option;
    sb.add(opt);
}

function getSelectValues(id) {
    const tmp = document.getElementById(id);
    if(!tmp) return false;

    let result = "";
    const options = tmp && tmp.options;

    for (let i = 0; i < options.length; i++) {
        const opt = options[i];

        if (opt.selected) {
            if(result !== "") result += ", ";
            result += (opt.value || opt.text)
        }
    }
    return result;
}

function removeAllOptions(id){
    const tmp = document.getElementById(id);
    if(!tmp) return false;

    tmp.length = 0;
}

function merge_options(obj1,obj2){
    let attrname;
    const obj3 = {};
    for (attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}