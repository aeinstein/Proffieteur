export class Buttons {
    buttons;

    constructor() {
        this.buttons = JSON.parse(localStorage.getItem("BUTTONS"));
    }

    getConfg(){
        let ret = "";

        switch(this.buttons["button1"]){
            case "latching":
                ret += "LatchingButton PowerButton(BUTTON_POWER, powerButtonPin, \"pow\");\n";
                break;

            case "momentary":
                ret += "Button PowerButton(BUTTON_POWER, powerButtonPin, \"pow\");\n";
                break;

            case "touch":
                ret += "TouchButton PowerButton(BUTTON_POWER, powerButtonPin, 1700, \"pow\");\n";
                break;
        }

        switch(this.buttons["button2"]){
            case "latching":
                ret += "LatchingButton PowerButton(BUTTON_AUX, auxPin, \"aux\");\n";
                break;

            case "momentary":
                ret += "Button PowerButton(BUTTON_AUX, auxPin, \"aux\");\n";
                break;

            case "touch":
                ret += "TouchButton PowerButton(BUTTON_AUX, auxPin, 1700, \"aux\");\n";
                break;
        }

        switch(this.buttons["button3"]){
            case "latching":
                ret += "LatchingButton PowerButton(BUTTON_AUX2, aux2Pin, \"aux\");\n";
                break;

            case "momentary":
                ret += "Button PowerButton(BUTTON_AUX2, aux2Pin, \"aux\");\n";
                break;

            case "touch":
                ret += "TouchButton PowerButton(BUTTON_AUX2, aux2Pin, 1700, \"aux\");\n";
                break;
        }



        return ret;
    }
}
