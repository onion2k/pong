import Matter from 'matter-js';

import { Mesh } from '../../node_modules/three/src/objects/Mesh';
import { CylinderBufferGeometry } from '../../node_modules/three/src/geometries/CylinderGeometry';
import { MeshPhongMaterial } from '../../node_modules/three/src/materials/MeshPhongMaterial';

let pucks = 0;

function puck() {

    const size = 8;
    const id = "puck-"+(++pucks);
    const ballCol = new MeshPhongMaterial({ color: "#ffffff", shininess: 0 });
    const ballGeo = new CylinderBufferGeometry(size,size,5,16);
    const ballMesh = new Mesh( ballGeo, ballCol );
    ballMesh.rotation.set(Math.PI/2,0,0);

    ballMesh.castShadow = true; //default is false
    ballMesh.receiveShadow = false; //default

    const ball = Matter.Bodies.circle(0, 0, size, {
        friction: 0.0,
        frictionAir: 0.0,
        frictionStatic: 0,
        restitution: 1.0,
        density: 0.003,
        inverseInertia: 0,
        label: id
    });

    return { mesh: ballMesh, phys: ball, id: id };
}


export default puck;
