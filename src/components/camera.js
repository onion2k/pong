import { Object3D } from '../../node_modules/three/src/core/Object3D';
import { PerspectiveCamera } from '../../node_modules/three/src/cameras/PerspectiveCamera';
import { OrthographicCamera } from '../../node_modules/three/src/cameras/OrthographicCamera';

const cameraTarget = new Object3D();
cameraTarget.position.set(0,0,0);
cameraTarget.rotation.set(0,0,0);

const camera = new PerspectiveCamera( 70, 800/600, 1, 5000 );
// const camera = new OrthographicCamera( -500, 500, -400, 400, 1, 5000 );
camera.position.x = 0;
camera.position.y = -200;
camera.position.z = 700;

cameraTarget.add(camera);
camera.lookAt(cameraTarget.position);

cameraTarget.rotation.z = Math.PI;

export default { handle: cameraTarget, camera: camera };
