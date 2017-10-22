import Matter from 'matter-js';

import { PerspectiveCamera } from '../node_modules/three/src/cameras/PerspectiveCamera';
import { Scene } from '../node_modules/three/src/scenes/Scene';
import { WebGLRenderer } from '../node_modules/three/src/renderers/WebGLRenderer';
import { Vector3 } from '../node_modules/three/src/math/Vector3';
import { AmbientLight } from '../node_modules/three/src/lights/AmbientLight';
import { PointLight } from '../node_modules/three/src/lights/PointLight';
import { Object3D } from '../node_modules/three/src/core/Object3D';

import settings from './components/settings';
import initplayer from './components/player';
import field from './components/field';
import puck from './components/puck';
import { arenapost, arenawall } from './components/arena';

var Engine = Matter.Engine,
    World = Matter.World,
    Render = Matter.Render,
    Bodies = Matter.Bodies;

    const game = {
    gravity: 0,
    speed: settings.player.speed,
    timeStep: 1/60,
    debug: false
}

var playerVelocity = { x: 0, y: 0};
let world, engine, scene, renderer, render, player, camera, cameraTarget;

function init() {

    scene = new Scene();

    engine = Engine.create({
        positionIterations: 10,
        velocityIterations: 30
    });

    engine.world.gravity.y = game.gravity; //-0.98;

    if (game.debug) {
        render = Render.create({
            element: document.body,
            engine: engine,
            hasBounds: true,
            bounds: {
                min: {x: -400, y: -300 },
                max: {x: 400, y: 300 }
            }
        });
    }

    scene.add(field);
    scene.add(puck.mesh);
    World.add(engine.world, puck.phys);

    var center = new arenapost();
    scene.add(center.mesh);
    World.add(engine.world, center.phys);

    for (var x=0; x<settings.players; x++) {

        var wall = new arenawall();

        var wallMesh = wall.mesh;
        wallMesh.rotation.set(0,0,((2*Math.PI)/settings.players) * x);
        wallMesh.translateY(50*settings.players);
        scene.add(wallMesh);

        var wall1 = wall.phys;
        World.add(engine.world, wall1);
        Matter.Body.setPosition(wall1, { x: wallMesh.position.x, y: wallMesh.position.y });
        Matter.Body.setAngle(wall1, wallMesh.rotation.z);

    }

    player = initplayer(settings.players, 3);
    scene.add(player.mesh);
    World.add(engine.world, player.phys);
    
    cameraTarget = new Object3D();
    cameraTarget.position.set(0,0,0);
    cameraTarget.rotation.set(0,0,0.601);
    camera = new PerspectiveCamera( 70, 800/600, 1, 5000 );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 700;

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

    if (game.debug) {
        Render.run(render);
    }
    
}

function animate() {

    // cameraTarget.rotation.z += 0.01;

    Matter.Body.translate(player.phys, playerVelocity);

    player.mesh.position.set(player.phys.position.x, player.phys.position.y, 30);
    puck.mesh.position.set(puck.phys.position.x, puck.phys.position.y, 30);
    
    render3D();
    requestAnimationFrame( animate );

}

setTimeout(function(){
    Matter.Body.applyForce(puck.phys, puck.phys.position, { x: 0.005, y: 0.01 });
}, 500);

function render3D() {
    renderer.render( scene, camera );
}

init();
animate();

document.addEventListener('keydown', (e)=>{
    switch (e.keyCode) {
        case 37:
           playerVelocity = { x: Math.cos(player.phys.angle) * 1 * game.speed, y: Math.sin(player.phys.angle) * 1 * game.speed };
           //Matter.Body.setVelocity(player, playerVelocity);
           break;
        case 39:
           playerVelocity = { x: Math.cos(player.phys.angle) * -1 * game.speed, y: Math.sin(player.phys.angle) * -1 * game.speed };
           //Matter.Body.setVelocity(player, playerVelocity);
        break;
    }
});

document.addEventListener('keyup', (e)=>{
    playerVelocity = { x: 0, y: 0 };
});