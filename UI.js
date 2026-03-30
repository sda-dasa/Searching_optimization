import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Func1 from './Func1.js';
import Func2 from './Func2.js';
import SphereFunction from './SphereFunction.js';
import HimmelblauFunction from './HimmelblauFunction.js';
import RosenbrockFunction from './RosenbrockFunction.js';
import TestAlgorithm1 from './TestAlgorithm1.js';
import TestAlgorithm2 from './TestAlgorithm2.js';
import GradientDescent from './GradientDescent.js';
import GeneticAlgorithm from './GeneticAlgorithm.js';
import ParticleSwarm from './ParticleSwarm.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 10);
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);

const funcSelector = document.getElementById('funcSelector');
const algoSelector = document.getElementById('algoSelector');
const algo1Panel = document.getElementById('algo1Panel');
const algo2Panel = document.getElementById('algo2Panel');
const maxIter = document.getElementById('maxIter');
const xMin = document.getElementById('xMin');
const algo3Panel = document.getElementById('algo3Panel');
const algo4Panel = document.getElementById('algo4Panel');
const algo5Panel = document.getElementById('algo5Panel');
const lrInput = document.getElementById('lrInput');
const trajCountInput = document.getElementById('trajCountInput');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const pointsOutput = document.getElementById("pointsOutput");
const swarmSizeInput = document.getElementById('swarmSize');
const inertiaInput = document.getElementById('inertia');
const cognitiveInput = document.getElementById('cognitive');
const socialInput = document.getElementById('social');


const popSizeInput = document.getElementById('popSize');
const pcInput = document.getElementById('pc');
const pmInput = document.getElementById('pm');

const functions = {
    '1': Func1, '2': Func2, '3': SphereFunction,
    '4': HimmelblauFunction, '5': RosenbrockFunction
};

let isPaused = false;
let funcClass = Func1;
let funcMesh = null;
let algorithm = new TestAlgorithm1();
let pointsMesh = null;
let iterInterval = null;

function createFuncMesh() {
    if (funcMesh) scene.remove(funcMesh);
    const points = funcClass.getPoints();
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    
    points.forEach(p => {
        positions.push(p.y, p.z, p.x);
        const col = funcClass.getColor(p.z);
        colors.push(((col >> 16) & 255)/255, ((col >> 8) & 255)/255, (col & 255)/255);
    });
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    funcMesh = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.1, vertexColors: true }));
    scene.add(funcMesh);
}

function createPointsMesh(points) {
    if (pointsMesh) scene.remove(pointsMesh);
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    points.forEach(p => positions.push(p.y, p.z, p.x));
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    pointsMesh = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xff0000, size: 0.2 }));
    scene.add(pointsMesh);
}

function startAnimation() {
    isPaused = false;
    pauseBtn.textContent = "Pause";

    if (iterInterval) clearInterval(iterInterval);

    algorithm.currentIter = 0;
    algorithm.maxIterations = parseInt(maxIter.value);

    if (algorithm instanceof TestAlgorithm2)
        algorithm.xMin = parseFloat(xMin.value);

    const points = algorithm.getPopulation();
    createPointsMesh(points);
    displayPoints(points);

    runIterations();

}

funcSelector.addEventListener('change', (e) => {
    funcClass = functions[e.target.value];
    createFuncMesh();

    algorithm = createAlgorithm();
    startAnimation();   
});

algoSelector.addEventListener('change', (e) => {
    if (iterInterval) clearInterval(iterInterval);
    algorithm = createAlgorithm();

    algo1Panel.style.display = e.target.value === '1' ? 'block' : 'none';
    algo2Panel.style.display = e.target.value === '2' ? 'block' : 'none';
    algo3Panel.style.display = e.target.value === '3' ? 'block' : 'none';
    algo4Panel.style.display = e.target.value === '4' ? 'block' : 'none';
    algo5Panel.style.display = e.target.value === '5' ? 'block' : 'none';
    startAnimation();
});


restartBtn.addEventListener('click', () => {

    algorithm = createAlgorithm();
    startAnimation();
});


pauseBtn.addEventListener('click', () => {

    if (!isPaused) {
        clearInterval(iterInterval);
        pauseBtn.textContent = "Resume";
        isPaused = true;
    } else {
        runIterations();
        pauseBtn.textContent = "Pause";
        isPaused = false;
    }

});

function runIterations() {

    iterInterval = setInterval(() => {

        if (algorithm.currentIter >= algorithm.maxIterations) {
            clearInterval(iterInterval);
            return;
        }

        const points = algorithm.nextIteration();
        createPointsMesh(points);
        displayPoints(points);

    }, 500);

}

function displayPoints(points) {

    const maxPoints = Math.min(points.length, 10);
    let text = "";

    for (let i = 0; i < maxPoints; i++) {
        const p = points[i];
        text += `Point ${i}: x=${p.x.toFixed(3)}  y=${p.y.toFixed(3)}  z=${p.z.toFixed(3)}\n`;
    }

    if (points.length > 10) {
        text += `\n... (${points.length - 10} more points)`;
    }

    pointsOutput.textContent = text;
}
maxIter.addEventListener('input', () => { 
    if (algorithm instanceof TestAlgorithm1 || 
        algorithm instanceof GeneticAlgorithm || 
        algorithm instanceof ParticleSwarm) startAnimation(); 
});
maxIter.addEventListener('input', () => { if (algorithm instanceof TestAlgorithm1) startAnimation(); });
xMin.addEventListener('change', () => { if (algorithm instanceof TestAlgorithm2) startAnimation(); });
lrInput.addEventListener('input', () => {if (algorithm instanceof GradientDescent) startAnimation();});
trajCountInput.addEventListener('input', () => {if (algorithm instanceof GradientDescent) startAnimation();});


popSizeInput.addEventListener('change', () => { if (algorithm instanceof GeneticAlgorithm) startAnimation(); });
pcInput.addEventListener('change', () => { if (algorithm instanceof GeneticAlgorithm) startAnimation(); });
pmInput.addEventListener('change', () => { if (algorithm instanceof GeneticAlgorithm) startAnimation(); });

swarmSizeInput.addEventListener('change', () => { if (algorithm instanceof ParticleSwarm) startAnimation(); });
inertiaInput.addEventListener('change', () => { if (algorithm instanceof ParticleSwarm) startAnimation(); });
cognitiveInput.addEventListener('change', () => { if (algorithm instanceof ParticleSwarm) startAnimation(); });
socialInput.addEventListener('change', () => { if (algorithm instanceof ParticleSwarm) startAnimation(); });

scene.add(new THREE.AxesHelper(5));
createFuncMesh();
startAnimation();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function createAlgorithm() {
    const algoType = algoSelector.value;

    if (algoType === '1') {
        return new TestAlgorithm1();
    } 
    else if (algoType === '2') {
        return new TestAlgorithm2();
    } 
    else if (algoType === '3') {
        const lr = parseFloat(lrInput.value) || 0.01;
        const trajCount = parseInt(trajCountInput.value) || 10;
        return new GradientDescent(funcClass, trajCount, lr);
    } 
    else if (algoType === '4') {
        return new GeneticAlgorithm(
            funcClass,
            parseInt(popSizeInput.value) || 50,
            parseFloat(pcInput.value) || 0.8,
            parseFloat(pmInput.value) || 0.01
        );
    }
    else if (algoType === '5') {
        return new ParticleSwarm(
            funcClass,
            parseInt(document.getElementById('swarmSize').value) || 50,
            parseFloat(document.getElementById('inertia').value) || 0.7,
            parseFloat(document.getElementById('cognitive').value) || 1.5,
            parseFloat(document.getElementById('social').value) || 1.5
        );
    }
}

animate();