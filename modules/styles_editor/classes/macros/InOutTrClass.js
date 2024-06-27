class InOutTrClass extends MACRO {
    constructor(ON, OUT_TR, IN_TR, OFF, AD) {
        super("In-out based on transitions", arguments);
        this.add_arg("ON", "COLOR", "Color when on.");
        this.add_arg("OUT_TR", "TRANSITION", "IN-OUT transition");
        this.add_arg("IN_TR", "TRANSITION", "OUT-IN transition");
        this.add_arg("OFF", "COLOR", "Color when off", BLACK.DOCOPY());
        this.add_arg("ALLOW_DISABLE", "INT", "allow disable?", 1);
        this.SetExpansion(Layers(ON, InOutTrL(OUT_TR, IN_TR, this.OFF, this.ALLOW_DISABLE)));
    }
};

function InOutTr(ON, OUT_TR, IN_TR, OFF, AD) {
    return new InOutTrClass(ON, OUT_TR, IN_TR, OFF, AD);
}