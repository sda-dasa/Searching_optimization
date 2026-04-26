import * as THREE from 'three';

export default class RosenbrockFunction {
    
    static getPoints(range = 3, steps = 20) {
        const points = [];
        const step = (range * 2) / steps;
        for (let i = 0; i <= steps; i++) {
            const x = -range + i * step;
            for (let j = 0; j <= steps; j++) {
                const y = -range + j * step;
                const z = (1-x)**2 + 100*(y - x*x)**2;
                points.push({ z, y, x });
            }
        }
        return points;
    }



    static getColor(z, maxZ = 10) {
        const t = Math.min(z / maxZ, 1);

        const r = Math.floor(255 * t);
        const g = 255;
        const b = Math.floor(255 * (1 - t));
        return (r << 16) | (g << 8) | b;
    }

    static evaluate(x,y){
        let result= (1/500)*((1-x)**2 + 100*(y - x*x)**2);
        if (result > 15) {return 15;}
        return result;
    }


    static getSurfaceMesh(range = 3, segments = 20) {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const indices = [];
        
        const step = (range * 2) / segments;
        
        for (let i = 0; i <= segments; i++) {
            const x = -range + i * step;
            for (let j = 0; j <= segments; j++) {
                const y = -range + j * step;
                const z = this.evaluate(x, y);
                vertices.push(y, z, x);
            }
        }
        
        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < segments; j++) {
                const a = i * (segments + 1) + j;
                const b = i * (segments + 1) + j + 1;
                const c = (i + 1) * (segments + 1) + j;
                const d = (i + 1) * (segments + 1) + j + 1;
                indices.push(a, b, c);
                indices.push(b, d, c);
            }
        }

        const colors = [];
        
        for (let i = 0; i <= segments; i++) {
            for (let j = 0; j <= segments; j++) {
                const x = -range + i * step;
                const y = -range + j * step;
                const z = this.evaluate(x, y);
                const color = this.getColor(2*z);
                colors.push(((color >> 16) & 255) / 255, ((color >> 8) & 255) / 255, (color & 255) / 255);
            }
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
        const material = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
        
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        

        return new THREE.Mesh(geometry, material);

    }
   


}