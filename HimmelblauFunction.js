
export default class HimmelblauFunction {
    static getPoints(range = 5, steps = 100) {
        const points = [];
        const step = (range * 2) / steps;
        for (let i = 0; i <= steps; i++) {
            const x = -range + i * step;
            for (let j = 0; j <= steps; j++) {
                const y = -range + j * step;
                const z = (x*x + y - 11)**2 + (x + y*y - 7)**2;
                points.push({ z, y, x });
            }
        }
        return points;
    }

    static getColor(z, minZ = 0, maxZ = 50) {
        const t = Math.min(z / maxZ, 1);

        const r = Math.floor(255 * t);
        const g = 255;
        const b = Math.floor(255 * (1 - t));
        return (r << 16) | (g << 8) | b;
    }

    static evaluate(x,y){
        return (x*x + y - 11)**2 + (x + y*y - 7)**2;
    }
}