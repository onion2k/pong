import Matter from 'matter-js';

import { Mesh } from '../../node_modules/three/src/objects/Mesh';
import { BoxBufferGeometry } from '../../node_modules/three/src/geometries/BoxGeometry';
import { CylinderBufferGeometry } from '../../node_modules/three/src/geometries/CylinderGeometry';
import { MeshPhongMaterial } from '../../node_modules/three/src/materials/MeshPhongMaterial';

function arenapost(x, y){

    const postCol = new MeshPhongMaterial({ color: "#888888", shininess: 0 });
    const postGeo = new CylinderBufferGeometry(15,15,20,16);
    const postMesh = new Mesh( postGeo, postCol );

    postMesh.rotation.set(Math.PI/2,Math.PI,0);

    postMesh.translateX(x);
    postMesh.translateY(30);
    postMesh.translateZ(y);

    let post = Matter.Bodies.circle(x, y, 15, { isStatic: true });

    return { mesh: postMesh, phys: post };

}

function arenawall(){

    const length = 400;
    const width = 10;

    const wallCol = new MeshPhongMaterial({ color: "#ff0000", shininess: 0 });
    const wallGeo = new BoxBufferGeometry(length,width,30);
    const wallMesh = new Mesh( wallGeo, wallCol );
    wallMesh.translateZ(30);
    
    const wallPhys = Matter.Bodies.rectangle(0, 0, length, width, {isStatic: true });
    
    return { mesh: wallMesh, phys: wallPhys };
        
}

export { arenapost, arenawall };
