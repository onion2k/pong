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

//settings

import settings from './components/settings';

//networking

//world

var Engine = Matter.Engine,
    World = Matter.World,
    Render = Matter.Render,
    Bodies = Matter.Bodies;
var engine;

//field class

//wall class

//player class

//puck class

var speed = 3;
var playerVelocity = { x: 0, y: 0};
let world, scene, renderer, render, camera, player, playerMesh, field, fieldMesh, ball, ballMesh, cameraTarget;
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

    // // create two circles and a ground
    // var circles = [];
    // for (var i = 0; i < dataSet.length; i++) {
    //     var x = X_START_POS + (i % 16) * (DOT_SIZE + 5);
    //     var y = Y_START_POS + Math.floor(i / 16) * (DOT_SIZE + 5);
    //     var s = DOT_SIZE;
    //     circles.push(Bodies.circle(x, y, DOT_SIZE * 0.5, {
    //         friction: 0.00001,
    //         restitution: 0.5,
    //         density: 0.001
    //     }));
    // }

    // var ground = Bodies.rectangle(400, 610, 810, 60, {isStatic: true});
    // var wallA = Bodies.rectangle(0, 305, 60, 670, {isStatic: true});
    // var wallB = Bodies.rectangle(800, 305, 60, 670, {isStatic: true});
    // var ceiling = Bodies.rectangle(400, 0, 810, 60, {isStatic: true});

    // // add all of the bodies to the world
    // World.add(engine.world, circles);
    // World.add(engine.world, [ground, wallA, wallB, ceiling]);

    let fieldCol = new MeshPhongMaterial({ color: "#00ff00", shininess: 0 });
    let fieldGeo = new CylinderBufferGeometry(250,250,30,64);
    fieldMesh = new Mesh( fieldGeo, fieldCol );
    fieldMesh.rotation.set(Math.PI/2,0,0);
    scene.add(fieldMesh);

    let ballCol = new MeshPhongMaterial({ color: "#0000ff", shininess: 0 });
    let ballGeo = new CylinderBufferGeometry(25,25,10,16);
    ballMesh = new Mesh( ballGeo, ballCol );
    ballMesh.rotation.set(Math.PI/2,0,0);
    ballMesh.translateY(15);
    scene.add(ballMesh);

    ball = Bodies.circle(200, 200, 25, {
        friction: 0.0,
        frictionAir: 0.0,
        frictionStatic: 0.25,
        restitution: 1.0,
        density: 0.005
    });
    World.add(engine.world, ball);

    let centerCol = new MeshPhongMaterial({ color: "#888888", shininess: 0 });
    let centerGeo = new CylinderBufferGeometry(15,15,20,16);
    let centerMesh = new Mesh( centerGeo, centerCol );
    centerMesh.rotation.set(Math.PI/2,0,0);
    centerMesh.translateY(30);
    scene.add(centerMesh);

    let center = Bodies.circle(200, 200, 15, {
        isStatic: true
    });
    World.add(engine.world, center);

    let sides = settings.players;
    let wallCol = new MeshPhongMaterial({ color: "#ff0000", shininess: 0 });
    let wallGeo = new BoxBufferGeometry(200,10,30);

    for (var x=0; x<sides;x++) {

        //rotate then move along body axis
    
        var wallMesh = new Mesh( wallGeo, wallCol );
        wallMesh.rotation.set(0,0,((2*Math.PI)/sides) * x);
        wallMesh.translateZ(30);
        wallMesh.translateY(25*settings.players);
        scene.add(wallMesh);

        var wall = Bodies.rectangle(0, 0, 200, 10, {isStatic: true});
        World.add(engine.world, wall);
        Matter.Body.setPosition(wall, { x: wallMesh.position.x + 200, y: wallMesh.position.y + 200 });
        Matter.Body.setAngle(wall, wallMesh.rotation.z);
        
        // var ceiling = Bodies.rectangle(400, 0, 810, 60, {isStatic: true});

        walls.push(wall);

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
    
    // var ceiling = Bodies.rectangle(400, 0, 810, 60, {isStatic: true});

    walls.push(wall);

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
    ballMesh.position.set(ball.position.x-200, ball.position.y-200, 30);
    
    render3D();
    requestAnimationFrame( animate );

}

setTimeout(function(){
    Matter.Body.applyForce(ball, ball.position, { x: 0.1, y: 0.2 });
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