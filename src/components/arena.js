import Matter from 'matter-js';

import { Mesh } from '../../node_modules/three/src/objects/Mesh';
import { BoxBufferGeometry } from '../../node_modules/three/src/geometries/BoxGeometry';
import { CylinderBufferGeometry } from '../../node_modules/three/src/geometries/CylinderGeometry';
import { MeshPhongMaterial } from '../../node_modules/three/src/materials/MeshPhongMaterial';

function arenapost(){

    const postCol = new MeshPhongMaterial({ color: "#888888", shininess: 0 });
    const postGeo = new CylinderBufferGeometry(15,15,20,16);
    const postMesh = new Mesh( postGeo, postCol );
    postMesh.rotation.set(Math.PI/2,0,0);
    postMesh.translateY(30);

    let post = Matter.Bodies.circle(200, 200, 15, {
        isStatic: true
    });

    return { mesh: postMesh, phys: post };

}

function arenawall(){

    const wallCol = new MeshPhongMaterial({ color: "#ff0000", shininess: 0 });
    const wallGeo = new BoxBufferGeometry(200,10,30);
    const wallMesh = new Mesh( wallGeo, wallCol );
    wallMesh.translateZ(30);
    
    const wallPhys = Matter.Bodies.rectangle(0, 0, 200, 10, {isStatic: true});
    
    return { mesh: wallMesh, phys: wallPhys };
        
}

export { arenapost, arenawall };
