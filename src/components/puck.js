import Matter from 'matter-js';

import { Mesh } from '../../node_modules/three/src/objects/Mesh';
import { CylinderBufferGeometry } from '../../node_modules/three/src/geometries/CylinderGeometry';
import { MeshPhongMaterial } from '../../node_modules/three/src/materials/MeshPhongMaterial';

const size = 8;

const ballCol = new MeshPhongMaterial({ color: "#0000ff", shininess: 0 });
const ballGeo = new CylinderBufferGeometry(size,size,2,16);
const ballMesh = new Mesh( ballGeo, ballCol );
ballMesh.rotation.set(Math.PI/2,0,0);
ballMesh.translateY(30);

const ball = Matter.Bodies.circle(0, 0, size, {
    friction: 0.0,
    frictionAir: 0.0,
    frictionStatic: 0,
    restitution: 1.0,
    density: 0.003,
    inverseInertia: 0
});

export default { mesh: ballMesh, phys: ball }
