let current_template;

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