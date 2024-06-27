class StyleFirePtrClass extends MACRO {
    constructor(COLOR1, COLOR2,
                BLADE_NUM, DELAY, SPEED,
                NORM_BASE, NORM_RAND, NORM_COOL,
                CLSH_BASE, CLSH_RAND, CLSH_COOL,
                LOCK_BASE, LOCK_RAND, LOCK_COOL,
                OFF_BASE, OFF_RAND, OFF_COOL) {
        super("Fire Blade", arguments);
        this.add_arg("COLOR1", "COLOR", "Warm color.");
        this.add_arg("COLOR2", "COLOR", "Hot color.");
        this.add_arg("BLADE_NUM", "INT", "Ignored", INT(1));
        this.add_arg("DELAY", "INT", "ignition delay", INT(0));
        this.add_arg("SPEED", "INT", "fire speed", INT(2));
        this.add_arg("NORM_BASE", "INT", "constant heat added in normal mode", INT(0));
        this.add_arg("NORM_RAND", "INT", "random heat added in normal mode", INT(2000));
        this.add_arg("NORM_COOL", "INT", "cooling in normal mode", INT(5));

        this.add_arg("CLSH_BASE", "INT", "constant heat added in clash mode", INT(3000));
        this.add_arg("CLSH_RAND", "INT", "random heat added in clash mode", INT(0));
        this.add_arg("CLSH_COOL", "INT", "cooling in clash mode", INT(0));

        this.add_arg("LOCK_BASE", "INT", "constant heat added in lockup mode", INT(0));
        this.add_arg("LOCK_RAND", "INT", "random heat added in lockup mode", INT(5000));
        this.add_arg("LOCK_COOL", "INT", "cooling in lockup mode", INT(10));

        this.add_arg("OFF_BASE", "INT", "constant heat added in off mode", INT(0));
        this.add_arg("OFF_RAND", "INT", "random heat added in off mode", INT(0));
        this.add_arg("OFF_COOL", "INT", "cooling in off mode", INT(10));
        this.SetExpansion(StyleFire(
            this.COLOR1, this.COLOR2,
            this.DELAY, this.SPEED,
            FireConfig(this.NORM_BASE, this.NORM_RAND, this.NORM_COOL),
            FireConfig(this.CLSH_BASE, this.CLSH_RAND, this.CLSH_COOL),
            FireConfig(this.LOCK_BASE, this.LOCK_RAND, this.LOCK_COOL),
            FireConfig(this.OFF_BASE, this.OFF_RAND, this.OFF_COOL)));
    }
};

function StyleFirePtr(COLOR1, COLOR2,
                      BLADE_NUM, DELAY, SPEED,
                      NORM_BASE, NORM_RAND, NORM_COOL,
                      CLSH_BASE, CLSH_RAND, CLSH_COOL,
                      LOCK_BASE, LOCK_RAND, LOCK_COOL,
                      OFF_BASE, OFF_RAND, OFF_COOL) {
    return new StyleFirePtrClass(COLOR1, COLOR2,
        BLADE_NUM, DELAY, SPEED,
        NORM_BASE, NORM_RAND, NORM_COOL,
        CLSH_BASE, CLSH_RAND, CLSH_COOL,
        LOCK_BASE, LOCK_RAND, LOCK_COOL,
        OFF_BASE, OFF_RAND, OFF_COOL);
}