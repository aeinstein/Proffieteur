
class InvertFClass extends MACRO {
    constructor(F) {
        super("Invert input function", arguments);
        this.add_arg("F", "FUNCTION", "Function to invert.");
        this.SetExpansion(Scale(this.F, Int(32768), Int(0)));
    }
};

function InvertF(F) {
    return new InvertFClass(F);
}