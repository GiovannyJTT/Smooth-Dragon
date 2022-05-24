/**
 * Library: Graphical Programming with ThreeJS (GPT)
 * Author: Giovanny Javier Tipantuña Toapanta
 * Email: giovanny.jtt@gmail.com
 * Content: class GPT_Renderer
 * Base class Renderer grouping all utilities needed in the "low level" of THREE.js
 */

/**
 * Importing object THREE from our costumized global script
 */
import THREE from '../external-libs/threejs-0.118.3/three-global'
import OrbitControls from '../external-libs/threejs-0.118.3/OrbitControls'

/**
 * Create a GPT Renderer object with a scene already configured. It creates a THREE.WebGLRenderer internally tha twill be used in the other metho
 * @param {Number} w width of the canvas
 * @param {Number} h height of the canvas
 * @param {GPT_Scene} sce our GPT_Scene already configured (It contains the THREE.Scene and an array of models)
 */
function GPT_Renderer(w, h, sce)
{
    this.w = w;
    this.h = h;
    this.gpt_scene = sce;
    this.wglrenderer = new THREE.WebGLRenderer();
}

/**
 * Creates a THREE.Camera with by default values (perspective camera)
 */
GPT_Renderer.prototype.setCamera = function(ar, yfov = 40, near = 1, far = 100)
{
    this.camera = new THREE.PerspectiveCamera(yfov, ar, near, far);
    this.camera.position.set(0, 275, 500); // consider we are working in cm
    this.camera.lookAt(new THREE.Vector3(0, 80, 0)); // looking at the origin
}

/**
 * Creates a THREE.Controls with by default values (orbit control)
 */
GPT_Renderer.prototype.setCameraHandler = function()
{
    this.cameraHandler = new THREE.OrbitControls(this.camera, this.wglrenderer.domElement);
    this.cameraHandler.target.set(0, 100, 0);
    this.cameraHandler.noKeys = true; // moving with keyboard not allowed
}

/**
 * Initilize the Scene and WebGL here. This is called only once at the beginning
 * @param {string} div_container_name name of the div element for using as canvas. Commonly "container"
 */
GPT_Renderer.prototype.setup = function(div_container_name)
{
    this.wglrenderer.setSize(this.w, this.h);
    this.wglrenderer.setClearColor(new THREE.Color(0x002233), 1.0); // BLUE
    this.wglrenderer.shadowMap.enabled = true; // enabling shadows in the engine

    document.getElementById(div_container_name).appendChild(this.wglrenderer.domElement);
    console.infor("GPT_Renderer.wglrenderer configured: clearColor and shadowMapEnabled");
    
    this.setCamera(this.w/this.h, 40, 1, 100);
    this.setCameraHandler();

    this.gpt_scene.setupScene();
}

/**
 * Update and Move the dynamic objects on the scene depending on the "ms" milliseconds that have passed
 * @param {Number} ms milliseconds passed since previous frame
 */
GPT_Renderer.prototype.update = function(ms)
{
    this.gpt_scene.updateScene(ms);
    this.cameraHandler.update();
}

/**
 * Render the content of the scene in the current state
 */
GPT_Renderer.prototype.renderFrame = function()
{
    this.wglrenderer.render(this.gpt_scene.scene, this.camera);
}

/**
 * Will be called each time the window changes the size
 */
GPT_Renderer.prototype.reshape = function()
{
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.wglrenderer.setSize(this.w, this.h);

	this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();

    console.log("Window Resized: " + this.w + " x " + this.h)
}

export default GPT_Renderer;