import { WebGLRenderer } from '../../node_modules/three/src/renderers/WebGLRenderer';

const renderer = new WebGLRenderer({ alpha: true, antialias: true });
renderer.setClearColor( 0xffffff, 0);
renderer.setSize(1280,1024);

export default renderer;