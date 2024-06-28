export class Styles{
    style;

    constructor() {
        this.styles = JSON.parse(localStorage.getItem("STYLES"));
    }

    getConfig(){
        let ret = "";

        for(const style in this.styles){
            ret += "using " + style + " = " + this.styles[style] + ";\n";
        }

        return ret;
    }
}