/**
 * Description: WebGL app using ThreeJS, Html5 and OOJS for exploring surface smoothing technique
 * Using library: Graphical Programming with ThreeJS (GPT)
 * Author: Giovanny Javier Tipantuña Toapanta
 * Email: giovanny.jtt@gmail.com
 */

import GPT_Scene from '../libgptjs/GPT_Scene'
import THREE from '../external-libs/threejs-0.118.3/three-global'

/**
 * All steps needed for setting up and updating the objects (models and lights) into the sceneç
 * @return {GPT_Scene} the scene fully configured with its corresponding objects and update functions implemented
 */
function configScene()
{
    const gpt_sce = new GPT_Scene();
    
    gpt_sce.createObjects = function()
    {
        const axisHelp = new THREE.AxisHelper(20);
        axisHelp.position.set(0, 0.2, 0);
        
        gpt_sce.gpt_models.set("axishelper", axisHelp);
    }
    
    gpt_sce.updateObjects = function(ms)
    {
        //console.log("update dragonModel here! (elapsed " + ms + " ms)");
    }

    gpt_sce.createLights = function()
    {
        // 5% white light (almost black), doesnt need position
        const lAmbient = new THREE.AmbientLight(new THREE.Color(0x0d0d0d), 1.0);
        gpt_sce.gpt_lights.set("lAmbient", lAmbient);

        // 75% white light
        const lPoint = new THREE.PointLight(new THREE.Color(0xbfbfbf), 1.0);
        lPoint.position.set(0, 100, 50);
        gpt_sce.gpt_lights.set("lPoint", lPoint);
    }

    gpt_sce.updateLights = function(ms)
    {
        //console.log("update dragonLights here! (elapsed " + ms + " ms)");
    }

    return gpt_sce;
}

export default configScene;