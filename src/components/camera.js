import { Object3D } from '../../node_modules/three/src/core/Object3D';
import { PerspectiveCamera } from '../../node_modules/three/src/cameras/PerspectiveCamera';
import { OrthographicCamera } from '../../node_modules/three/src/cameras/OrthographicCamera';

const cameraTarget = new Object3D();
cameraTarget.position.set(0,0,0);
cameraTarget.rotation.set(0,0,0);

let camera;

if (1) {

    camera = new PerspectiveCamera( 60, 800/600, 1, 5000 );
    
    cameraTarget.rotation.x = (Math.PI/2) * 0.35;
    cameraTarget.rotation.y = 0;
    cameraTarget.rotation.z = Math.PI;

} else {

    camera = new OrthographicCamera( 500, -500, -400, 400, 1, 5000 );

}

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = -600;

cameraTarget.add(camera);
camera.lookAt(cameraTarget.position);

export default { handle: cameraTarget, camera: camera };
