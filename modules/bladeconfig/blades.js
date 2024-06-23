const blade_definitions = JSON.parse(localStorage.blade_definitions || "{}");
const blades = JSON.parse(localStorage.blades || "{}");
let stored_blade_string;

function clrBlades(){
    const blade_id = getValue("blade_id");
    blades[blade_id]["blades"] = [];

    //refreshBladeIDs();
    refreshBlades();

    localStorage.setItem('blades', JSON.stringify(blades));
}

function clrBladeID(){
    const blade_id = getValue("blade_id");
    delete blades[blade_id];


    refreshBladeIDs();
    refreshBlades();

    localStorage.setItem('blades', JSON.stringify(blades));
}

function newBladeID(){
    showTemplate("tmpNewBladeID");
    document.getElementById("newBladeID").readOnly = false;
}

function editBladeID(){
    showTemplate("tmpNewBladeID");
    setValue("newBladeID", getValue("blade_id"));
    setValue("newBladePresets", blades[blade_id]["presets"]);
    setValue("newBladeSaveFolder", blades[blade_id]["newBladeSaveFolder"])
    document.getElementById("newBladeID").readOnly = true;
}

function saveNewBladeID(){
    if(blades.hasOwnProperty(getValue("newBladeID"))) {
        let tmp = {
            presets: getValue("newBladePresets"),
            save_dir: getValue("newBladeSaveFolder")
        };


        blades[getValue("newBladeID")] = merge_options(blades[getValue("newBladeID")], tmp);

    } else {
        blades[getValue("newBladeID")] = {
            presets: getValue("newBladePresets"),
            blades: [],
            save_dir: getValue("newBladeSaveFolder")
        };
    }


    localStorage.setItem('blades', JSON.stringify(blades));

    refreshBladeIDs();

    document.getElementById("blade_id").value = getValue("newBladeID");

    refreshBlades();
    hideTemplate();
}

function saveBladeDefinition(){
    const bladeName = getValue("bladeName");

    if(bladeName === "") {
        alert("You must provide a name");
        setFocus("bladeName");
        return;
    }


    switch(getValue("newBladeType")){
    case "SimpleBladePtr":
        blade_definitions[bladeName] = {
            type: "SimpleBladePtr",
            led1: getValue("led1"),
            led2: getValue("led2"),
            led3: getValue("led3"),
            led4: getValue("led4"),
            powerPin1: getValue("pin1"),
            powerPin2: getValue("pin2"),
            powerPin3: getValue("pin3"),
            powerPin4: getValue("pin4")
        }
        break;

    case "DimBlade":
        blade_definitions[bladeName] = {
            type: "DimBlade",
            brightness: getValue("brightness"),
            blade_definition: getValue("dim_bladeDefinition")
        }

        break;

    case "SubBlade":
        let type = "SubBlade";

        let max_led = blade_definitions[getValue("sb_bladeDefinition")].leds *1;
        let first_led= getValue("sb_first") *1;
        let last_led= getValue("sb_last") *1;
        let stride = getValue("sb_stride") *1;


        console.log("stride: ", stride);

        console.log("max led: " + max_led);

        if(first_led <= 0 || first_led > max_led +1 ) {
            alert("First led must not exceed blade length");
            return;
        }

        if(last_led <= 0 || last_led > max_led +1) {
            alert("Last led must not exceed blade length");
            return;
        }

        blade_definitions[bladeName] = {
            type: type,
            first_led: first_led,
            last_led: last_led,
            blade_definition: getValue("sb_bladeDefinition")
        }

        if(first_led > last_led) {
            console.log("SubBladeReverse");
            blade_definitions[bladeName]["type"] = "SubBladeReverse";
        }

        if(stride > 1) {
            console.log("SubBladeWithStride");
            blade_definitions[bladeName]["type"] = "SubBladeWithStride";
            blade_definitions[bladeName]["stride_length"] = stride;
        }

        break;

    case "WS281XBladePtr":
        if(getValue("numLeds") < 0) {
            alert("Number of leds < 0??");
            setFocus("numLeds");
            return;
        }


        blade_definitions[bladeName] = {
            type: "WS281XBladePtr",
            leds: getValue("numLeds"),
            data_pin: getValue("dataPin"),
            byteorder: getValue("byte_order"),
            power_pins: getSelectValues("powerpins")
        }

        if(getValue("pin_class")) blade_definitions[bladeName]["pin_class"] = getValue("pin_class");
        if(getValue("frequency")) blade_definitions[bladeName]["frequency"] = getValue("frequency");
        if(getValue("reset_us")) blade_definitions[bladeName]["reset_us"] = getValue("reset_us");
        if(getValue("t1h")) blade_definitions[bladeName]["t1h"] = getValue("t1h");
        if(getValue("t0h")) blade_definitions[bladeName]["t0h"] = getValue("t0h");
        break;
    }

    localStorage.setItem('blade_definitions', JSON.stringify(blade_definitions));

    hideTemplate();
}

function buildConfig(){
    //const blade_id = getValue("blade_id");
    displayError("No Errors found");

    setValue("num_blades", getMaxBladeNumber());

    let bladeArray = "BladeConfig blades[] = {\n";

    for(const blade_id in blades) {
        if(blades[blade_id].blades.length !== getMaxBladeNumber()) {
            displayError("BladeID " + blade_id + " must have " + getMaxBladeNumber() + " blades", true);
            //continue;
        }

        stored_blade_string = "";

        console.log("writing blade: " + blade_id);
        bladeArray += "  {\n";
        bladeArray += "    " + blade_id + ",\n";

        for (let i = 0; i < blades[blade_id]["blades"].length; i++) {
            let bladeName = blades[blade_id]["blades"][i]
            bladeArray += "    " + createBladeString(bladeName) + ",";
            bladeArray += " // " + bladeName;
            bladeArray += "\n";
        }

        bladeArray += "    CONFIGARRAY(" + blades[blade_id]["presets"] + ")\n"
        if(blades[blade_id]["save_dir"] !== "") bladeArray += "    , " + blades[blade_id]["save_dir"];
        bladeArray += "  }\n";
    }

    bladeArray += "}\n";
    document.getElementById("bladeConfig").innerHTML = bladeArray;
}

function createBladeString(bladeName){
    console.log("createBladeString: ", bladeName);

    // inject dummy blade entry
    if(bladeName === "Dummy") {
        return "SimpleBladePtr<NoLED, NoLED, NoLED, NoLED, -1. -1, -1, -1>()";
    }

    const curBlade = blade_definitions[bladeName];

    let bladeString = "";
    let tmpString;

    switch(curBlade["type"]) {
        case "SimpleBladePtr":

            break;

        case "WS281XBladePtr":
            bladeString = curBlade["type"] + "<" + curBlade["leds"] + ", " + curBlade["data_pin"] + ", " + curBlade["byteorder"] + ", ";

            bladeString += "PowerPINS<";
            bladeString += curBlade["power_pins"]
            bladeString += "> ";

            bladeString += ">()";
            break;

        case "SubBlade":
        case "SubBladeReverse":
            tmpString = createBladeString(curBlade["blade_definition"])

            bladeString = curBlade["type"] + "(" + (curBlade["first_led"] -1) + ", " + (curBlade["last_led"] -1) + ", ";
            if(tmpString === stored_blade_string) {
                bladeString += "NULL";
            } else {
                bladeString += tmpString;
            }

            bladeString += ")";

            stored_blade_string = tmpString;
            break;

        case "SubBladeWithStride":
            tmpString = createBladeString(curBlade["blade_definition"]);

            bladeString = curBlade["type"] + "(" + (curBlade["first_led"] -1) + ", " + (curBlade["last_led"] -1) + ", ";
            bladeString += curBlade["stride_length"] + ", "
            if(tmpString === stored_blade_string) {
                bladeString += "NULL";
            } else {
                bladeString += tmpString;
            }

            bladeString += ")";

            stored_blade_string = tmpString;
            break;

        case "DimBlade":
            bladeString = curBlade["type"] + "(" + curBlade["brightness"] + ", " + createBladeString(curBlade["blade_definition"]);
            bladeString += ")";
            break;
    }

    console.log(bladeString);
    return bladeString;
}

function newBladeDefinition(){
    showTemplate("tmpNewBladeDefinition");
    showDetails();
}

function editBladeDefinitions(){
    showTemplate("tmpListBladeDefinitions");
    refreshDefinitions();
}

function addBlade(){
    showTemplate("tmpAddBlade");

    addOption("bladeDefinition", "Dummy");

    for(const def in blade_definitions){
        console.log(def);
        addOption("bladeDefinition", def);
    }
}


function refreshDefinitions(){
    const definitions = document.getElementById("lstBladeDefinitions");
    let tmp = "<table>";

    for(let definition in blade_definitions){
        tmp += "<tr>";
        tmp += "<td>" + definition + "</td>";
        tmp += "<td>" + JSON.stringify(blade_definitions[definition]) + "</td>";
        tmp += "</tr>";
    }

    tmp += "</table>";
    definitions.innerHTML = tmp;
}

function saveAddBlade(){
    const blade_id = getValue("blade_id");
    console.log("BladeID: " + blade_id);

    let bladeNo = 0;
    bladeNo += blades[blade_id]?blades[blade_id]["blades"].length:0;

    console.log("BladeNo: " + bladeNo);

    if(!blades[blade_id]) {
        blades[blade_id] = {
            presets: "presets",
            blades: [],
            save_dir: ""
        };
    }

    blades[blade_id]["blades"][bladeNo] = getValue("bladeDefinition");
    localStorage.setItem('blades', JSON.stringify(blades));

    refreshBlades();
    hideTemplate();
}

function refreshBlades(){
    removeAllOptions("currentBlades");

    const blade_id = getValue("blade_id");

    if(!blades.hasOwnProperty(blade_id)) {
        displayError("You need at least one BladeID", true);
        return;
    }

    for(let i = 0; i < blades[blade_id]["blades"].length; i++){
        addOption("currentBlades", blades[blade_id]["blades"][i]);
    }

    buildConfig()
}

function getMaxBladeNumber(){
    let max_blades = 0;

    for(const blade_id in blades) {
        max_blades = (blades[blade_id]["blades"].length > max_blades)?blades[blade_id]["blades"].length:max_blades;
    }

    return max_blades;
}

function refreshBladeIDs(){
    removeAllOptions("blade_id");

    let bladeFound = false;

    for(const id in blades){
        bladeFound = true;
        addOption("blade_id", id);
    }

    if(!bladeFound) addOption("blade_id", 0);
}


function init(){
    refreshBladeIDs();
    refreshBlades();
}

function displayError(txt, isError){
    const elem = document.getElementById("lstErrors");

    if(isError) elem.className = "error";
    else elem.className = "";

    elem.innerHTML = txt;
}

window.addEventListener("load", init);

