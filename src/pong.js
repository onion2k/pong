

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

let world, scene, renderer, camera, player, field, fieldMesh, ball, ballMesh;
var timeStep = 1/60;
let walls = [];

function init() {

    scene = new Scene();
    
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

    let sides = 5;
    let wallCol = new MeshPhongMaterial({ color: "#ff0000", shininess: 0 });
    let wallGeo = new BoxBufferGeometry(200,10,30);

    for (var x=0; x<sides;x++) {

        //rotate then move along body axis
    
        var wallMesh = new Mesh( wallGeo, wallCol );
        wallMesh.rotation.set(0,0,((2*Math.PI)/sides) * x);
        wallMesh.translateZ(30);
        wallMesh.translateY(150);
        scene.add(wallMesh);

        var wall = { mesh: wallMesh};
        walls.push(wall);

    }


    let playerCol = new MeshPhongMaterial({ color: "#ff0000", shininess: 0 });
    let playerGeo = new TorusBufferGeometry(250, 10, 6, 6, Math.PI/6);
    player = new Mesh( playerGeo, playerCol );
    player.position.set(0,0,20);
    player.rotation.set(0,0,0);
    scene.add(player);

    camera = new PerspectiveCamera( 70, 800/600, 1, 5000 );
    //camera = new OrthographicCamera( -480, 480, 320, -320, -400, 400 );
    camera.position.x = 0;
    camera.position.y = -250;
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
    render();
    requestAnimationFrame( animate );
}

function render() {
    renderer.render( scene, camera );
}

init();
animate();
