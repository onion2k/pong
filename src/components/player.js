import Matter from 'matter-js';

import { Mesh } from '../../node_modules/three/src/objects/Mesh';
import { BoxBufferGeometry } from '../../node_modules/three/src/geometries/BoxGeometry';
import { MeshPhongMaterial } from '../../node_modules/three/src/materials/MeshPhongMaterial';

function initplayer(players, playerId){

    const batCol = new MeshPhongMaterial({ color: "#444444", shininess: 0 });
    const batGeo = new BoxBufferGeometry(100,10,30);

    const playerMesh = new Mesh( batGeo, batCol );
    playerMesh.rotation.z = ((2*Math.PI)/players) * playerId;
    playerMesh.translateY(220);
    
    const player = Matter.Bodies.rectangle(0, 0, 100, 10, {isStatic: true});
    Matter.Body.setPosition(player, { x: playerMesh.position.x, y: playerMesh.position.y });
    Matter.Body.setAngle(player, playerMesh.rotation.z);

    const pvec = { x: Math.cos(player.angle) * 200, y: Math.sin(player.angle) * 200};
    const minbounds = Matter.Vector.add(player.position, pvec);
    const maxbounds = Matter.Vector.sub(player.position, pvec);
    
    return { mesh: playerMesh, phys: player, bounds: { min: minbounds, max: maxbounds } }

}

export default initplayer;
