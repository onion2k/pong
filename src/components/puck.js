import Matter from 'matter-js';

import { Mesh } from '../../node_modules/three/src/objects/Mesh';
import { CylinderBufferGeometry } from '../../node_modules/three/src/geometries/CylinderGeometry';
import { MeshPhysicalMaterial } from '../../node_modules/three/src/materials/MeshPhysicalMaterial';

let pucks = 0;

const ballCol = new MeshPhysicalMaterial({ color: "#FF4444", roughness: 1 });

function puck(mesh) {

    const size = 2;
    const modelFactor = 3;
    const id = "puck-"+(++pucks);

    mesh.scale.set(size*modelFactor,size*modelFactor,size*modelFactor);

    const ball = Matter.Bodies.circle(0, 0, size*modelFactor*3, {
        friction: 0.0,
        frictionAir: 0.0,
        frictionStatic: 0,
        restitution: 1.0,
        density: 0.003,
        inverseInertia: 0,
        label: id
    });

    return { mesh: mesh, phys: ball, id: id };
}

export default puck;
