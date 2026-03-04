export default class GeneticAlgorithm {
    constructor(funcClass, popSize = 50, pc = 0.8, pm = 0.01) {
        this.funcClass = funcClass;
        this.popSize = popSize;
        this.pc = pc;           
        this.pm = pm;         
        this.maxIterations = 100;
        this.currentIter = 0;

        this.bounds = [-5, 5];

        this.population = [];
        for (let i = 0; i < this.popSize; i++) {
            this.population.push({
                x: Math.random() * (this.bounds[1] - this.bounds[0]) + this.bounds[0],
                y: Math.random() * (this.bounds[1] - this.bounds[0]) + this.bounds[0]
            });
        }
    }

    evaluate(x, y) {
        return this.funcClass.evaluate(x, y);
    }

    getPopulation() {
        return this.population.map(p => ({
            x: p.x,
            y: p.y,
            z: this.evaluate(p.x, p.y)
        }));
    }

    selectParent() {
        let best = this.population[Math.floor(Math.random() * this.popSize)];
        for (let i = 0; i < 2; i++) {
            const cand = this.population[Math.floor(Math.random() * this.popSize)];
            if (this.evaluate(cand.x, cand.y) < this.evaluate(best.x, best.y)) {
                best = cand;
            }
        }
        return { ...best };
    }

    crossover(p1, p2) {
        const alpha = Math.random() * 1.5 - 0.25;
        return [
            {
                x: p1.x + alpha * (p2.x - p1.x),
                y: p1.y + alpha * (p2.y - p1.y)
            },
            {
                x: p2.x + alpha * (p1.x - p2.x),
                y: p2.y + alpha * (p1.y - p2.y)
            }
        ];
    }

    mutate(ind) {
        if (Math.random() < this.pm) ind.x += (Math.random() - 0.5) * 1.0;
        if (Math.random() < this.pm) ind.y += (Math.random() - 0.5) * 1.0;

        ind.x = Math.max(this.bounds[0], Math.min(this.bounds[1], ind.x));
        ind.y = Math.max(this.bounds[0], Math.min(this.bounds[1], ind.y));
        return ind;
    }

    nextIteration() {
        this.currentIter++;

        const newPop = [];

        const sorted = [...this.population].sort((a, b) =>
            this.evaluate(a.x, a.y) - this.evaluate(b.x, b.y)
        );
        newPop.push({ ...sorted[0] });
        newPop.push({ ...sorted[1] });

        while (newPop.length < this.popSize) {
            const p1 = this.selectParent();
            const p2 = this.selectParent();

            if (Math.random() < this.pc) {
                let [c1, c2] = this.crossover(p1, p2);
                c1 = this.mutate(c1);
                c2 = this.mutate(c2);
                newPop.push(c1);
                if (newPop.length < this.popSize) newPop.push(c2);
            } else {
                newPop.push(this.mutate({ ...p1 }));
                if (newPop.length < this.popSize) newPop.push(this.mutate({ ...p2 }));
            }
        }

        this.population = newPop.slice(0, this.popSize);
        return this.getPopulation();
    }
}