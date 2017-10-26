import { WebGLRenderer } from '../../node_modules/three/src/renderers/WebGLRenderer';
import { PCFSoftShadowMap } from '../../node_modules/three/src/constants';

const renderer = new WebGLRenderer({ alpha: true, antialias: true });
renderer.setClearColor( 0xffffff, 0);
renderer.setSize(1280,1024);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

export default renderer;