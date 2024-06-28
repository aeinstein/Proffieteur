export class Buttons {
    num_buttons;

    constructor() {
        this.num_buttons = JSON.parse(localStorage.getItem("TOP")).NUM_BUTTONS;
    }

    getConfg(){
        let ret = "";

        switch(this.num_buttons){
            case 1:
                ret += "Button PowerButton(BUTTON_POWER, powerButtonPin, \"pow\");\n";
        }

        return ret;
    }
}
