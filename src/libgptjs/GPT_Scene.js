/**
 * Library: Graphical Programming with ThreeJS (GPT)
 * Author: Giovanny Javier Tipantuña Toapanta
 * Email: giovanny.jtt@gmail.com
 * Content: class GPT_Scene
 * Groups all the functions needed to put the objects (geometry, lights, cameras, etc) in the scene.
 */


/**
 * Creates our Scene with an empty array of GPT_Model
 */
function GPT_Scene()
{
    this.models = [];
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
 * Creates a THREE.Scene and adds all the Object3D/Mesh from the models array
 * THREE.Scene can add objects of type THREE.Mesh or THREE.Object3D (grouping object. Ex: robot = base + arm)
 * The same objects will be updated (animated) in renderer.update() method
 */
GPT_Scene.prototype.setupScene = function()
{
    this.createObjects();

    this.scene = new THREE.Scene();
    for(let i = 0; i < this.models.length; i++)
    {
        this.scene.add(this.models[i]);
    }
}

/**
 * Use this method for transform (translate, rotate) the objects in the scene
 * @param {Number} ms time in milliseconds passed since last frame
 */
GPT_Scene.prototype.animateObjects = function(ms)
{
    console.error("Not implemented");
}