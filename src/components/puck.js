import Matter from 'matter-js';

import { Mesh } from '../../node_modules/three/src/objects/Mesh';
import { CylinderBufferGeometry } from '../../node_modules/three/src/geometries/CylinderGeometry';
import { MeshPhongMaterial } from '../../node_modules/three/src/materials/MeshPhongMaterial';

const ballCol = new MeshPhongMaterial({ color: "#0000ff", shininess: 0 });
const ballGeo = new CylinderBufferGeometry(25,25,10,16);
const ballMesh = new Mesh( ballGeo, ballCol );
ballMesh.rotation.set(Math.PI/2,0,0);
ballMesh.translateY(15);

const ball = Matter.Bodies.circle(200, 200, 25, {
    friction: 0.0,
    frictionAir: 0.0,
    frictionStatic: 0.25,
    restitution: 1.0,
    density: 0.005
});

export default { mesh: ballMesh, phys: ball }
