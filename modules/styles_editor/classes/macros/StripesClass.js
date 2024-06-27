

class StripesClass extends MACRO {
    constructor(ARGS) {
        super("Configurable rainbow", ARGS);
        this.add_arg("WIDTH", "INT", "Stripe width");
        this.add_arg("SPEED", "INT", "Scroll speed");
        this.COLORS = ARGS.slice(2);
        for (let i = 1; i < this.COLORS.length + 1; i++)
            this.add_arg("COLOR" + i, "COLOR", "COLOR " + i);

        this.SetExpansion(new StripesXClass([Int(this.WIDTH), Int(this.SPEED)].concat(this.COLORS)));
    }
}

function Stripes(W, S, C) {
    return new StripesClass(Array.from(arguments));
}