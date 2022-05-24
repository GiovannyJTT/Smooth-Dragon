/**
 * Library: Graphical Programming with ThreeJS (GPT)
 * Author: Giovanny Javier Tipantuña Toapanta
 * Email: giovanny.jtt@gmail.com
 * Content:
 *  class GPT_Scene
 *      Groups all the functions needed to put the objects (geometry, lights, cameras, etc) in the scene.
 */

/**
 * Importing object THREE from our costumized global script
 */
import THREE from '../external-libs/threejs-0.118.3/three-global'

/**
 * Creates our GPT_Scene object containing initially an empty map of GPT_Model, an empty map of GPT_Lights and a THREE.Scene.
 * We will use th arrays to update the objects using widgets (we need to keep the references to them).
 * 
 * Using a map it preserves the original insertion order, has merging functionalities and better performance
 * when adding/removing operations are performed frequently
 */
function GPT_Scene()
{
    this.gpt_models = new Map();
    this.gpt_lights = new Map();
    this.scene = new THREE.Scene();
}

/**
 * Here you create the models with their corresponding meshes, and their initial positions in the scene.
 * Then add each model in the models array
 */
GPT_Scene.prototype.createObjects = function()
{
    console.error("Not implemented");
}

/**
 * Use this method for transforming (translate, rotate) the objects in the scene
 * @param {Number} ms time in milliseconds passed since last frame
 */
GPT_Scene.prototype.updateObjects = function(ms)
{
    console.error("Not implemented");
}

/**
 * Here you create the lights with their corresponding source type (point, directional, etc) and their correspoding initial positions
 */
GPT_Scene.prototype.createLights = function()
{
    console.error("Not implemented");
}

/**
 * Use this method for transforming (translate, rotate) the lights in the scene
 * @param {Number} ms time in milliseconds passed since last frame
 */
GPT_Scene.prototype.updateLights = function(ms)
{
    console.error("Not implemented");
}

/**
 * Creates a THREE.Scene and adds all the Object3D/Mesh from the models array (same with the lights array)
 * THREE.Scene can add objects of type THREE.Mesh or THREE.Object3D (grouping object. Ex: robot = base + arm)
 * The same objects will be updated (animated) in renderer.update() method
 */
GPT_Scene.prototype.setupScene = function()
{
    this.createObjects();

    for(let [key, value] of this.gpt_models)
    {
        this.scene.add(value);
    }
    console.debug("GPT_Scene: added " + this.gpt_models.size + " models");

    this.createLights();
    
    for(let [key, value] of this.gpt_lights)
    {
        this.scene.add(value);
    }
    console.debug("GTP_Scene: added " + this.gpt_lights.size + " lights");
}

GPT_Scene.prototype.updateScene = function(ms)
{
    this.updateObjects(ms);
    this.updateLights(ms);
}

export default GPT_Scene;