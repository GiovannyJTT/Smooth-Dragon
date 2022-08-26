import THREE from "../external-libs/threejs-0.118.3/three-global";
import GPT_Model from "../libgptjs/GPT_Model";

/**
 * Creates a model for bullet
 * Inherits from GPT_Model
 */
function ModelBullet () {
    // 1. Call parent object
    GPT_Model.call(this);
}

// 2. Extend from parent object prototype (keep proto clean)
ModelBullet.prototype = Object.create(GPT_Model.prototype);

// 3. Repair the inherited constructor
ModelBullet.prototype.constructor = ModelBullet;

/**
 * Overriding it
 */
ModelBullet.prototype.get_geometry = function () {
    const _geom = new THREE.SphereGeometry(20, 10, 10);
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
            FlatShading: false,
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

export default ModelBullet;