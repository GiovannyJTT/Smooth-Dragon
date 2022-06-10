/**
 * Using library: Graphical Programming with ThreeJS (GPT)
 * Author: Giovanny Javier Tipantuña Toapanta
 * Email: giovanny.jtt@gmail.com
 * Content:
 *  configScene     creation of models and lights and methods for updating them
 */

import THREE from '../external-libs/threejs-0.118.3/three-global'
import GPT_Scene from '../libgptjs/GPT_Scene'


/**
 * Creating a child object (kind of child class) by Inheriting from GPT_Scene (by calling that constructor)
 * This child object adds functions for specfically configuring and updating the "dragon scene"
 */
function SceneDragon () {
    GPT_Scene.call(this);
}

/**
 * Extend from parent object prototype (keeps the proto clean)
 */
SceneDragon.prototype = Object.create(GPT_Scene.prototype);

/**
 * Repair the inherited constructor
 */
SceneDragon.prototype.constructor = SceneDragon;

/**
 * Overrides createObjects funtion in child object
 */
SceneDragon.prototype.createObjects = function()
{
    const axisH = new THREE.AxesHelper(200);
    axisH.position.set(0.0, 0.0, 0.0);
    axisH.setColors(new THREE.Color(0xff0000), new THREE.Color(0x00ff00), new THREE.Color(0x0000ff))
    
    this.gpt_models.set("AxesHelper", axisH);
}

/**
 * Overrides updateObjects function in child object
 * @param {float} ms milliseconds passed since last frame
 */
SceneDragon.prototype.updateObjects = function(ms)
{
    // console.log("update dragonModel here! (elapsed " + ms + " ms)");
}

/**
 * Overrides createLights function in child object
 * This function creates a light of each type (ambient, point, directional, focal) and adds helpers (wireframe representations)
 * for better understanding of where are located the light sources.
 */
SceneDragon.prototype.createLights = function()
{
    // 5% white light (almost black), doesnt need position. Ambient-Light: is added when shading the models surfaces
    const lAmbient = new THREE.AmbientLight(new THREE.Color(0x0d0d0d), 1.0);
    this.gpt_lights.set("lAmbient", lAmbient);

    // 75% white light. Point-Light: emits in all directions
    const lPoint = new THREE.PointLight(new THREE.Color(0xbfbfbf), 1.0);
    lPoint.position.set(0, 100, 50);
    this.gpt_lights.set("lPoint", lPoint);

    const lPointHelper = new THREE.PointLightHelper(lPoint, 10);
    this.gpt_lights.set("lPointHelper", lPointHelper);

    // 75% white light. Directional-Light: emits only in the configured direction vector
    const lDirectional = new THREE.DirectionalLight(new THREE.Color(0xbfbfbf), 1.0);

    lDirectional.position.set(-200, 200, 0); // direction of the lighting vector
    this.gpt_lights.set("lDirectional", lDirectional);

    const lDirectionalHelper = new THREE.DirectionalLightHelper(lDirectional, 10);
    this.gpt_lights.set("lDirectionalHelper", lDirectionalHelper);

    // 75% white light. Focal-Light: emits light with "cone" volume
    const lFocal = new THREE.SpotLight(new THREE.Color(0xbfbfbf), );
    lFocal.position.set(50, 330, -150);

    lFocal.target.position.set(0, 0, 0); // direction of the central lighting vector
    lFocal.angle = Math.PI/8; // radians
    lFocal.distance = 1000;
    lFocal.decay = 7.5; // atenuation from the central vector to the borders of the cone

    this.gpt_lights.set("lFocal", lFocal);

    const lFocalHelper = new THREE.SpotLightHelper(lFocal);
    this.gpt_lights.set("lFocalHelper", lFocalHelper);
}

/**
 * Overrides updateLights function in child object
 * @param {float} ms milliseconds passed since last frame
 */
SceneDragon.prototype.updateLights = function(ms)
{
    // console.log("update dragonLights here! (elapsed " + ms + " ms)");
}

export default SceneDragon;