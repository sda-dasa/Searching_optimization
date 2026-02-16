export default class TestAlgorithm2 {
    constructor(pointCount = 100) {
        this.pointCount = pointCount;
        this.maxIterations = 100;
        this.currentIter = 0;
    }

    getPopulation() {
        const points = [];
        for (let i = 0; i < this.pointCount; i++) {
            points.push({
                x: (Math.random() - 0.5) * 10,
                y: (Math.random() - 0.5) * 10,
                z: (Math.random() - 0.5) * 10
            });
        }
        return points;
    }

    nextIteration() {
        this.currentIter++;
        const factor = 1 - this.currentIter / this.maxIterations;
        const points = [];
        for (let i = 0; i < this.pointCount; i++) {
            points.push({
                x: (Math.random() - 0.5) * 10 * factor,
                y: (Math.random() - 0.5) * 10 * factor,
                z: (Math.random() - 0.5) * 10 * factor
            });
        }
        return points;
    }
}