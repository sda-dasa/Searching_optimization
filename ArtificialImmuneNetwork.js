export default class ArtificialImmuneNetwork {
    constructor(funcClass, 
                populationSize = 60, 
                cloneMultiplier = 8,      // сколько клонов создаётся от каждого хорошего антитела
                mutationRate = 0.3,       // базовая сила мутации
                suppressionThreshold = 0.15) {  // порог подавления похожих решений

        this.funcClass = funcClass;
        this.populationSize = populationSize;
        this.cloneMultiplier = cloneMultiplier;
        this.mutationRate = mutationRate;
        this.suppressionThreshold = suppressionThreshold;

        this.maxIterations = 150;
        this.currentIter = 0;

        this.bounds = [-5, 5];

        // Инициализация популяции антител
        this.antibodies = [];
        for (let i = 0; i < populationSize; i++) {
            this.antibodies.push(this.createRandomAntibody());
        }

        this.bestPosition = null;
        this.bestValue = Infinity;
    }

    createRandomAntibody() {
        return {
            x: Math.random() * (this.bounds[1] - this.bounds[0]) + this.bounds[0],
            y: Math.random() * (this.bounds[1] - this.bounds[0]) + this.bounds[0]
        };
    }

    evaluate(p) {
        return this.funcClass.evaluate(p.x, p.y);
    }

    getPopulation() {
        return this.antibodies.map(ab => ({
            x: ab.x,
            y: ab.y,
            z: this.evaluate(ab)
        }));
    }

    mutate(antibody, affinity) {
        const mutationStrength = this.mutationRate * (1 - affinity);

        return {
            x: antibody.x + (Math.random() - 0.5) * 2 * mutationStrength * (this.bounds[1] - this.bounds[0]),
            y: antibody.y + (Math.random() - 0.5) * 2 * mutationStrength * (this.bounds[1] - this.bounds[0])
        };
    }

    nextIteration() {
        this.currentIter++;

        let allClones = [];

        // 1. Оцениваем текущее сродство всех антител
        let ranked = this.antibodies
            .map(ab => ({
                position: ab,
                value: this.evaluate(ab),
                affinity: 0 // будет рассчитано ниже
            }))
            .sort((a, b) => a.value - b.value); // от лучшего к худшему

        // Обновляем глобальный лучший
        if (ranked[0].value < this.bestValue) {
            this.bestValue = ranked[0].value;
            this.bestPosition = { ...ranked[0].position };
        }

        // 2. Клональная селекция + гипермутация
        const numToClone = Math.floor(this.populationSize / 3); // клонируем только лучшую треть

        for (let i = 0; i < numToClone; i++) {
            const parent = ranked[i];
            const affinity = 1 / (1 + parent.value); // нормализуем сродство

            for (let j = 0; j < this.cloneMultiplier; j++) {
                let clone = this.mutate(parent.position, affinity);
                allClones.push(clone);
            }
        }

        // 3. Добавляем случайные новые антитела (разнообразие)
        const numRandom = this.populationSize - allClones.length;
        for (let i = 0; i < numRandom; i++) {
            allClones.push(this.createRandomAntibody());
        }

        // 4. Подавление похожих решений (suppression)
        this.antibodies = this.suppressSimilar(allClones);

        return this.getPopulation();
    }

    suppressSimilar(antibodies) {
        let result = [];
        let used = new Set();

        for (let i = 0; i < antibodies.length; i++) {
            if (used.has(i)) continue;

            result.push(antibodies[i]);

            for (let j = i + 1; j < antibodies.length; j++) {
                if (used.has(j)) continue;

                const dist = Math.hypot(
                    antibodies[i].x - antibodies[j].x,
                    antibodies[i].y - antibodies[j].y
                );

                if (dist < this.suppressionThreshold) {
                    used.add(j);
                }
            }
        }

        // Если после подавления осталось мало — добавляем случайных
        while (result.length < this.populationSize) {
            result.push(this.createRandomAntibody());
        }

        return result.slice(0, this.populationSize);
    }
}