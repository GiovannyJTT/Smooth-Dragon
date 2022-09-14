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
 * NOTE: `Nebula.SpriteRenderer` needs the main `THREE.Scene`
 * NOTE: Once json content is loaded you need to add the nebula renderer
 * NOTE: You need to call `this.nebula.update()` in main loop and update emitter position
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
        }
    );
}

/**
 * Moves the particles emitter to the dragon mouth position acoording to new pose (position, rotation) of dragon
 * 
 * 1. Dragon is rotating in its vertical Y axis only, so we can calculate the corresponding mouth position in XZ plane
 * 2. It updates emitter position taking into account current dragon rotation
 * 3. We rotate the emitter according to dragon (so emission vector does not keep pointing to the same direction)
 * 
 * @param {THREE.Vector3} dragon_pos_ current world position of dragon
 * @param {THREE.Vector3} dragon_rot_ current world rotation of dragon
 */
DragonFire.prototype.update_to_dragon_mouth = function (dragon_pos_, dragon_rot_) {

    if (undefined !== this.nebula) {
        this.nebula.emitters.forEach( (emitter_) => {

            const _pos = new THREE.Vector3();

            // update emitter position
            const _sin_a = Math.sin(dragon_rot_.y);
            const _cos_a = Math.cos(dragon_rot_.y);

            // clockwise rotation
            if (dragon_rot_.y > 0) {
                _pos.x = _cos_a * dragon_pos_.x + _sin_a * dragon_pos_.z;
                _pos.z = - _sin_a * dragon_pos_.x + _cos_a * dragon_pos_.z;
            }
            // counter-clockwise rotation
            else if (dragon_rot_.y < 0) {
                _pos.x = _cos_a * dragon_pos_.x - _sin_a * dragon_pos_.z;
                _pos.z = _sin_a * dragon_pos_.x + _cos_a * dragon_pos_.z;
            }

            // rectify
            _pos.x = dragon_pos_.x + _pos.x;
            _pos.z = dragon_pos_.z + _pos.z;
            _pos.y = dragon_pos_.y + 240;

            emitter_.position = _pos;

            // update emitter rotation
            emitter_.rotation.x = 0;
            emitter_.rotation.y = dragon_rot_.y;
            emitter_.rotation.z = 0;
        });
        
        this.nebula.update();
    }
}

export default DragonFire