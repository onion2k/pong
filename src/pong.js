import Matter from 'matter-js';

import { DefaultLoadingManager } from '../node_modules/three/src/loaders/LoadingManager';

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
import { arenapost, arenawall, sensorwall } from './components/arena';

import { MTLLoader } from "./MTLLoader";
let mtlLoader = new MTLLoader(DefaultLoadingManager);
    
import { OBJLoader2 } from "./OBJLoader2";
let loader = new OBJLoader2(DefaultLoadingManager);

// import Peer from 'peerjs';

// let conn;
// let id = localStorage.getItem('player-id');
// let peer = new Peer(id, {key: 'xbvdscgdfedsra4i'});

// peer.on('open', function(id) {

//     console.log('My peer ID is: ' + id);

//     if (id !== 'player-1') {

//         conn = peer.connect('player-1');
        
//         conn.on('open', function(id) {
        
//             // Receive messages
//             console.log('My peer ID is: ' + conn.id, conn.peer);
        
//             conn.on('data', function(data) {
//                 console.log('Received', data);
//             });

//         });

//     }

//     peer.on('connection', function(conn) { 

//         console.log('My peer ID is: ' + conn.id, conn.peer);
        
//         conn.on('data', function(data) {
//             console.log('Received', conn.peer, data);
//         });

//     });

// });

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
    arenaSize: 50 * settings.players
}

var playerVelocity = { x: 0, y: 0};
let world, engine, scene, player, render;
let pucks = [];
let posts = [];
let coins = [];
let lightHandle;
let burger;
let coin;
// let moonHandle;

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

    pucks.push(puck(burger.clone()));

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

    /** Central posts */
        
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

    /** Walls */

    for (var x=0; x<settings.players; x++) {

      if (x===0) {

        //wall as a sensor
        var wall = new sensorwall();

        var wallMesh = wall.mesh;
        wallMesh.rotation.set(0,0,((2*Math.PI)/settings.players) * x);
        wallMesh.translateY(50*settings.players);
        scene.add(wallMesh);

        var wallPhys = wall.phys;
        World.add(engine.world, wallPhys);
        Matter.Body.setPosition(wallPhys, { x: wallMesh.position.x, y: wallMesh.position.y });
        Matter.Body.setAngle(wallPhys, wallMesh.rotation.z);

      } else {

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

    }

    scene.add(camera.handle);

    let amblight = new AmbientLight( 0x808080 );
    scene.add( amblight );

    lightHandle = new Object3D();
    lightHandle.position.set(0,0,0);
    lightHandle.rotation.set(0,0,0);

    //Create a DirectionalLight and turn on shadows for the light
    var light = new SpotLight( 0xffffff );
    light.position.set( 400, -400, -800 );
    
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

    let m;

    Matter.Body.translate(player.phys, playerVelocity);

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
        puck.mesh.position.set(puck.phys.position.x, puck.phys.position.y, 10);
        puck.mesh.rotation.y = puck.phys.angle;

        m = Matter.Vector.magnitude(puck.phys.velocity);
        if (m < 5) {
            Matter.Body.setVelocity(puck.phys, Matter.Vector.mult(puck.phys.velocity, 1.01));
        } else if (m > 7) {
            Matter.Body.setVelocity(puck.phys, Matter.Vector.mult(puck.phys.velocity, 0.99));            
        }
    });

    coins.forEach((coin)=>{
      coin.rotation.z += 0.05;
    });
    // moonHandle.rotation.y += 0.01;

    render3D();
    requestAnimationFrame( animate );

}

function render3D() {

    renderer.render( scene, camera.camera );

}



function loadModel(model) {

    return new Promise((resolve, reject) => {
        mtlLoader.setPath(model.path);
        mtlLoader.load(model.material, function(materials) {
            materials.preload();
            loader.setMaterials(materials.materials);
            loader.setPath(model.path);
            loader.load(model.model, (obj) => {
                obj.scale.set(model.scale, model.scale, model.scale);
                obj.rotation.set(model.rotation.x, model.rotation.y, model.rotation.z);
                resolve({ id: model.id, object: obj });
            }, (xhr) => {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            }, (error) => {
                console.log( 'An error happened', error );
                reject();
            });
        });
    });

}

const models = [
    { id: 'burger', path: 'burger/', model: 'Hamburger.obj', material: 'Hamburger.mtl', scale: 5, rotation: {x:-Math.PI/2, y:0, z:0} },
    { id: 'coin', path: 'coin/', model: 'CHAHIN_COIN.obj', material: 'CHAHIN_COIN.mtl', scale: 100, rotation: {x:0, y:0, z:0} },
    // { id: 'moon', path: 'moon/', model: 'PUSHILIN_moon.obj', material: 'PUSHILIN_moon.mtl', scale: 100, rotation: {x:-Math.PI/2, y:0, z:0} },
    // { id: 'guide', path: 'guide/', model: 'RCL01RemoteGuidanceUnit.obj', material: 'RCL01RemoteGuidanceUnit.mtl', scale: 5, rotation: {x:-Math.PI/2, y:0, z:0} },
    // { id: 'roomba', path: 'roomba/', model: 'Domestic Robot.obj', material: 'Domestic Robot.mtl', scale: 5, rotation: {x:-Math.PI/2, y:0, z:0} },
]

//need to understand this better
const concat = list => Array.prototype.concat.bind(list);
const promiseConcat = f => x => f().then(concat(x));
const promiseReduce = (acc, x) => acc.then(promiseConcat(x));
const serial = funcs => funcs.reduce(promiseReduce, Promise.resolve([]));
const funcs = models.map(model => () => loadModel(model));

serial(funcs).then((result) => {
  burger = result[0].object;
  coin = result[1].object;
  // let moon = result[2].object;
  // moonHandle = new Object3D();
  // moon.position.set(200,-200,-400);
  // moonHandle.add(moon);
  init();
  animate();
  for (let x = 0; x < 10; x++) {
    let c = coin.clone();
    c.position.x = 300 - Math.random() * 600;
    c.position.y = 300 - Math.random() * 600;
    scene.add(c);
    coins.push(c)
  }
  // scene.add(moonHandle);

  setTimeout(function(){
    pucks.forEach((puck)=>{
        Matter.Body.applyForce(puck.phys, puck.phys.position, { x: Math.random() * 0.001, y: 0.01 });
    });
  }, 500);

});

let i = -1;

document.addEventListener('keydown', (e)=>{
    switch (e.keyCode) {
        case 37:
           playerVelocity = { x: Math.cos(player.phys.angle) * game.speed * i * 1, y: Math.sin(player.phys.angle) * game.speed * i * 1 };
           // conn.send({'v': playerVelocity});
           break;
        case 39:
           playerVelocity = { x: Math.cos(player.phys.angle) * game.speed * i * -1, y: Math.sin(player.phys.angle) * game.speed * i  * -1 };
           // conn.send({'v': playerVelocity});
        break;
    }
});

document.addEventListener('keyup', (e)=>{
    playerVelocity = { x: 0, y: 0 };
});