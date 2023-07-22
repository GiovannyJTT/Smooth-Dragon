/**
 * @module libgptjs Graphical Programming with ThreeJS (GPT)
 * @class main
 * @summary
 *      entry point of this webGL app
 *      WebGL app using ThreeJS, Html5 and OOJS for exploring surface smoothing technique
 */

// get or create canvas container for threejs
import Common from '../libgptjs/scene-dragon/Common';

const _id_c = Common.CANVAS_CONTAINER_NAME_FOR_THREEJS;
let _c = document.getElementById(_id_c);
if (_c == null) {
    _c = document.createElement("div");
    _c.id = _id_c;
    document.body.appendChild(_c);
    console.warn("Attached new " + _id_c + " to body")
}

// check webgl compatibility
import WebGL from 'three/examples/jsm/capabilities/WebGL'

if (WebGL.isWebGLAvailable()) {
    console.info("This web browser is WebGL compatible. Starting ...");
    window.alert("This web browser is WebGL compatible. Starting ...");
} else {
    const warning = WebGL.getWebGLErrorMessage();
    window.alert("This web browser is NOT WebGL compatible");

    document.getElementById(_id_c).appendChild(warning);
}

// load library
console.log("Loading GPT library")

import SceneDragon from '../libgptjs/scene-dragon/SceneDragon'
import GPT_Renderer from '../libgptjs/GPT_Renderer'
import GPT_App from '../libgptjs/GPT_App'

// declared as "const" because: block-scoped, cannot be updated but its properties yes, cannot be redeclared
const sce = new SceneDragon();
const ren = new GPT_Renderer(Common.CANVAS_CONTAINER_WIDTH, Common.CANVAS_CONTAINER_HEIGHT, sce);
const app = new GPT_App(ren);

app.init(_id_c);

// start rendering loop
app.run();
