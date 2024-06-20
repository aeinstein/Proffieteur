class AlphaMixLClass extends MACRO {
    constructor(ARGS) {
        super("Mix and alpha", ARGS);
        this.COLORS = Array.from(ARGS).slice(1);
        this.add_arg("F", "FUNCTION", "0=first color, 32768=last color");
        for (let i = 1; i < this.COLORS.length + 1; i++)
            this.add_arg("COLOR" + i, "COLOR", "COLOR " + i);
        this.SetExpansion(AlphaL(new MixClass(ARGS), this.F.DOCOPY()));
    }
}

function AlphaMixL(F, C1, C2) {
    return new AlphaMixLClass(Array.from(arguments));
}