/**
 * Description: WebGL app using ThreeJS, Html5 and OOJS for exploring surface smoothing technique
 * Using library: Graphical Programming with ThreeJS (GPT)
 * Author: Giovanny Javier Tipantuña Toapanta
 * Email: giovanny.jtt@gmail.com
 */


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
        gpt_sce.gpt_models.push(axisHelp);
    }
    
    gpt_sce.updateObjects = function(ms)
    {
        console.log("update dragonModel here! (elapsed " + ms + " ms)")
    }

    gpt_sce.createLights = function()
    {
        console.log("setup dragonLights here!");
    }

    gpt_sce.updateLights = function(ms)
    {
        console.log("update dragonLights here! (elapsed " + ms + " ms)");
    }

    return gpt_sce;
}