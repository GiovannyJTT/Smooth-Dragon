/**
 * Library: Graphical Programming with ThreeJS (GPT)
 * Author: Giovanny Javier Tipantuña Toapanta
 * Email: giovanny.jtt@gmail.com
 * Content: class GPT_Scene
 * Groups all the functions needed to put the objects (geometry, lights, cameras, etc) in the scene.
 */


/**
 * Creates our GPT_Scene object containing initially an empty array of GPT_Model, an empty array of GPT_Lights and a THREE.Scene.
 * We will use th arrays to update the objects using widgets (we need to keep the references to them)
 */
function GPT_Scene()
{
    this.gpt_models = [];
    this.gpt_lights = [];
    this.scene = new THREE.Scene();
}

/**
 * Here you create the models with their corresponding meshes, and their initial positions in the scene.
 * Then add each model in the models array
 */
GPT_Scene.prototype.createObjects = function()
{
    console.error("You have to implemente this method");
}

/**
 * Use this method for transforming (translate, rotate) the objects in the scene
 * @param {Number} ms time in milliseconds passed since last frame
 */
GPT_Scene.prototype.updateObjects = function(ms)
{
    console.error("You have to implemente this method");
}

/**
 * Here you create the lights with their corresponding source type (point, directional, etc) and their correspoding initial positions
 */
GPT_Scene.prototype.createLights = function()
{
    console.error("You have to implemente this method");
}

/**
 * Use this method for transforming (translate, rotate) the lights in the scene
 * @param {Number} ms time in milliseconds passed since last frame
 */
GPT_Scene.prototype.updateLights = function(ms)
{
    console.error("You have to implemente this method");
}

/**
 * Creates a THREE.Scene and adds all the Object3D/Mesh from the models array (same with the lights array)
 * THREE.Scene can add objects of type THREE.Mesh or THREE.Object3D (grouping object. Ex: robot = base + arm)
 * The same objects will be updated (animated) in renderer.update() method
 */
GPT_Scene.prototype.setupScene = function()
{
    this.createObjects();

    for(let i = 0; i < this.gpt_models.length; i++)
    {
        this.scene.add(this.gpt_models[i]);
    }

    this.createLights();
    
    for(let i=0; i < this.gpt_lights.length; i++)
    {
        this.scene.add(this.gpt_lights[i].light);
    }
}

GPT_Scene.prototype.updateScene = function(ms)
{
    this.updateObjects(ms);
    this.updateLights(ms);
}