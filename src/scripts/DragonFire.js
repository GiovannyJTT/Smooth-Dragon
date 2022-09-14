/**
 * @module libgptjs Graphical Programming with ThreeJS (GPT)
 * @class DragonFire using particle system from Neebula-threejs
 */

import Nebula, { SpriteRenderer } from "three-nebula"
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
function DragonFire(scene_) {

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
 *      a. Move model to origin
 *      b. Align with axis (un-do the current rotation)
 *      c. Calculate mouth position when model is at origin
 *      d. Apply rotation to mouth at origin
 *      e. Translate coordinates back to current model position 
 * 3. We rotate the emitter according to dragon (so emission vector does not keep pointing to the same direction)
 * 
 * @param {THREE.Vector3} dragon_pos_ current world position of dragon
 * @param {THREE.Vector3} dragon_rot_ current world rotation of dragon
 */
DragonFire.prototype.update_to_dragon_mouth = function (dragon_pos_, dragon_rot_) {
    if (undefined !== this.nebula) {
        this.nebula.emitters.forEach((emitter_) => {

            // move model to origin
            const _dragon_at_origin = new THREE.Vector3(
                -dragon_pos_.x,
                -dragon_pos_.y,
                -dragon_pos_.z
            );

            // align with axis (un-do current rotation)
            const _dragon_at_origin_aligned = new THREE.Vector3().copy(_dragon_at_origin)
                .applyAxisAngle(
                    new THREE.Vector3(0, 1, 0), -dragon_rot_.y
                );

            // calculate mouth position when model is at origin
            const _mouth_at_origin = new THREE.Vector3(
                _dragon_at_origin_aligned.x - 120,
                _dragon_at_origin_aligned.y + 240,
                _dragon_at_origin_aligned.z
            );

            // apply rotation to mouth at origin
            const _mouth_at_origin_rotated = new THREE.Vector3().copy(_mouth_at_origin)
                .applyAxisAngle(
                    new THREE.Vector3(0, 1, 0), dragon_rot_.y
                );

            // translate coordinates back to current model position
            const _mouth_translated = new THREE.Vector3(
                _mouth_at_origin_rotated.x + dragon_pos_.x * 2,
                _mouth_at_origin_rotated.y + dragon_pos_.y * 2,
                _mouth_at_origin_rotated.z + dragon_pos_.z * 2,
            );

            emitter_.position = _mouth_translated;

            // update emitter rotation: fix 90 deg rotation to point mouth-forward
            emitter_.rotation.x = dragon_rot_.x;
            emitter_.rotation.y = dragon_rot_.y - 1.5707963267948966;
            emitter_.rotation.z = dragon_rot_.z;

        });

        this.nebula.update();
    }
}

export default DragonFire