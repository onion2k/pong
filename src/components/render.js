import { WebGLRenderer } from '../../node_modules/three/src/renderers/WebGLRenderer';

const renderer = new WebGLRenderer({ alpha: true, antialias: true });
renderer.setClearColor( 0xffffff, 0);
renderer.setSize(800,600 );

export default renderer;