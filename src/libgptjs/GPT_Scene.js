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
    // maps can have any object type as key and can be iterated in order of insertion
    this.gpt_models = new Map();
    this.gpt_lights = new Map();
    this.scene = new THREE.Scene();
}

/**
 * Override this method for creating models with their corresponding meshes, and their initial positions in the scene.
 * Then add each model in the models array
 */
GPT_Scene.prototype.createObjects = function()
{
    console.error("GPT_Scene.createObjects: Not implemented");
}

/**
 * Override this method for transforming (translate, rotate) the objects in the scene
 * @param {Number} ms time in milliseconds passed since last frame
 */
GPT_Scene.prototype.updateObjects = function(ms)
{
    console.error("GPT_Scene.updateObjects: Not implemented");
}

/**
 * Override this method for creating lights with their corresponding source type (point, directional, etc) and their correspoding initial positions
 */
GPT_Scene.prototype.createLights = function()
{
    console.error("GPT_Scene.createLights: Not implemented");
}

/**
 * Override this method for transforming (translate, rotate) the lights in the scene
 * @param {Number} ms time in milliseconds passed since last frame
 */
GPT_Scene.prototype.updateLights = function(ms)
{
    console.error("GPT_Scene.updateLights: Not implemented");
}

/**
 * Invokes the methods for creating the scene, adds a THREE.Scene and all the Object3D/Mesh from the models array (same with the lights array)
 * THREE.Scene can add objects of type THREE.Mesh or THREE.Object3D (grouping object. Ex: robot = base + arm)
 * The same objects will be updated (animated) in renderer.update() method
 */
GPT_Scene.prototype.setupScene = function()
{
    this.createObjects();

    for(let [key, value] of this.gpt_models)
    {
        this.scene.add(value);
        console.debug("GPT_Scene: added " + key);
    }
    console.debug("GPT_Scene: total models: " + this.gpt_models.size);

    this.createLights();
    
    for(let [key, value] of this.gpt_lights)
    {
        console.debug("GPT_Scene: added " + key);
        this.scene.add(value);
    }
    console.debug("GTP_Scene: total lights: " + this.gpt_lights.size);
}

GPT_Scene.prototype.updateScene = function(ms)
{
    this.updateObjects(ms);
    this.updateLights(ms);
}

/**
 * Removes object Model from THREE.Scene at runtime
 * Also removes object from 'gpt_models'
 * @param {String} object_name_ 
 */
GPT_Scene.prototype.removeModelFromScene = function (object_name_) {
    const selectedObject = this.scene.getObjectByName(object_name_);
    this.scene.remove( selectedObject );

    this.gpt_models[object_name_] = null;
    this.gpt_models.delete(object_name_)

    if (this.gpt_models.get(object_name_)){
        console.error("GPT_Scene.removeModelFromScene: could not remove '" + object_name_ + "'");
        return;
    }

    if (this.scene.getObjectByName(object_name_)) {
        console.error("GPT_Scene.removeModelFromScene: could not remove '" + object_name_ + "'");
        return;
    }

    console.debug("GPT_Scene: removed: " + object_name_);
}

/**
 * Adds objec Model to THREE.Scene at runtime
 * Also adds object to 'gpt_models'
 * @param {String} obj_name_ model name
 * @param {THREE.Mesh} obj_mesh_ mesh
 */
GPT_Scene.prototype.AddModelToScene = function (obj_name_, obj_mesh_) {
    this.gpt_models.set(obj_name_, obj_mesh_);
    this.scene.add(this.gpt_models.get(obj_name_));

    console.debug("GPT_Scene: added " + obj_name_);
    console.debug("GPT_Scene: total models: " + this.gpt_models.size);
}

export default GPT_Scene;