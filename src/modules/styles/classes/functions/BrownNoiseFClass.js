
class BrownNoiseFClass extends FUNCTION {
    constructor(grade) {
        super("Randomly return values between 0 and 32768, but keeps nearby values similar", Array.from(arguments));
        this.add_arg("GRADE", "FUNCTION", "grade");
    }

    run(blade) {
        super.run(blade);
        this.mix = Math.floor(Math.random() * 32768);
    }

    getInteger(led) {
        const grade = this.GRADE.getInteger(led);
        this.mix += Math.floor(Math.random() * (grade * 2 + 1)) - grade;
        this.mix = clamp(this.mix, 0, 32768);
        return this.mix;
    }
}

function BrownNoiseF(grade) {
    return new BrownNoiseFClass(grade);
}