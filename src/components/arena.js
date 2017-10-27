import Matter from 'matter-js';

import { Mesh } from '../../node_modules/three/src/objects/Mesh';
import { BoxBufferGeometry } from '../../node_modules/three/src/geometries/BoxGeometry';
import { CylinderBufferGeometry } from '../../node_modules/three/src/geometries/CylinderGeometry';
import { MeshPhysicalMaterial } from '../../node_modules/three/src/materials/MeshPhysicalMaterial';

let posts = 0;
let walls = 0;

const postCol = new MeshPhysicalMaterial({ color: "#AAFFFF", roughness: 1 });
const wallCol = new MeshPhysicalMaterial({ color: "#FFAAAA", roughness: 1 });

function arenapost(x, y){

    const postGeo = new CylinderBufferGeometry(15,15,20,16);
    const postMesh = new Mesh( postGeo, postCol );
    const id = "post-"+(++posts);

    postMesh.castShadow = true; //default is false
    postMesh.receiveShadow = true; //default
    
    postMesh.rotation.set(Math.PI,0,0);
    
    postMesh.position.x = x;
    postMesh.position.y = y;
    postMesh.position.z = 0;

    postMesh.rotation.set(Math.PI/2,0,0);

    let post = Matter.Bodies.circle(x, y, 15, { isStatic: true, label: id, _type: 'post' });

    return { mesh: postMesh, phys: post, id: id };

}

function arenawall(){

    const length = 400;
    const width = 10;

    const wallGeo = new BoxBufferGeometry(length,width,30);
    const wallMesh = new Mesh( wallGeo, wallCol );

    wallMesh.castShadow = true; //default is false
    wallMesh.receiveShadow = false; //default

    const wallPhys = Matter.Bodies.rectangle(0, 0, length, width, {isStatic: true });
    
    return { mesh: wallMesh, phys: wallPhys };
        
}

export { arenapost, arenawall };
