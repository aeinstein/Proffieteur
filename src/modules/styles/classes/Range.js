class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    Size() {
        return max(0, this.end - this.start);
    }

    Intersect(other) {
        return new Range(max(this.start, other.start), min(this.end, other.end));
    }
}