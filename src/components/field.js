import { Mesh } from '../../node_modules/three/src/objects/Mesh';
import { CylinderBufferGeometry } from '../../node_modules/three/src/geometries/CylinderGeometry';
import { MeshPhysicalMaterial } from '../../node_modules/three/src/materials/MeshPhysicalMaterial';

const fieldCol = new MeshPhysicalMaterial({ color: "#C5E3BF", roughness: 1 });
const fieldGeo = new CylinderBufferGeometry(600,600,30,64);
const fieldMesh = new Mesh( fieldGeo, fieldCol );

fieldMesh.castShadow = false; //default is false
fieldMesh.receiveShadow = true; //default

fieldMesh.rotation.set(Math.PI/2,0,0);
fieldMesh.translateY(30);

export default fieldMesh;