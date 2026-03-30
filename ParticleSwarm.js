export default class ParticleSwarm {
    constructor(funcClass, swarmSize = 50, inertia = 0.7, cognitive = 1.5, social = 1.5) {
        this.funcClass = funcClass;
        this.swarmSize = swarmSize;
        this.inertia = inertia;
        this.cognitive = cognitive;
        this.social = social;

        this.maxIterations = 150;
        this.currentIter = 0;

        this.bounds = [-5, 5];

        this.particles = [];
        for (let i = 0; i < swarmSize; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            position: {
                x: Math.random() * (this.bounds[1] - this.bounds[0]) + this.bounds[0],
                y: Math.random() * (this.bounds[1] - this.bounds[0]) + this.bounds[0]
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            pbest: null,           // личный лучший
            pbestValue: Infinity
        };
    }

    evaluate(p) {
        return this.funcClass.evaluate(p.x, p.y);
    }

    getPopulation() {
        return this.particles.map(p => ({
            x: p.position.x,
            y: p.position.y,
            z: this.evaluate(p.position)
        }));
    }

    nextIteration() {
        this.currentIter++;

        let globalBest = null;
        let globalBestValue = Infinity;

        // 1. Обновляем pbest и ищем gbest
        for (let particle of this.particles) {
            const value = this.evaluate(particle.position);

            if (value < particle.pbestValue) {
                particle.pbest = { ...particle.position };
                particle.pbestValue = value;
            }

            if (value < globalBestValue) {
                globalBest = { ...particle.position };
                globalBestValue = value;
            }
        }

        for (let particle of this.particles) {
            const pos = particle.position;
            const vel = particle.velocity;

            const r1 = Math.random();
            const r2 = Math.random();

            vel.x = this.inertia * vel.x +
                    this.cognitive * r1 * (particle.pbest.x - pos.x) +
                    this.social * r2 * (globalBest.x - pos.x);

            vel.y = this.inertia * vel.y +
                    this.cognitive * r1 * (particle.pbest.y - pos.y) +
                    this.social * r2 * (globalBest.y - pos.y);

            pos.x += vel.x;
            pos.y += vel.y;

            pos.x = Math.max(this.bounds[0], Math.min(this.bounds[1], pos.x));
            pos.y = Math.max(this.bounds[0], Math.min(this.bounds[1], pos.y));
        }

        return this.getPopulation();
    }
}