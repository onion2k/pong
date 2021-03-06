import Matter from 'matter-js';

import { Mesh } from '../../node_modules/three/src/objects/Mesh';
import { BoxBufferGeometry } from '../../node_modules/three/src/geometries/BoxGeometry';
import { MeshPhysicalMaterial } from '../../node_modules/three/src/materials/MeshPhysicalMaterial';

const batCol = new MeshPhysicalMaterial({ color: "#AAAAFF", roughness: 1 });

function initplayer(players, playerId, arenaSize){

    const batGeo = new BoxBufferGeometry(100,10,30);

    const playerMesh = new Mesh( batGeo, batCol );
    playerMesh.rotation.z = ((2*Math.PI)/players) * playerId;
    playerMesh.translateY(arenaSize - 30);

    playerMesh.castShadow = true; //default is false
    playerMesh.receiveShadow = false; //default

    const player = Matter.Bodies.rectangle(0, 0, 100, 10, {isStatic: true});
    Matter.Body.setPosition(player, { x: playerMesh.position.x, y: playerMesh.position.y });
    Matter.Body.setAngle(player, playerMesh.rotation.z);

    const r = (arenaSize-30)/arenaSize;
    const postDist = 200 * r;

    const pvec = { x: Math.cos(player.angle) * postDist, y: Math.sin(player.angle) * postDist};
    const minbounds = Matter.Vector.add(player.position, pvec);
    const maxbounds = Matter.Vector.sub(player.position, pvec);
    
    return { mesh: playerMesh, phys: player, bounds: { min: minbounds, max: maxbounds } }

}

export default initplayer;
