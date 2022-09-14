/**
 * @module libgptjs Graphical Programming with ThreeJS (GPT)
 * @class DragonFire using particle system from Neebula-threejs
 */

import Nebula, {SpriteRenderer} from "three-nebula"
import dfp from "./DragonFireParticles.json"
import THREE from "../external-libs/threejs-0.118.3/three-global";

/**
 * Creates a fire particles system using Nebula-threejs
 * 
 * NOTE: you need to call `this.nebula.update()` in main loop
 * 
 * @param {THREE.Scene} scene_ reference to the main threejs scene to be used into the particles system
 */
function DragonFire (scene_) {

    if (undefined === scene_) {
        console.error("DragonFire: scene is undefined");
        return;
    }

    this.nebula_renderer = undefined;
    this.nebula = undefined;
    Nebula.fromJSONAsync(dfp.particleSystemState, THREE).then(
        (loaded_) => {

            this.nebula_renderer = new SpriteRenderer(scene_, THREE);
            this.nebula = loaded_.addRenderer(this.nebula_renderer);
            console.log(this.nebula)

            this.nebula.emitters.forEach( emitter_ => {
                emitter_.position.y = 200;
            });
        }
    );
}

export default DragonFire