export default class GradientDescent {
    constructor(funcClass, numTrajectories = 10, learningRate = 0.01) {
        this.funcClass = funcClass;
        this.numTrajectories = numTrajectories; 
        this.learningRate = learningRate;     
        this.maxIterations = 300;
        this.currentIter = 0;

        this.trajectories = [];

        const bounds = [-5, 5];

        for (let i = 0; i < this.numTrajectories; i++) {
            const startX = Math.random() * (bounds[1] - bounds[0]) + bounds[0];
            const startY = Math.random() * (bounds[1] - bounds[0]) + bounds[0];
            this.trajectories.push([{ x: startX, y: startY }]);
        }

        this.h = 0.0001;
    }

    evaluate(x, y) {
        return this.funcClass.evaluate(x, y);
    }

    computeGradient(x, y) {
        const f_plus_x = this.evaluate(x + this.h, y);
        const f_minus_x = this.evaluate(x - this.h, y);
        const f_plus_y = this.evaluate(x, y + this.h);
        const f_minus_y = this.evaluate(x, y - this.h);

        return {
            dx: (f_plus_x - f_minus_x) / (2 * this.h),
            dy: (f_plus_y - f_minus_y) / (2 * this.h)
        };
    }

    getPopulation() {
        const points = [];
        for (const traj of this.trajectories) {
            for (const p of traj) {
                points.push({
                    x: p.x,
                    y: p.y,
                    z: this.evaluate(p.x, p.y)
                });
            }
        }
        return points;
    }

    nextIteration() {
        this.currentIter++;

        for (const traj of this.trajectories) {
            const current = traj[traj.length - 1];
            const grad = this.computeGradient(current.x, current.y);

            const newX = current.x - this.learningRate * grad.dx;
            const newY = current.y - this.learningRate * grad.dy;

            console.log('x, y, z', current.x, current.y, this.evaluate(current.x, current.y));
            traj.push({ x: newX, y: newY });
        }

        return this.getPopulation();
    }
}