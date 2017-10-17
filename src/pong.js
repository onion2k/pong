import CANNON from 'cannon';

import { PerspectiveCamera } from '../node_modules/three/src/cameras/PerspectiveCamera';
import { OrthographicCamera } from '../node_modules/three/src/cameras/OrthographicCamera';
import { Scene } from '../node_modules/three/src/scenes/Scene';
import { Mesh } from '../node_modules/three/src/objects/Mesh';
import { WebGLRenderer } from '../node_modules/three/src/renderers/WebGLRenderer';
import { Vector3 } from '../node_modules/three/src/math/Vector3';
import { AmbientLight } from '../node_modules/three/src/lights/AmbientLight';
import { PointLight } from '../node_modules/three/src/lights/PointLight';

import { Mesh } from '../node_modules/three/src/objects/Mesh';
import { CylinderBufferGeometry } from '../node_modules/three/src/geometries/CylinderGeometry';
import { TorusBufferGeometry } from '../node_modules/three/src/geometries/TorusGeometry';
import { MeshPhongMaterial } from '../node_modules/three/src/materials/MeshPhongMaterial';
import { Object3D } from '../node_modules/three/src/core/Object3D';

let world, scene, renderer, camera, player, field, fieldMesh, ball, ballMesh;
var timeStep = 1/60;

function initCannon() {

    world = new CANNON.World();
    world.gravity.set(0,0,-9.8);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;

    var fieldMaterial = new CANNON.Material("fieldMaterial");
    var ballMaterial = new CANNON.Material("ballMaterial");
    var field_ball_cm = new CANNON.ContactMaterial(fieldMaterial, ballMaterial, {
        friction: 0.001,
        restitution: 0.03
    });
    world.addContactMaterial(field_ball_cm);

    var quat = new CANNON.Quaternion(0.5, 0, 0, 0.5);
    quat.normalize();

    let fieldShape = new CANNON.Cylinder(250,250,30,64);
    field = new CANNON.Body({ type: CANNON.Body.STATIC, position: new CANNON.Vec3(0,0,0), material: fieldMaterial });
    field.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    field.addShape(fieldShape, new CANNON.Vec3, quat);
    world.addBody(field);

    let ballShape = new CANNON.Cylinder(25,25,10,16);
    ball = new CANNON.Body({ mass: 1, position: new CANNON.Vec3(0,0,30), material: ballMaterial });
    ball.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    ball.addShape(ballShape, new CANNON.Vec3, quat);
    world.addBody(ball);

}

function initThree() {

    scene = new Scene();

    let fieldCol = new MeshPhongMaterial({ color: "#00ff00", shininess: 0 });
    let fieldGeo = new CylinderBufferGeometry(250,250,30,64);
    fieldMesh = new Mesh( fieldGeo, fieldCol );
    fieldMesh.rotation.set(0,0,0);
    scene.add(fieldMesh);

    let playerCol = new MeshPhongMaterial({ color: "#ff0000", shininess: 0 });
    let playerGeo = new TorusBufferGeometry(250, 10, 6, 6, Math.PI/6);
    player = new Mesh( playerGeo, playerCol );
    player.position.set(0,0,20);
    player.rotation.set(0,0,0);
    scene.add(player);

    let ballCol = new MeshPhongMaterial({ color: "#0000ff", shininess: 0 });
    let ballGeo = new CylinderBufferGeometry(25,25,10,16);
    ballMesh = new Mesh( ballGeo, ballCol );
    scene.add(ballMesh);

    camera = new PerspectiveCamera( 70, 800/600, 1, 5000 );
    //camera = new OrthographicCamera( -480, 480, 320, -320, -400, 400 );
    camera.position.x = 0;
    camera.position.y = -450;
    camera.position.z = 500;

    camera.lookAt(fieldMesh.position);

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

}

function animate() {
    player.rotation.z += 0.025;
    updatePhysics();
    render();
    requestAnimationFrame( animate );
}

function updatePhysics() {
    world.step(timeStep);
    fieldMesh.position.copy(field.position);
    fieldMesh.quaternion.copy(field.quaternion);
    ballMesh.position.copy(ball.position);
    ballMesh.quaternion.copy(ball.quaternion);
}

function render() {
    renderer.render( scene, camera );
}

setTimeout(function(){
    var worldPoint = new CANNON.Vec3(0,0,0);
    var force = new CANNON.Vec3(0,2000,0);
    ball.applyForce(force,worldPoint);
}, 2000);

initCannon();
initThree();
animate();
