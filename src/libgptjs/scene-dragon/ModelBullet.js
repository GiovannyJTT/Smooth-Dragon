/**
 * @module libgptjs Graphical Programming with ThreeJS (GPT)
 * @class ModelBullet
 */

import { lerp } from "three/src/math/MathUtils";
import THREE from "../external-libs/three-global";
import GPT_Model from "../GPT_Model";
import Common from "./Common";
import GPT_ModelCollider from "../GPT_ModelCollider";

/**
 * Creates a model for bullet
 * 
 * Inherits from GPT_Model
 * 
 * Sets initial position of mesh/model (passed as parameter)
 *      before creating the collider, so collider will be spawn in same position
 * 
 * @param {[THREE.Vector3]} trajectory_points3D_ array of Vector3 points to move along the bullet
 * @param {THREE.Vector3} start_pos_ initial position to spawn model and collider
 */
function ModelBullet(trajectory_points3D_, start_pos_) {

    this.trajectory_points3D = trajectory_points3D_

    if (undefined === this.trajectory_points3D) {
        console.error("ModelBullet: 'trajectory_points' is undefined");
        return;
    }

    if (this.trajectory_points3D.size == 0) {
        console.error("ModelBullet: 'trajectory_points' has 0 elements");
        return;
    }

    if (undefined === start_pos_) {
        console.error("ModelBullet: 'start_pos' is undefined");
        return;
    }

    // 1. Call parent object
    GPT_Model.call(this);
    this.mesh.position.set(start_pos_.x, start_pos_.y, start_pos_.z);

    // Attach collider once mesh is built and set in intial postion
    this.collider = new GPT_ModelCollider(false, this.mesh);

    // initialization
    this.current_point_index = 0;
    this.prev_ts = performance.now();
}

// 2. Extend from parent object prototype (keep proto clean)
ModelBullet.prototype = Object.create(GPT_Model.prototype);

// 3. Repair the inherited constructor
ModelBullet.prototype.constructor = ModelBullet;

/**
 * Overriding it
 */
ModelBullet.prototype.get_geometry = function () {
    const _geom = new THREE.SphereGeometry(22, 8, 8);
    return _geom;
}

/**
 * Overriding it
 */
ModelBullet.prototype.get_material = function () {
    const _mat = new THREE.MeshPhongMaterial(
        {
            color: 0xD76009,
            emissive: 0x681F77,
            flatShading: true,
            specular: 0xFF5733,
            shininess: 50,
            side: THREE.FrontSide,
            transparent: false
        }
    );

    return _mat;
}

/**
 * Extending method (calling parent method and performing pre / post operations)
 */
ModelBullet.prototype.dispose_buffers = function () {

    GPT_Model.prototype.dispose_buffers.call(this);
    this.collider.dispose_buffers();

    console.log("ModelBullet: dispose_buffers()");
}

/**
 * Increases "current_point_index" and moves mesh to next point
 * @returns {Bool} false when index >= last_index, true otherwise
 */
ModelBullet.prototype.move_to_next_point = function () {

    const _last_index = this.trajectory_points3D.length - 1;
    if (this.current_point_index >= _last_index) {
        return false;
    }

    this.current_point_index++;
    const _p = this.trajectory_points3D[this.current_point_index];
    this.mesh.position.set(_p.x, _p.y, _p.z);

    // update collider
    this.collider.update_aabb();

    return true;
}

/**
 * Based on time passed since last call and Common.BULLET_STEP_DURATION_MS (duration
 *      between 2 succesive points3D)
 * 
 * While elapsed < BULLET_SEPT_DURATION_MS it calculates interpolated point and moves the object
 * Otherwise it only increases the current_point_index
 * 
 * @returns {Bool} true object moved, false otherwise
 */
ModelBullet.prototype.move_to_next_point_interpolated = function () {

    const _last_index = this.trajectory_points3D.length - 1;
    if (this.current_point_index >= _last_index) {
        return false;
    }

    const _now_ts = performance.now();
    const _elapsed = _now_ts - this.prev_ts;

    if (_elapsed < Common.BULLET_STEP_DURATION_MS) {
        const _i = _elapsed / Common.BULLET_STEP_DURATION_MS;

        const _p = this.trajectory_points3D[this.current_point_index];
        const _p_next = this.trajectory_points3D[this.current_point_index + 1];

        // interpolate coordinates between current and next
        const _ip_x = lerp(_p.x, _p_next.x, _i);
        const _ip_y = lerp(_p.y, _p_next.y, _i);
        const _ip_z = lerp(_p.z, _p_next.z, _i);

        // apply
        this.mesh.position.set(_ip_x, _ip_y, _ip_z);

        // update collider
        this.collider.update_aabb();

        return true;
    }
    else {
        this.current_point_index++;
        this.prev_ts = performance.now();
        return false;
    }
}

export default ModelBullet;