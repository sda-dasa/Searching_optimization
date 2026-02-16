// z = 2*x*log(y)  (область определения: y > 0)
export default class Func2 {
    static getPoints(range = 5, steps = 50) {
        const points = [];
        const step = (range * 2) / steps;
        for (let i = 0; i <= steps; i++) {
            const x = -range + i * step;
            for (let j = 0; j <= steps; j++) {
                let y = -range + j * step;
                if (y <= 0) y = 0.1; // Избегаем log(0) и отрицательных
                const z = 2 * x * Math.log(y);
                points.push({ x, y, z });
            }
        }
        return points;
    }

    static getColor(z, minZ = -10, maxZ = 10) {
        const t = (z - minZ) / (maxZ - minZ);
        const r = Math.floor(255 * t);
        const b = Math.floor(255 * (1 - t));
        return (r << 16) | (b << 0);
    }

    static evaluate(x,y){
        return 2*x*Math.log(y);
    }
}