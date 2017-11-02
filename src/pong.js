import Matter from 'matter-js';

import { PerspectiveCamera } from '../node_modules/three/src/cameras/PerspectiveCamera';
import { Scene } from '../node_modules/three/src/scenes/Scene';
import { WebGLRenderer } from '../node_modules/three/src/renderers/WebGLRenderer';
import { Vector3 } from '../node_modules/three/src/math/Vector3';
import { AmbientLight } from '../node_modules/three/src/lights/AmbientLight';
import { SpotLight } from '../node_modules/three/src/lights/SpotLight';
import { CameraHelper } from '../node_modules/three/src/helpers/CameraHelper';
import { Object3D } from '../node_modules/three/src/core/Object3D';

import settings from './components/settings';
import initplayer from './components/player';
import field from './components/field';
import puck from './components/puck';
import { arenapost, arenawall } from './components/arena';

import { OBJLoader2 } from "./OBJLoader2";
let loader = new OBJLoader2;
loader.setPath( 'burger/' );

import Peer from 'peerjs';

let conn;
let id = localStorage.getItem('player-id');
let peer = new Peer(id, {key: 'xbvdscgdfedsra4i'});

peer.on('open', function(id) {

    console.log('My peer ID is: ' + id);

    if (id !== 'player-1') {

        conn = peer.connect('player-1');
        
        conn.on('open', function(id) {
        
            // Receive messages
            console.log('My peer ID is: ' + conn.id, conn.peer);
        
            conn.on('data', function(data) {
                console.log('Received', data);
            });

        });

    }

    peer.on('connection', function(conn) { 

        console.log('My peer ID is: ' + conn.id, conn.peer);
        
        conn.on('data', function(data) {
            console.log('Received', conn.peer, data);
        });

    });

});




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
let lightHandle;

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
    post.phys._type = 'playerbound';
    scene.add(post.mesh);
    World.add(engine.world, post.phys);

    var post = new arenapost(player.bounds.max.x, player.bounds.max.y);
    post.phys._type = 'playerbound';
    scene.add(post.mesh);
    World.add(engine.world, post.phys);

    for (var x=0;x<16;x++) {
        var px = x%4;
        var py = Math.floor(x/4);
        var post = new arenapost(120 - (px*80), 120 - (py*80));
        post.v = 90;
        posts.push(post);
    }

    posts.forEach((post)=>{
        scene.add(post.mesh);
        var w = World.add(engine.world, post.phys);    
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

    lightHandle = new Object3D();
    lightHandle.position.set(0,0,0);
    lightHandle.rotation.set(0,0,0);

    //Create a DirectionalLight and turn on shadows for the light
    var light = new SpotLight( 0xffffff );
    light.position.set( 200, -200, -400 );
    
    light.castShadow = true;
    
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    
    light.shadow.camera.near = 500;
    light.shadow.camera.far = 4000;
    light.shadow.camera.fov = 70;
    
    lightHandle.add(light);
    scene.add(lightHandle);
    
    let container = document.createElement( 'div' );
    document.body.appendChild( container );
    container.appendChild( renderer.domElement );

    Engine.run(engine);
    
    Matter.Events.on(engine, 'collisionStart', function(event) {
        var pairs = event.pairs;
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            if (pair.bodyB._type==='post') {
                let p = posts.find((post)=>{ return post.id===pair.bodyB.label });
                p.contact = true;
            }
        }
    });

    if (game.debug) {
        Render.run(render);
    }

}

function animate() {

    Matter.Body.translate(player.phys, playerVelocity);

    // lightHandle.rotation.z += 0.001;

    player.mesh.position.set(player.phys.position.x, player.phys.position.y, 0);

    posts.forEach((post)=>{
        if (post.contact===true) {
            post.v += 0.1;
            post.mesh.position.z = 24 - Math.abs(Math.sin(post.v) * 24);
            if (post.mesh.position.z > 22) {
                post.contact = false;
                // post.phys.isSensor = true;
                if (post.phys) {
                    Matter.Composite.remove(engine.world, post.phys);
                    post.phys = undefined;
                }
            } else {
                // post.phys.isSensor = false;
            }
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

loader.load('Hamburger.obj', (burger) => {
    console.log("Burger loaded");
    burger.scale.set(10,10,10);
    burger.rotation.set(-Math.PI/2,0,0);
    scene.add(burger);
}, (xhr) => {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
}, (error) => {
    console.log( 'An error happened', error );
});

let i = -1;

document.addEventListener('keydown', (e)=>{
    switch (e.keyCode) {
        case 37:
           playerVelocity = { x: Math.cos(player.phys.angle) * game.speed * i * 1, y: Math.sin(player.phys.angle) * game.speed * i * 1 };
           conn.send({'v': playerVelocity});
           //Matter.Body.setVelocity(player, playerVelocity);
           break;
        case 39:
           playerVelocity = { x: Math.cos(player.phys.angle) * game.speed * i * -1, y: Math.sin(player.phys.angle) * game.speed * i  * -1 };
           conn.send({'v': playerVelocity});
           //Matter.Body.setVelocity(player, playerVelocity);
        break;
    }
});

document.addEventListener('keyup', (e)=>{
    playerVelocity = { x: 0, y: 0 };
});