export class BladeConfig{
    blade_definitions = JSON.parse(localStorage.blade_definitions || "{}");
    blades = JSON.parse(localStorage.blades || "{}");
    presets = JSON.parse(localStorage.PRESETS || "{}");
    bc;
    stored_blade_string;

    constructor() {
        this.bc = new BroadcastChannel('proffiediag');

    }

    clrBlades(blade_id){
        this.blades[blade_id]["blades"] = [];
        this.store();
    }

    clrBladeID(blade_id){
        delete this.blades[blade_id];
        this.store();
    }

    getMaxBladeNumber(){
        let max_blades = 0;

        for(const blade_id in this.blades) {
            let len = this.blades[blade_id]["blades"]?this.blades[blade_id]["blades"].length:0

            max_blades = (len > max_blades)?len:max_blades;
        }

        localStorage.setItem("NUM_BLADES", max_blades);

        return max_blades;
    }

    createBladeString(bladeName){
        console.log("createBladeString: ", bladeName);

        // inject dummy blade entry
        if(bladeName === "Dummy") {
            return "SimpleBladePtr<NoLED, NoLED, NoLED, NoLED, -1, -1, -1, -1>()";
        }

        const curBlade = this.blade_definitions[bladeName];

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
                tmpString = this.createBladeString(curBlade["blade_definition"])

                bladeString = curBlade["type"] + "(" + (curBlade["first_led"] -1) + ", " + (curBlade["last_led"] -1) + ", ";
                if(tmpString === this.stored_blade_string) {
                    bladeString += "NULL";
                } else {
                    bladeString += tmpString;
                }

                bladeString += ")";

                this.stored_blade_string = tmpString;
                break;

            case "SubBladeWithStride":
                tmpString = this.createBladeString(curBlade["blade_definition"]);

                bladeString = curBlade["type"] + "(" + (curBlade["first_led"] -1) + ", " + (curBlade["last_led"] -1) + ", ";
                bladeString += curBlade["stride_length"] + ", "
                if(tmpString === this.stored_blade_string) {
                    bladeString += "NULL";
                } else {
                    bladeString += tmpString;
                }

                bladeString += ")";

                this.stored_blade_string = tmpString;
                break;

            case "DimBlade":
                bladeString = curBlade["type"] + "(" + curBlade["brightness"] + ", " + this.createBladeString(curBlade["blade_definition"]);
                bladeString += ")";
                break;
        }

        console.log(bladeString);
        return bladeString;
    }

    getDefinitions(){
        return this.blade_definitions;
    }

    getDefinition(definition){
        return this.blade_definitions[definition];
    }

    setBlade(blade_id, bladeNo, definition){
        this.blades[blade_id]["blades"][bladeNo] = definition;
        this.store();
    }

    setBlades(blade_id, blades){
        this.blades[blade_id] = blades;
    }

    getNumBlades(blade_id){
        return this.blades[blade_id]?this.blades[blade_id]["blades"].length:0
    }

    getBlades(blade_id){
        return this.blades[blade_id]["blades"];
    }

    getBladeID(blade_id){
        return this.blades[blade_id];
    }

    hasBladeID(blade_id){
        return this.blades.hasOwnProperty(blade_id);
    }

    getConfig(){
        displayStatus("No Errors found", false);

        //setValue("num_blades", bladeConfig.getMaxBladeNumber());

        let bladeString = "BladeConfig blades[] = {\n";

        for(const blade_id in this.blades) {
            if(this.blades[blade_id].blades.length !== this.getMaxBladeNumber()) {
                displayStatus("BladeID " + blade_id + " must have " + this.getMaxBladeNumber() + " blades", true);
                //continue;
            }

            this.stored_blade_string = "";

            console.log("writing blade: " + blade_id);
            bladeString += "  {\n";
            bladeString += "    " + blade_id + ",\n";

            for (let i = 0; i < this.blades[blade_id]["blades"].length; i++) {
                let bladeName = this.blades[blade_id]["blades"][i]
                bladeString += "    " + this.createBladeString(bladeName) + ",";
                bladeString += " // " + bladeName;
                bladeString += "\n";
            }

            bladeString += "    CONFIGARRAY(" + this.blades[blade_id]["presets"] + ")\n"

            if(!this.presets.hasOwnProperty(this.blades[blade_id]["presets"])) this.presets[this.blades[blade_id]["presets"]] = [];

            if(this.blades[blade_id]["save_dir"] !== "") bladeString += "    , " + this.blades[blade_id]["save_dir"];
            bladeString += "  },\n";
        }

        bladeString += "};\n";

        localStorage.setItem("PRESETS", JSON.stringify(this.presets));

        return(bladeString);
    }

    saveBladeDefinition(bladeName){
        if(bladeName === "") {
            displayStatus("please provide a name", true);
            return;
        }

        switch(getValue("newBladeType")){
            case "SimpleBladePtr":
                this.blade_definitions[bladeName] = {
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
                this.blade_definitions[bladeName] = {
                    type: "DimBlade",
                    brightness: getValue("brightness"),
                    blade_definition: getValue("dim_bladeDefinition")
                }

                break;

            case "SubBlade":
                let type = "SubBlade";

                let max_led = this.blade_definitions[getValue("sb_bladeDefinition")].leds *1;
                let first_led= getValue("sb_first") *1;
                let last_led= getValue("sb_last") *1;
                let stride = getValue("sb_stride") *1;


                console.log("stride: ", stride);

                console.log("max led: " + max_led);

                if(first_led <= 0 || first_led > max_led +1 ) {
                    displayStatus("First led must not exceed blade length", true);
                    return;
                }

                if(last_led <= 0 || last_led > max_led +1) {
                    displayStatus("Last led must not exceed blade length", true);
                    return;
                }

                this.blade_definitions[bladeName] = {
                    type: type,
                    first_led: first_led,
                    last_led: last_led,
                    blade_definition: getValue("sb_bladeDefinition")
                }

                if(first_led > last_led) {
                    console.log("SubBladeReverse");
                    this.blade_definitions[bladeName]["type"] = "SubBladeReverse";
                }

                if(stride > 1) {
                    console.log("SubBladeWithStride");
                    this.blade_definitions[bladeName]["type"] = "SubBladeWithStride";
                    this.blade_definitions[bladeName]["stride_length"] = stride;
                }

                break;

            case "WS281XBladePtr":
                if(getValue("numLeds") < 0) {
                    displayStatus("Number of leds < 0??", true);
                    return;
                }


                this.blade_definitions[bladeName] = {
                    type: "WS281XBladePtr",
                    leds: getValue("numLeds"),
                    data_pin: getValue("dataPin"),
                    byteorder: getValue("byte_order"),
                    power_pins: getSelectValues("powerpins")
                }

                if(getValue("pin_class")) this.blade_definitions[bladeName]["pin_class"] = getValue("pin_class");
                if(getValue("frequency")) this.blade_definitions[bladeName]["frequency"] = getValue("frequency");
                if(getValue("reset_us")) this.blade_definitions[bladeName]["reset_us"] = getValue("reset_us");
                if(getValue("t1h")) this.blade_definitions[bladeName]["t1h"] = getValue("t1h");
                if(getValue("t0h")) this.blade_definitions[bladeName]["t0h"] = getValue("t0h");
                break;
        }

        localStorage.setItem('blade_definitions', JSON.stringify(this.blade_definitions));
    }

    store(){
        localStorage.setItem('blades', JSON.stringify(this.blades));
    }
}