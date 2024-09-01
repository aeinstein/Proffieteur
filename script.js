let current_template;
const bc = new BroadcastChannel('proffiediag');

function displayStatus(reason, isError){
    bc.postMessage({"status": reason, isError: isError});
}

function displayError(reason){
    displayStatus(reason, true);
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

function preformat(txt){
    let conf = txt;
    conf = conf.replaceAll("<", "&lt;");
    conf = conf.replaceAll(">", "&gt;");

    return conf;
}

function nl2br (str, replaceMode, isXhtml) {
    const breakTag = (isXhtml) ? '<br />' : '<br>';
    const replaceStr = (replaceMode) ? '$1' + breakTag : '$1' + breakTag + '$2';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr);
}

function merge_options(obj1,obj2){
    let attrname;
    const obj3 = {};
    for (attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

function colorize(input){
    let ret = input;
    const esc = String.fromCharCode(0x1b);

    ret = ret.replaceAll(esc + "[90m", "<font color='gray'>");
    ret = ret.replaceAll(esc + "[92m", "<font color='green'>");
    ret = ret.replaceAll(esc + "[93m", "<font color='yellow'>");
    ret = ret.replaceAll(esc + "[0m", "</font>");
    return ret;
}

function ab2str(buffer){
    const bufView = new Uint16Array(buffer);
    const length = bufView.length;
    let result = '';
    let addition = Math.pow(2, 16) - 1;

    for(let i = 0; i<length; i+=addition){
        if(i + addition > length) addition = length - i;
        result += String.fromCharCode.apply(null, bufView.subarray(i,i+addition));
    }

    return result;
}

function str2ab(str) {
    const buf = new ArrayBuffer(str.length *2);
    const bufView = new Uint16Array(buf);
    for (let i = 0; i < str.length; i++) bufView[i] = str.charCodeAt(i);
    return buf;
}

function niceSize(n) {
    const gigabyte = 1024 * 1024 * 1024;
    const megabyte = 1024 * 1024;
    const kilobyte = 1024;

    if (n >= gigabyte) {
        return (n / gigabyte).toFixed(2) + " GiB";
    } else if (n >= megabyte) {
        return (n / megabyte).toFixed(2) + " MiB";
    } else if (n >= kilobyte) {
        return (n / kilobyte).toFixed(2) + " KiB";
    } else {
        return n + " Bytes";
    }
}

function fillSelectBox(box, content){
    const s = document.getElementById(box);

    for(let i = 0; i < content.length; i++){
        const item = content[i];
        s.innerHTML += "<option value='" + item + "'>" + item;
    }
}

function getOrAddFieldset(title){
    if(!title) return;

    let fs = document.getElementById("fld" + title.toLowerCase()) || false;

    if(!fs) {
        fs = document.createElement("FIELDSET");
        fs.id = "fld" + title.toLowerCase();
        fs.innerHTML = "<legend>" + title + "</legend><table></table>";
        document.getElementById("container").appendChild(fs);
    }

    return fs;
}

function buildGUI(container, template, config){
    console.log("buildGUI");

    document.getElementById(container).innerHTML = "";

    for(const item in template){
        console.log(item);

        const option = template[item];

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
                newinput.innerHTML = "<input id='" + item  + "' type='number' value='" + config.getItem(item) + "'>";
                break;

            case "boolean":
                txt = "<input id='" + item  + "' type='checkbox'";
                console.log(config.getItem(item));
                if(config.getItem(item)) txt += " checked";
                txt += ">";
                newinput.innerHTML = txt;
                break;

            case "powerpins":
                txt = "<select style='height: fit-content' id='" + item  + "' multiple>";
                for(let i = 1; i<=6; i++){
                    txt += "<option value='bladePowerPin" + i + "'";
                    if(config.getItem(item).indexOf("bladePowerPin" + i) >= 0) txt += " selected";
                    txt += ">bladePowerPin" + i + "</option>";
                }
                txt += "</select>";

                newinput.innerHTML = txt;
                break;

            case "enum":
                txt = "<select id='" + item  + "'>";
                for(const entry in option.enums){
                    txt += "<option value='" + entry + "'";
                    if(config.getItem(item) === entry) txt += " selected";
                    txt += ">" + option.enums[entry];
                }
                txt += "</select>";
                newinput.innerHTML = txt;
                break;

            default:
                console.error(config.getItem(item).type + " not implemented");
                break;
        }

        content.appendChild(newRow);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
