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

import renderer from './components/render';
import camera from './components/camera';

var Engine = Matter.Engine,
    World = Matter.World,
    Render = Matter.Render,
    Bodies = Matter.Bodies;

const game = {
    gravity: 0,
    speed: settings.player.speed,
    timeStep: 1/60,
    debug: false,
    playerId: 0,
    arenaSize: 50*settings.players
}

var playerVelocity = { x: 0, y: 0};
let world, engine, scene, player, render;
let pucks = [];
let posts = [];

function init() {

    scene = new Scene();

    engine = Engine.create();

    engine.world.gravity.y = game.gravity; //-0.98;

    if (game.debug) {
        render = Render.create({
            element: document.body,
            engine: engine,
            hasBounds: true,
            bounds: {
                min: { x: -500, y: -400 },
                max: { x: 500, y: 400 }
            }
        });
    }

    scene.add(field);

    pucks.push(puck());
    pucks.push(puck());
    pucks.push(puck());

    pucks.forEach((puck)=>{
        scene.add(puck.mesh);
        World.add(engine.world, puck.phys);    
    });

    player = initplayer(settings.players, game.playerId, game.arenaSize);
    scene.add(player.mesh);
    World.add(engine.world, player.phys);

    var post = new arenapost(player.bounds.min.x, player.bounds.min.y);
    scene.add(post.mesh);
    World.add(engine.world, post.phys);

    var post = new arenapost(player.bounds.max.x, player.bounds.max.y);
    scene.add(post.mesh);
    World.add(engine.world, post.phys);

    for (var x=0;x<16;x++) {
        var px = x%4;
        var py = Math.floor(x/4);
        var post = new arenapost(120 - (px*80), 120 - (py*80));
        post.v = x;
        posts.push(post);
    }

    posts.forEach((post)=>{
        scene.add(post.mesh);
        World.add(engine.world, post.phys);    
    });

    for (var x=0; x<settings.players; x++) {

        var wall = new arenawall();

        var wallMesh = wall.mesh;
        wallMesh.rotation.set(0,0,((2*Math.PI)/settings.players) * x);
        wallMesh.translateY(50*settings.players);
        scene.add(wallMesh);

        var wallPhys = wall.phys;
        World.add(engine.world, wallPhys);
        Matter.Body.setPosition(wallPhys, { x: wallMesh.position.x, y: wallMesh.position.y });
        Matter.Body.setAngle(wallPhys, wallMesh.rotation.z);

    }

    scene.add(camera.handle);

    let amblight = new AmbientLight( 0x808080 );
    scene.add( amblight );
    
    let pointlight = new PointLight( 0xffffff, 1, 2500 );
    pointlight.position.set( 250, 250, -500 );
    scene.add( pointlight );

    let container = document.createElement( 'div' );
    document.body.appendChild( container );
    container.appendChild( renderer.domElement );

    Engine.run(engine);

    if (game.debug) {
        Render.run(render);
    }
    
}

function animate() {

    Matter.Body.translate(player.phys, playerVelocity);

    player.mesh.position.set(player.phys.position.x, player.phys.position.y, 0);

    posts.forEach((post)=>{
        post.v += 0.01;
        post.mesh.position.z = 24 - Math.abs(Math.sin(post.v) * 24);
        if (post.mesh.position.z > 20) {
            post.phys.isSensor = true;
        } else {
            post.phys.isSensor = false;
        }
    });
        
    pucks.forEach((puck)=>{
        puck.mesh.position.set(puck.phys.position.x, puck.phys.position.y, 13);
        if (Matter.Vector.magnitude(puck.phys.velocity) < 8) {
            Matter.Body.setVelocity(puck.phys, Matter.Vector.mult(puck.phys.velocity, 1.01));
        }
    });

    render3D();
    requestAnimationFrame( animate );

}

setTimeout(function(){

    pucks.forEach((puck)=>{
        Matter.Body.applyForce(puck.phys, puck.phys.position, { x: Math.random() * 0.001, y: 0.01 });
    });

}, 500);

function render3D() {

    renderer.render( scene, camera.camera );

}

init();
animate();

let i = -1;

document.addEventListener('keydown', (e)=>{
    switch (e.keyCode) {
        case 37:
           playerVelocity = { x: Math.cos(player.phys.angle) * game.speed * i * 1, y: Math.sin(player.phys.angle) * game.speed * i * 1 };
           //Matter.Body.setVelocity(player, playerVelocity);
           break;
        case 39:
           playerVelocity = { x: Math.cos(player.phys.angle) * game.speed * i * -1, y: Math.sin(player.phys.angle) * game.speed * i  * -1 };
           //Matter.Body.setVelocity(player, playerVelocity);
        break;
    }
});

document.addEventListener('keyup', (e)=>{
    playerVelocity = { x: 0, y: 0 };
});