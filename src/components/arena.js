import Matter from 'matter-js';

import { Mesh } from '../../node_modules/three/src/objects/Mesh';
import { BoxBufferGeometry } from '../../node_modules/three/src/geometries/BoxGeometry';
import { CylinderBufferGeometry } from '../../node_modules/three/src/geometries/CylinderGeometry';
import { MeshPhongMaterial } from '../../node_modules/three/src/materials/MeshPhongMaterial';

const postCol = new MeshPhongMaterial({ color: "#888888", shininess: 0 });
const postGeo = new CylinderBufferGeometry(15,15,20,16);
const postMesh = new Mesh( postGeo, postCol );
postMesh.rotation.set(Math.PI/2,0,0);
postMesh.translateY(30);

let post = Matter.Bodies.circle(200, 200, 15, {
    isStatic: true
});

const center = { mesh: postMesh, phys: post };


const wallCol = new MeshPhongMaterial({ color: "#ff0000", shininess: 0 });
const wallGeo = new BoxBufferGeometry(200,10,30);
const wallMesh = new Mesh( wallGeo, wallCol );
//wallMesh.rotation.set(0,0,((2*Math.PI)/sides) * x);
wallMesh.translateZ(30);
//wallMesh.translateY(25*settings.players);

const wallPhys = Matter.Bodies.rectangle(0, 0, 200, 10, {isStatic: true});

const wall = { mesh: wallMesh, phys: wallPhys };

export { center, wall };
