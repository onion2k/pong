import { Mesh } from '../../node_modules/three/src/objects/Mesh';
import { CylinderBufferGeometry } from '../../node_modules/three/src/geometries/CylinderGeometry';
import { MeshPhongMaterial } from '../../node_modules/three/src/materials/MeshPhongMaterial';

const fieldCol = new MeshPhongMaterial({ color: "#00ff00", shininess: 0 });
const fieldGeo = new CylinderBufferGeometry(250,250,30,64);
const fieldMesh = new Mesh( fieldGeo, fieldCol );

fieldMesh.rotation.set(Math.PI/2,0,0);

export default fieldMesh;