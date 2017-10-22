import { Object3D } from '../../node_modules/three/src/core/Object3D';
import { PerspectiveCamera } from '../../node_modules/three/src/cameras/PerspectiveCamera';

const cameraTarget = new Object3D();
cameraTarget.position.set(0,0,0);
cameraTarget.rotation.set(0,0,Math.PI);

const camera = new PerspectiveCamera( 70, 800/600, 1, 5000 );
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 700;

cameraTarget.add(camera);
camera.lookAt(cameraTarget.position);

export default { handle: cameraTarget, camera: camera };
