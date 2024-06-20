class LayerFunctionsClass extends FUNCTION {
    constructor(ARGS) {
        super("Mix functions", ARGS);
        this.LAYERS = Array.from(ARGS);
        for (var i = 1; i < this.LAYERS.length + 1; i++)
            this.add_arg("FUNCTION" + i, "FUNCTION", "FUNCTION " + i);
    }

    getInteger(led) {
        var ret = 0;
        for (var i = 0; i < this.LAYERS.length; i++) {
            ret = 32768 - ((((32768 - ret) * (32768 - this.LAYERS[i].getInteger(led)))) >> 15);
        }
        return ret;
    }
};

function LayerFunctions(Layer1, Layer2) {
    return new LayerFunctionsClass(Array.from(arguments));
}