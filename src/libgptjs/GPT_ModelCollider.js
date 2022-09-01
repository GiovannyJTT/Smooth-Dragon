import THREE from "../external-libs/threejs-0.118.3/three-global";

/**
 * Simple collider using AABB (axis aligned bounding boxes)
 * https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection
 * 
 * @param {Bool} static_ true when object doesn't move or rotate, false when is dynamic (rotates, translates, scales)
 * @param {THREE.Object3D} obj_mesh the object from what the aabb (min, max) will be computed
 * @return {THREE.BoxHelper} `aabb_helper` line_mesh of the aabb to be rendered in Scene
 * 
 * @attribute `this.abbb` {THREE.Box3} structure containing aabb as "Box3 { min: Vector3, max: Vector3}"
 */
function GPT_ModelCollider (static_, obj_mesh) {
    
    this.is_static = static_
    if (undefined === this.is_static) {
        console.error("Collider: 'is_static' is undefined");
        return;
    }

    this.obj_mesh = obj_mesh;
    if (undefined == this.obj_mesh) {
        console.error("Collider: 'inner_mesh' is undefined");
        return;
    }

    this.aabb = new THREE.Box3().setFromObject(this.obj_mesh);
    console.debug("ModelCollider: aabb: " + JSON.stringify(this.aabb));

    // helper forms the box with lines
    this.aabb_helper = new THREE.BoxHelper(this.obj_mesh, 0x00ff00);
}

/**
 * In the animation (update) loop, compute the current aabb with the world matrix
 * 
 * For non-static objects (object is rotating or translating) you need to call mesh.computeBoundingBox
 *      in order to update aabb.min and aabb.max values
 * 
 * For static objects you only call once to mesh.computeBoundingBox
 */
 GPT_ModelCollider.prototype.update_aabb = function () {
    if (!this.is_static) {
        this.obj_mesh.geometry.computeBoundingBox();
    }

    // update the AABB values
    this.aabb.copy(this.obj_mesh.geometry.boundingBox)
        .applyMatrix4(this.obj_mesh.matrixWorld);

    this.update_aabb_helper();
}

/**
 * Updates the helper's geometry to match the dimensions of the object,
 *      including any children, and also its position on the Scene.
 */
GPT_ModelCollider.prototype.update_aabb_helper = function () {
    this.aabb_helper.update();
}

GPT_ModelCollider.prototype.dispose_buffers = function () {
    this.aabb_helper.geometry.dispose();
    this.aabb_helper.material.dispose();
    this.aabb_helper.geometry = null;
    this.aabb_helper.material = null;
    this.aabb_helper = null;
    this.aabb = null;
}

/**
 * Checks collision (intersection) with other AABB (axis aligned bounding box)
 * @return {Bool} `true` colliders are intersecting, `false` otherwise
 * 
 * TODO: implement for sphere-collider, triagle-collider, multi-aabb
 */
GPT_ModelCollider.prototype.is_colliding_with = function (other_aabb_) {
    return this.aabb.intersectsBox(other_aabb_);
}

export default GPT_ModelCollider