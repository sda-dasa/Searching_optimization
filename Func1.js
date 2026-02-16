// z = x + y
export default class Func1 {
    static getPoints(range = 5, steps = 50) {
        const points = [];
        const step = (range * 2) / steps;
        for (let i = 0; i <= steps; i++) {
            const x = -range + i * step;
            for (let j = 0; j <= steps; j++) {
                const y = -range + j * step; // y будет отрицательным для log? Оставим как есть.
                const z = x + y;
                points.push({ x, y, z });
            }
        }
        return points;
    }

    static getColor(z, minZ = -10, maxZ = 10) {
        const t = (z - minZ) / (maxZ - minZ);
        const r = Math.floor(255 * t);
        const b = Math.floor(255 * (1 - t));
        return (r << 16) | (b << 0); // Цвет от синего к красному
    }

    static evaluate(x,y){
        return x+y;
    }
}