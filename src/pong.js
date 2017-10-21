import Matter from 'matter-js';

import { PerspectiveCamera } from '../node_modules/three/src/cameras/PerspectiveCamera';
import { OrthographicCamera } from '../node_modules/three/src/cameras/OrthographicCamera';
import { Scene } from '../node_modules/three/src/scenes/Scene';
import { Mesh } from '../node_modules/three/src/objects/Mesh';
import { WebGLRenderer } from '../node_modules/three/src/renderers/WebGLRenderer';
import { Vector3 } from '../node_modules/three/src/math/Vector3';
import { AmbientLight } from '../node_modules/three/src/lights/AmbientLight';
import { PointLight } from '../node_modules/three/src/lights/PointLight';

import { Mesh } from '../node_modules/three/src/objects/Mesh';
import { BoxBufferGeometry } from '../node_modules/three/src/geometries/BoxGeometry';
import { CylinderBufferGeometry } from '../node_modules/three/src/geometries/CylinderGeometry';
import { TorusBufferGeometry } from '../node_modules/three/src/geometries/TorusGeometry';
import { MeshPhongMaterial } from '../node_modules/three/src/materials/MeshPhongMaterial';
import { Object3D } from '../node_modules/three/src/core/Object3D';

import settings from './components/settings';
import field from './components/field';
import puck from './components/puck';

import { center, wall } from './components/arena';
// import player from './components/player';

var Engine = Matter.Engine,
    World = Matter.World,
    Render = Matter.Render,
    Bodies = Matter.Bodies;
var engine;

var speed = 3;
var playerVelocity = { x: 0, y: 0};
let world, scene, renderer, render, camera, player, playerMesh, ball, ballMesh, cameraTarget;
var timeStep = 1/60;
let walls = [];

function init() {

    scene = new Scene();

    engine = Engine.create();
    engine.world.gravity.y = 0;

    render = Render.create({
        element: document.body,
        engine: engine
    });

    scene.add(field);
    scene.add(puck.mesh);
    World.add(engine.world, puck.phys);

    scene.add(center.mesh);
    World.add(engine.world, center.phys);

    let sides = settings.players;

    for (var x=0; x<sides;x++) {

        var wallMesh = wall.mesh.clone();
        wallMesh.rotation.set(0,0,((2*Math.PI)/sides) * x);
        wallMesh.translateY(25*settings.players);
        scene.add(wallMesh);

        var wall1 = Object.clone(wall.phys);
        World.add(engine.world, wall1);
        Matter.Body.setPosition(wall1, { x: wallMesh.position.x + 200, y: wallMesh.position.y + 200 });
        Matter.Body.setAngle(wall1, wallMesh.rotation.z);

        walls.push(wall1);

    }

    let batCol = new MeshPhongMaterial({ color: "#ff00ff", shininess: 0 });
    let batGeo = new BoxBufferGeometry(100,10,30);

    playerMesh = new Mesh( batGeo, batCol );
    playerMesh.rotation.set(0,0,((2*Math.PI)/sides) * 3);
    playerMesh.translateZ(30);
    playerMesh.translateY(130);
    scene.add(playerMesh);

    player = Bodies.rectangle(0, 0, 100, 10, {isStatic: true});
    World.add(engine.world, player);
    Matter.Body.setPosition(player, { x: playerMesh.position.x + 200, y: playerMesh.position.y + 200 });
    Matter.Body.setAngle(player, playerMesh.rotation.z);
    
    cameraTarget = new Object3D();
    cameraTarget.position.set(0,0,0);
    cameraTarget.rotation.set(0,0,0.601);
    camera = new PerspectiveCamera( 70, 800/600, 1, 5000 );
    //camera = new OrthographicCamera( -480, 480, 320, -320, -400, 400 );
    camera.position.x = 0;
    camera.position.y = -300;
    camera.position.z = 300;

    cameraTarget.add(camera);

    camera.lookAt(cameraTarget.position);

    scene.add(cameraTarget);

    let amblight = new AmbientLight( 0x808080 );
    scene.add( amblight );
    
    let pointlight = new PointLight( 0xffffff, 1, 2500 );
    pointlight.position.set( 250, 500, 500 );
    scene.add( pointlight );

    let container = document.createElement( 'div' );
    document.body.appendChild( container );

    renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor( 0xffffff, 0);
    renderer.setSize(800,600 );
    container.appendChild( renderer.domElement );

    Engine.run(engine);
    Render.run(render);
    
}

function animate() {

    // cameraTarget.rotation.z += 0.01;

    Matter.Body.translate(player, playerVelocity);

    playerMesh.position.set(player.position.x-200, player.position.y-200, 30);
    puck.mesh.position.set(puck.phys.position.x-200, puck.phys.position.y-200, 30);
    
    render3D();
    requestAnimationFrame( animate );

}

setTimeout(function(){
    Matter.Body.applyForce(puck.phys, puck.phys.position, { x: 0.1, y: 0.2 });
}, 500);

function render3D() {
    renderer.render( scene, camera );
}

init();
animate();

document.addEventListener('keydown', (e)=>{
    switch (e.keyCode) {
        case 37:
           playerVelocity = { x: Math.cos(player.angle) * 1 * speed, y: Math.sin(player.angle) * 1 * speed };
           //Matter.Body.setVelocity(player, playerVelocity);
           break;
        case 39:
           playerVelocity = { x: Math.cos(player.angle) * -1 * speed, y: Math.sin(player.angle) * -1 * speed };
           //Matter.Body.setVelocity(player, playerVelocity);
        break;
    }
});

document.addEventListener('keyup', (e)=>{
    playerVelocity = { x: 0, y: 0 };
});