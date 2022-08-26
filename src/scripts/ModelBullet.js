import THREE from "../external-libs/threejs-0.118.3/three-global";
import GPT_Model from "../libgptjs/GPT_Model";

/**
 * Creates a model for bullet
 * Inherits from GPT_Model
 * @param {[THREE.Vector3]} trajectory_points3D_ array of Vector3 points to move along the bullet
 */
function ModelBullet (trajectory_points3D_) {
    // 1. Call parent object
    GPT_Model.call(this);

    this.trajectory_points3D = trajectory_points3D_

    if (undefined === this.trajectory_points3D) {
        console.error("ModelBullet: trajectory_points is undefined");
        return;
    }

    if (this.trajectory_points3D.size == 0) {
        console.error("ModelBullet: trajectory_points has 0 elements");
        return;
    }

    this.current_point_index = 0;
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

ModelBullet.prototype.dispose_buffers = function () {
    this.geometry.dispose();
    this.material.dispose();
    
    this.geometry = null;
    this.material = null;
    this.mesh = null;
}

ModelBullet.prototype.move_to_next_point = function () {
    const _last_index = this.trajectory_points3D.length - 1;

    if (this.current_point_index < _last_index) {
        this.current_point_index++;
        const _p = this.trajectory_points3D[this.current_point_index];
        this.mesh.position.set(_p.x, _p.y, _p.z);

        return true;
    }
    else {
        return false;
    }
}

export default ModelBullet;