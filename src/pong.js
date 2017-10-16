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

function init() {

    let scene = new Scene();

    let fieldCol = new MeshPhongMaterial({ color: "#00ff00", shininess: 0 });
    let fieldGeo = new CylinderBufferGeometry(250,250,30, 64);
    let field = new Mesh( fieldGeo, fieldCol );
    field.position.set(0,0,0);
    field.rotation.set(Math.PI/2,0,0);
    scene.add(field);

    let playerCol = new MeshPhongMaterial({ color: "#ff0000", shininess: 0 });
    let playerGeo = new TorusBufferGeometry(250, 10, 6, 6, Math.PI/6);
    let player = new Mesh( playerGeo, playerCol );
    player.position.set(0,0,0);
    player.rotation.set(0,0,0);
    scene.add(player);

    let camera = new OrthographicCamera( -480, 480, 320, -320, -400, 400 );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 50;

    let amblight = new AmbientLight( 0x808080 );
    scene.add( amblight );
    
    let pointlight = new PointLight( 0xffffff, 1, 2500 );
    pointlight.position.set( 250, 500, 500 );
    scene.add( pointlight );

    let container = document.createElement( 'div' );
    document.body.appendChild( container );

    let renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor( 0xffffff, 0);
    renderer.setSize(800,600 );
    container.appendChild( renderer.domElement );

    return { renderer: renderer, scene: scene, camera: camera, player: player };

}

function animate() {
    g.player.rotation.z += 0.025;
    g.renderer.render( g.scene, g.camera );
    requestAnimationFrame( animate );
}

let g = init();
animate(g);
