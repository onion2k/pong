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


    // Materials
    var fieldMaterial = new CANNON.Material("fieldMaterial");
    var ballMaterial = new CANNON.Material("ballMaterial");
    // Adjust constraint equation parameters for ground/ground contact
    var field_ball_cm = new CANNON.ContactMaterial(fieldMaterial, ballMaterial, {
        friction: 0.4,
        restitution: 0.3,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
        frictionEquationStiffness: 1e8,
        frictionEquationRegularizationTime: 3,
    });
    // Add contact material to the world
    world.addContactMaterial(field_ball_cm);


    let fieldShape = new CANNON.Cylinder(250,250,30,64);
    field = new CANNON.Body({ type: CANNON.Body.STATIC, position: new CANNON.Vec3(0,0,0), material: fieldMaterial });
    field.quaternion.set(0.7071,0,0,0.7071);
    field.addShape(fieldShape);
    world.addBody(field);
    
    let ballShape = new CANNON.Cylinder(25,25,10,16);
    ball = new CANNON.Body({ mass: 10, position: new CANNON.Vec3(0,0,15), material: ballMaterial });
    ball.quaternion.set(0.7071,0,0,0.7071);
    ball.addShape(ballShape);
    // ball.angularVelocity.set(0,0,0);
    // ball.angularDamping = 0.25;
    world.addBody(ball);
    
    // var q = new CANNON.Quaternion();
    // q.setFromAxisAngle(new CANNON.Vec3(1,0,0),Math.PI / 2);
    // cylinderShape2.transformAllPoints(new CANNON.Vec3(),q);


}

function initThree() {

    scene = new Scene();

    let fieldCol = new MeshPhongMaterial({ color: "#00ff00", shininess: 0 });
    let fieldGeo = new CylinderBufferGeometry(250,250,30, 64);
    fieldMesh = new Mesh( fieldGeo, fieldCol );
    // field.position.set(0,0,0);
    // field.rotation.set(Math.PI/2,0,0);
    scene.add(fieldMesh);

    let playerCol = new MeshPhongMaterial({ color: "#ff0000", shininess: 0 });
    let playerGeo = new TorusBufferGeometry(250, 10, 6, 6, Math.PI/6);
    player = new Mesh( playerGeo, playerCol );
    player.position.set(0,0,0);
    player.rotation.set(0,0,0);
    scene.add(player);

    let ballCol = new MeshPhongMaterial({ color: "#0000ff", shininess: 0 });
    let ballGeo = new CylinderBufferGeometry(25,25,10,16);
    ballMesh = new Mesh( ballGeo, ballCol );
    // ballMesh.position.set(0,100,0);
    // ballMesh.rotation.set(0,Math.PI/2,0);
    scene.add(ballMesh);
    
    camera = new PerspectiveCamera( 70, 800/600, 1, 1000 );
    //camera = new OrthographicCamera( -480, 480, 320, -320, -400, 400 );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 500;

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
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}

initCannon();
initThree();
animate();


function animate() {
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
