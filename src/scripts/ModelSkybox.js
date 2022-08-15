import THREE from "../external-libs/threejs-0.118.3/three-global";
import GPT_Model from "../libgptjs/GPT_Model";
import Common from "./Common"

/**
 * Creates a Model of Skybox with a cube and environment map texture
 * Inherits from GPT_Model
 */
function ModelSkybox() {
    // 1. Call parent object
    GPT_Model.call(this);
}

// 2. Extend from parent object prototype (keep proto clean)
ModelSkybox.prototype = Object.create(GPT_Model.prototype);

// 3. Repair the inherited constructor
ModelSkybox.prototype.constructor = ModelSkybox

/**
 * Overriding in this child object
 */
ModelSkybox.prototype.get_geometry = function() {
    const _geom = new THREE.BoxGeometry(Common.SKYBOX_WIDTH, Common.SKYBOX_WIDTH, Common.SKYBOX_WIDTH);

    _geom.needsUpdate = true;
    return _geom;
}

/**
 * Overriding in this child object
 * Creates a ShaderMaterial in order to render the faces of "inside" the skybox
 */
ModelSkybox.prototype.get_material = function() {
    // loading TextureCube as skybox
    const _texLoader = new THREE.CubeTextureLoader();
    _texLoader.setPath(Common.SKYBOX_TEXTURE_PATH);
    const _cubeTex = _texLoader.load(Common.SKYBOX_TEXTURE_IMAGES_NAMES);

    const _mat = new THREE.MeshBasicMaterial(
        {
            color: 0xffffff, // white 
            flatShading: true,
            side: THREE.BackSide,
            transparent: false,
            envMap: _cubeTex
        }
    );

    _mat.needsUpdate = true;
    return _mat;
}

export default ModelSkybox