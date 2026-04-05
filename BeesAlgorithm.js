export default class BeesAlgorithm {
    constructor(funcClass, 
                numScouts = 20,           
                numElite = 3,             
                numBest = 6,              
                eliteBees = 12,           
                bestBees = 6,             
                patchSize = 1.5) {        

        this.funcClass = funcClass;
        this.numScouts = numScouts;
        this.numElite = numElite;
        this.numBest = numBest;
        this.eliteBees = eliteBees;
        this.bestBees = bestBees;
        this.patchSize = patchSize;

        this.maxIterations = 120;
        this.currentIter = 0;

        this.bounds = [-5, 5];

        this.bestPosition = null;
        this.bestValue = Infinity;

        this.scouts = [];
        for (let i = 0; i < numScouts; i++) {
            this.scouts.push(this.createRandomPoint());
        }
    }

    createRandomPoint() {
        return {
            x: Math.random() * (this.bounds[1] - this.bounds[0]) + this.bounds[0],
            y: Math.random() * (this.bounds[1] - this.bounds[0]) + this.bounds[0]
        };
    }

    evaluate(p) {
        return this.funcClass.evaluate(p.x, p.y);
    }

    getPopulation() {
        return this.scouts.map(p => ({
            x: p.x,
            y: p.y,
            z: this.evaluate(p)
        }));
    }

    nextIteration() {
        this.currentIter++;

        let allPoints = [...this.scouts];

        let ranked = allPoints
            .map(p => ({ position: p, value: this.evaluate(p) }))
            .sort((a, b) => a.value - b.value); // сортируем по возрастанию (минимум)

        if (ranked[0].value < this.bestValue) {
            this.bestValue = ranked[0].value;
            this.bestPosition = { ...ranked[0].position };
        }

        const eliteSites = ranked.slice(0, this.numElite);
        const bestSites = ranked.slice(this.numElite, this.numElite + this.numBest);

        let newScouts = [];

        eliteSites.forEach(site => {
            for (let i = 0; i < this.eliteBees; i++) {
                newScouts.push(this.localSearch(site.position));
            }
        });

        bestSites.forEach(site => {
            for (let i = 0; i < this.bestBees; i++) {
                newScouts.push(this.localSearch(site.position));
            }
        });

        const remaining = this.numScouts - newScouts.length;
        for (let i = 0; i < remaining; i++) {
            newScouts.push(this.createRandomPoint());
        }

        this.scouts = newScouts;

        this.patchSize = Math.max(0.1, this.patchSize * 0.95);

        return this.getPopulation();
    }

    localSearch(center) {
        return {
            x: center.x + (Math.random() - 0.5) * 2 * this.patchSize,
            y: center.y + (Math.random() - 0.5) * 2 * this.patchSize
        };
    }
}