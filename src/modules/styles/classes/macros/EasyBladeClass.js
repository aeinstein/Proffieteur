class EasyBladeClass extends MACRO {
    constructor(COLOR, CLASH_COLOR, LOCKUP_FLICKER_COLOR) {
        super("Adds clash/lockup/blast/drag", arguments);
        this.add_arg("COLOR", "COLOR", "Main color");
        this.add_arg("CLASH_COLOR", "COLOR", "Clash color");
        this.add_arg("LOCKUP_FLICKER_COLOR", "COLOR", "lockup flicker color", WHITE.DOCOPY());

        this.SetExpansion(
            SimpleClash(Lockup(Blast(this.COLOR, WHITE.DOCOPY()), AudioFlicker(this.COLOR.DOCOPY(), this.LOCKUP_FLICKER_COLOR)), this.CLASH_COLOR)
        );
    }
}

function EasyBlade(color, clash_color, lockup_flicker_color) {
    return new EasyBladeClass(color, clash_color, lockup_flicker_color);
}