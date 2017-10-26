import { Mesh } from '../../node_modules/three/src/objects/Mesh';
import { CylinderBufferGeometry } from '../../node_modules/three/src/geometries/CylinderGeometry';
import { MeshPhongMaterial } from '../../node_modules/three/src/materials/MeshPhongMaterial';

const fieldCol = new MeshPhongMaterial({ color: "#666666", shininess: 0 });
const fieldGeo = new CylinderBufferGeometry(400,400,30,64);
const fieldMesh = new Mesh( fieldGeo, fieldCol );

fieldMesh.castShadow = false; //default is false
fieldMesh.receiveShadow = true; //default

fieldMesh.rotation.set(Math.PI/2,0,0);
fieldMesh.translateY(30);

export default fieldMesh;